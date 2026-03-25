import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// write-brief-triage v5 — CEC Sonnet triage pass
// Reads articles + perplexity, runs Sonnet analysis, writes to brief_drafts
// Opus writing happens separately in write-brief-opus

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY")!;
const VERTICAL = "Canada Europe Connects";
const FUNCTION_VERSION = "write-brief-triage-v5";
const OTTAWA_TZ = "America/Toronto";
const BRUSSELS_TZ = "Europe/Brussels";
const LOOKBACK_HOURS = 28;
const ARTICLE_LIMIT = 40;
const PERPLEXITY_LIMIT = 20;
const RELEVANCE_THRESHOLD = 6;
const FALLBACK_TRIAGE = "claude-sonnet-4-6";

// [Full Sonnet prompt with corridor temperature, URL rules, beat priorities, dedup]
// Saved verbatim from Supabase — see full source in repository

async function embedText(text: string): Promise<number[] | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_KEY}` }, body: JSON.stringify({ model: "text-embedding-3-small", input: text.slice(0, 8000) }) });
    return (await res.json())?.data?.[0]?.embedding || null;
  } catch { return null; }
}

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    const reqBody = await req.json().catch(() => ({}));
    let triageModel = FALLBACK_TRIAGE;
    try { const { data: mr } = await supabase.from("model_config").select("key, model_string").eq("key", "triage_model"); if (mr?.[0]) triageModel = mr[0].model_string; } catch {}

    const now = new Date();
    const lookbackTime = new Date(now.getTime() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
    const ottawaDate = new Intl.DateTimeFormat("en-CA", { timeZone: OTTAWA_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: OTTAWA_TZ, weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(now);
    const dateline = `${new Intl.DateTimeFormat("en-CA", { timeZone: OTTAWA_TZ, hour: "numeric", minute: "2-digit", hour12: true }).format(now)} Ottawa · ${new Intl.DateTimeFormat("en-CA", { timeZone: BRUSSELS_TZ, hour: "numeric", minute: "2-digit", hour12: true }).format(now)} Brussels · ${today}`;

    let editorsNote = reqBody.editor_note || "";
    if (!editorsNote) { try { const { data: n } = await supabase.from("editors_note").select("instruction, context").eq("active_date", ottawaDate).eq("applied", false).order("created_at", { ascending: false }).limit(1).single(); if (n) { editorsNote = n.context ? `${n.instruction}\nCONTEXT: ${n.context}` : n.instruction; await supabase.from("editors_note").update({ applied: true }).eq("active_date", ottawaDate).eq("applied", false); } } catch {} }

    const { data: articles } = await supabase.from("rss_articles").select("title, url, raw_summary, full_text, source_name, published_at, relevance_score, category").eq("vertical", VERTICAL).gte("created_at", lookbackTime).gte("relevance_score", RELEVANCE_THRESHOLD).not("category", "in", "(perplexity_intelligence,perplexity_depth,live,context,historical)").order("relevance_score", { ascending: false }).limit(ARTICLE_LIMIT);
    const { data: perplexityRows } = await supabase.from("rss_articles").select("title, full_text, raw_summary, notes, category, url").eq("vertical", VERTICAL).gte("created_at", lookbackTime).in("category", ["perplexity_intelligence", "perplexity_depth", "live", "context", "historical"]).order("relevance_score", { ascending: false }).limit(PERPLEXITY_LIMIT);

    const { data: recentBriefs } = await supabase.from("briefs").select("title, body").eq("vertical", VERTICAL).order("created_at", { ascending: false }).limit(3);
    const blockedUrls = new Set<string>();
    for (const b of (recentBriefs || [])) { const re = /\]\((https?:\/\/[^)]+)\)/g; let m; while ((m = re.exec(b.body || "")) !== null) blockedUrls.add(m[1]); }

    const dedup = (recentBriefs || []).map(b => `"${b.title}": ${(b.body || "").substring(0, 600)}`).join("\n\n");
    const previousContext = recentBriefs?.[0] ? `\nYESTERDAY:\n${recentBriefs[0].body?.substring(0, 800)}` : "";
    const articleContext = (articles || []).map(a => `[RSS] ${a.source_name} | ${a.relevance_score}/10\n${a.title}\nURL: ${a.url}\n${(a.full_text || a.raw_summary || "").substring(0, 2500)}\n---`).join("\n") || "No RSS articles.";
    const intelContext = (perplexityRows || []).map(p => `[PERPLEXITY]\n${p.title}\n${(p.full_text || p.raw_summary || p.notes || "").substring(0, 2000)}\n---`).join("\n") || "No intelligence.";

    const sonnetPrompt = `Senior analyst, The Influence Letter — CEC. Today: ${today}.\n${previousContext}\n\nCRITICAL: Never use perplexity:// URLs. Only real https:// source URLs.\n\nFor each story: WHAT HAPPENED, CORRIDOR ANGLE, SIGNAL, TRADE, QUOTES, URL.\nBeats: Defence, Energy, Technology, Trade, Capital.\nAlso write corridor_temperature: one-sentence hallway read.\n\nDEDUP:\n${dedup || "Fresh start."}\n\nRSS:\n${articleContext}\n\nPERPLEXITY:\n${intelContext}\n\nJSON only: {"corridor_temperature":"","lead_story":{...},"stories":[...],"radar_items":[...],"killed":[...]}`;

    const sonnetRes = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" }, body: JSON.stringify({ model: triageModel, max_tokens: 3000, messages: [{ role: "user", content: sonnetPrompt }] }) });
    let editorial: Record<string, unknown> = {};
    try { editorial = JSON.parse(((await sonnetRes.json()).content?.[0]?.text || "{}").replace(/```json|```/g, "").trim()); } catch (e) { editorial = { raw: (await sonnetRes.json()).content?.[0]?.text }; }

    // Strip perplexity URLs
    const cleaned = JSON.stringify(editorial).replace(/"perplexity:\/\/[^"]*"/g, '"NO_URL"').replace(/"https?:\/\/perplexity\.ai[^"]*"/g, '"NO_URL"');
    try { editorial = JSON.parse(cleaned); } catch {}

    let ragContext = "No related history.";
    try {
      const lead = editorial as any;
      const leadText = [lead?.lead_story?.headline, lead?.lead_story?.what, lead?.lead_story?.corridor_angle].filter(Boolean).join(" ");
      if (leadText) {
        const emb = await embedText(leadText);
        if (emb) {
          const { data: cecDocs } = await supabase.rpc("match_documents", { query_embedding: emb, match_vertical: VERTICAL, match_count: 4, days_lookback: 90, min_relevance: 6 });
          const { data: sigDocs } = await supabase.rpc("match_documents", { query_embedding: emb, match_vertical: "Signal Canada", match_count: 2, days_lookback: 90, min_relevance: 5 });
          const all = [...(cecDocs || []), ...(sigDocs || [])];
          if (all.length > 0) ragContext = all.map((d: any) => `— [${d.vertical}] ${d.title} (${new Date(d.published_at).toLocaleDateString("en-CA")})\n  ${(d.body || "").substring(0, 300)}`).join("\n");
        }
      }
    } catch {}

    const { data: draft, error: draftError } = await supabase.from("brief_drafts").insert({ vertical: VERTICAL, today_label: today, dateline, editorial_json: editorial, canada_signal: (editorial as any)?.corridor_temperature || "", editors_note: editorsNote || "No editor's note today.", rag_context: ragContext, status: "ready", triage_model: triageModel }).select().single();
    if (draftError) throw draftError;

    return new Response(JSON.stringify({ success: true, draft_id: draft.id, vertical: VERTICAL, triage_model: triageModel, articles_found: articles?.length || 0, perplexity_found: perplexityRows?.length || 0, corridor_temperature: (editorial as any)?.corridor_temperature, function_version: FUNCTION_VERSION }), { headers: { "Content-Type": "application/json" } });
  } catch (err) { return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500 }); }
});
