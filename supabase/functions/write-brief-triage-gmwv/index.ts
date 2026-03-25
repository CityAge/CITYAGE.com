import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY")!;

const VERTICAL = "West Van Daybreaker";
const FUNCTION_VERSION = "write-brief-triage-gmwv-v5";
const TIMEZONE = "America/Vancouver";
const LOOKBACK_HOURS = 28;
const ARTICLE_LIMIT = 50;
const PERPLEXITY_LIMIT = 25;
const RELEVANCE_THRESHOLD = 5;
const FALLBACK_TRIAGE = "claude-sonnet-4-6";

function extractUrls(body: string): string[] {
  const urls: string[] = [];
  const re = /\]\((https?:\/\/[^)]+)\)/g;
  let m;
  while ((m = re.exec(body)) !== null) urls.push(m[1]);
  return urls;
}

function extractHeadlines(body: string): string[] {
  return body.split('\n')
    .filter(l => l.startsWith('## ') || l.match(/^[-] /))
    .map(l => l.replace(/[#*-]/g, '').trim().substring(0, 120));
}

function normaliseUrl(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes('google.com')) return url.split('?')[0];
    return `${u.hostname}${u.pathname}`;
  } catch { return url; }
}

const SONNET_PROMPT = `You are the senior editor of West Van Daybreaker, a daily newsletter for West Vancouver residents.

Today is {{today}}.
{{previous_context}}

You have two jobs:
1. SELECT the best stories from today's sources
2. DRAFT a first-pass bullet for each one — a single sentence with the key fact

Opus will read the full article text for each story and rewrite your drafts into final copy. Your job is to pick the right stories and extract the key fact from each. You are the editor. Opus is the writer.

FOUR RULES:
1. BYLAWS/COUNCIL: Explain what it does for residents in plain English. Never lead with a bylaw number.
   BAD: "OCP Amendment Bylaw 5428 goes to public hearing."
   GOOD: "West Van council hears March 30 on a zoning fix near Clyde Avenue east of Taylor Way."

2. HUMAN INTEREST: At least one named person doing something specific.

3. EVERY bullet needs one specific fact: name, dollar amount, address, date, or count.

4. BUSINESS NAMES: Use the actual name from the source text. Never "a popular chain" or "a local restaurant."
   The name IS in the source text. Find it.
   BAD: "Metro Vancouver's most popular hot pot chain opens at Park Royal."
   GOOD: "Haidilao signs a Park Royal lease — its first North Shore location."

KILL: vague stories, no facts, no West Van angle, weather (unless road closure), already covered, repeats lead.

BLOCKED:
URLs: {{blocked_urls}}
Headlines: {{blocked_headlines}}

RSS ARTICLES (full text where available):
{{article_context}}

POLICE / CRIME:
{{police_context}}

INTELLIGENCE (Perplexity — business names and bylaw explanations are often here):
{{intel_context}}

Output JSON only. No preamble. No markdown fences. No truncation — output the complete JSON.
{
  "lead": {
    "url": "",
    "draft": "One sentence cold open — just the fact.",
    "context": "Why it matters to a West Van resident.",
    "turn": "The observation they didn't see coming."
  },
  "bullets": [
    { "url": "", "draft": "One sentence. Specific fact. Business name if applicable.", "beat": "crime|environment|real_estate|council|business|infrastructure|schools|human_interest|transit|events|other" },
    { "url": "", "draft": "", "beat": "" },
    { "url": "", "draft": "", "beat": "" },
    { "url": "", "draft": "", "beat": "" },
    { "url": "", "draft": "", "beat": "" },
    { "url": "", "draft": "", "beat": "" },
    { "url": "", "draft": "", "beat": "" },
    { "url": "", "draft": "", "beat": "" },
    { "url": "", "draft": "", "beat": "" },
    { "url": "", "draft": "", "beat": "" }
  ],
  "lunch_wire": [
    { "url": "", "draft": "Straight deadpan fact. Stop before the explanation." },
    { "url": "", "draft": "" },
    { "url": "", "draft": "" }
  ],
  "killed": []
}`;

async function embedText(text: string): Promise<number[] | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({ model: "text-embedding-3-small", input: text.slice(0, 8000) })
    });
    const data = await res.json();
    return data?.data?.[0]?.embedding || null;
  } catch { return null; }
}

function dedupeArticles(articles: any[]): any[] {
  const seen = new Map<string, any>();
  for (const a of articles) {
    let domain = "";
    try { domain = new URL(a.url).hostname.replace(/^www\./, ""); } catch { domain = a.url; }
    const stem = (a.title || "").toLowerCase().replace(/[^a-z0-9 ]/g, "").substring(0, 40).trim();
    const key = `${domain}::${stem}`;
    if (!seen.has(key) || (a.relevance_score || 0) > (seen.get(key).relevance_score || 0)) seen.set(key, a);
  }
  return Array.from(seen.values());
}

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    const body = await req.json().catch(() => ({}));
    const testMode = body.test_mode === true;
    console.log(`[${FUNCTION_VERSION}] Starting - ${testMode ? 'TEST' : 'PRODUCTION'}`);

    let triageModel = FALLBACK_TRIAGE;
    try {
      const { data: m } = await supabase.from("model_config").select("model_string").eq("key", "triage_model").single();
      if (m) triageModel = m.model_string;
    } catch {}

    const now = new Date();
    const lookbackTime = new Date(now.getTime() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(now);
    const dateline = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, hour: "numeric", minute: "2-digit", hour12: true, weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(now) + " Pacific";

    const { data: rawArticles } = await supabase.from("rss_articles")
      .select("title, url, raw_summary, full_text, source_name, published_at, relevance_score, category")
      .eq("vertical", VERTICAL).gte("created_at", lookbackTime).gte("relevance_score", RELEVANCE_THRESHOLD)
      .not("category", "in", "(perplexity_intelligence,perplexity_depth,live,context,historical,news_burst)")
      .order("relevance_score", { ascending: false }).limit(ARTICLE_LIMIT * 3);

    const articles = dedupeArticles((rawArticles || []).filter(a => {
      if (a.category === "council_record" && !a.full_text) {
        const pub = a.published_at ? new Date(a.published_at) : null;
        if (!pub || pub < new Date(now.getTime() - 48 * 60 * 60 * 1000)) return false;
      }
      return true;
    })).slice(0, ARTICLE_LIMIT);

    const { data: perplexityRows } = await supabase.from("rss_articles")
      .select("title, url, full_text, raw_summary, notes, category, relevance_score")
      .eq("vertical", VERTICAL).gte("created_at", lookbackTime)
      .in("category", ["perplexity_intelligence", "perplexity_depth"])
      .order("relevance_score", { ascending: false }).limit(PERPLEXITY_LIMIT);

    const { data: recentBriefs } = await supabase.from("briefs")
      .select("body").eq("vertical", VERTICAL)
      .order("created_at", { ascending: false }).limit(3);

    const blockedUrls = new Set<string>();
    const blockedHeadlines: string[] = [];
    for (const b of (recentBriefs || [])) {
      for (const url of extractUrls(b.body || "")) blockedUrls.add(url);
      for (const h of extractHeadlines(b.body || "")) blockedHeadlines.push(h);
    }
    const freshArticles = articles.filter(a => !blockedUrls.has(a.url));

    const previousContext = recentBriefs?.[0]
      ? `\nYESTERDAY (do not repeat):\n${recentBriefs[0].body?.substring(0, 500)}` : "";

    const articleContext = freshArticles.map(a =>
      `URL: ${a.url}\nSOURCE: ${a.source_name} | SCORE: ${a.relevance_score}\nTITLE: ${a.title}\nTEXT: ${(a.full_text || a.raw_summary || "").substring(0, 1200)}\n---`
    ).join("\n") || "No fresh articles.";

    const policeContext = freshArticles
      .filter(a => a.category === "crime_safety" || a.source_name?.toLowerCase().includes("police") || a.source_name?.toLowerCase().includes("block watch"))
      .map(a => `URL: ${a.url}\n${a.title}\n${(a.full_text || a.raw_summary || "").substring(0, 800)}`)
      .join("\n---\n") || "No fresh police reports.";

    const intelItems = (perplexityRows || []);
    const intelContext = [
      intelItems.filter(p => p.category === "perplexity_depth").length > 0
        ? `=== DEPTH ===\n` + intelItems.filter(p => p.category === "perplexity_depth")
            .map(p => `${p.title}\n${(p.full_text || p.raw_summary || p.notes || "").substring(0, 1500)}\n---`).join("\n") : "",
      intelItems.filter(p => p.category === "perplexity_intelligence").length > 0
        ? `=== INTELLIGENCE ===\n` + intelItems.filter(p => p.category === "perplexity_intelligence")
            .map(p => `${p.title}\n${(p.full_text || p.raw_summary || p.notes || "").substring(0, 1000)}\n---`).join("\n") : ""
    ].filter(Boolean).join("\n\n") || "No intelligence.";

    const allItems = [...freshArticles, ...intelItems];
    const textByNormUrl = new Map<string, string>();
    const textByUrl = new Map<string, string>();
    for (const a of allItems) {
      if (!a.url) continue;
      const text = (a.full_text || a.raw_summary || a.notes || "").substring(0, 3000);
      if (!text) continue;
      textByUrl.set(a.url, `TITLE: ${a.title}\nSOURCE: ${a.source_name || ''}\nTEXT: ${text}`);
      textByNormUrl.set(normaliseUrl(a.url), `TITLE: ${a.title}\nSOURCE: ${a.source_name || ''}\nTEXT: ${text}`);
    }

    const getArticleText = (url: string): string => {
      return textByUrl.get(url) || textByNormUrl.get(normaliseUrl(url)) || "(source text not available)";
    };

    const sonnetFilled = SONNET_PROMPT
      .replace("{{today}}", today)
      .replace("{{previous_context}}", previousContext)
      .replace("{{blocked_urls}}", blockedUrls.size > 0 ? Array.from(blockedUrls).slice(0, 40).join("\n") : "(none)")
      .replace("{{blocked_headlines}}", blockedHeadlines.length > 0 ? blockedHeadlines.slice(0, 15).map(h => `- ${h}`).join("\n") : "(none)")
      .replace("{{article_context}}", articleContext)
      .replace("{{police_context}}", policeContext)
      .replace("{{intel_context}}", intelContext);

    console.log(`[${FUNCTION_VERSION}] Running Sonnet...`);
    const sonnetRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: triageModel, max_tokens: 4000, messages: [{ role: "user", content: sonnetFilled }] })
    });
    const sonnetData = await sonnetRes.json();
    let editorial: any = {};
    try {
      const raw = (sonnetData.content?.[0]?.text || "").replace(/```json|```/g, "").trim();
      editorial = JSON.parse(raw);
    } catch (e) {
      console.error(`[${FUNCTION_VERSION}] Sonnet JSON parse failed:`, sonnetData.content?.[0]?.text?.substring(0, 200));
      editorial = { raw: sonnetData.content?.[0]?.text };
    }

    const bulletCount = editorial?.bullets?.length || 0;
    console.log(`[${FUNCTION_VERSION}] Sonnet done. Bullets: ${bulletCount}`);

    const enrichItem = (item: any) => item ? {
      ...item,
      article_text: getArticleText(item.url)
    } : null;

    const enrichedEditorial = {
      ...editorial,
      lead: enrichItem(editorial?.lead),
      bullets: (editorial?.bullets || []).map(enrichItem),
      lunch_wire: (editorial?.lunch_wire || []).map(enrichItem)
    };

    let ragContext = "No related history.";
    try {
      const leadText = [editorial?.lead?.draft, editorial?.lead?.context].filter(Boolean).join(" ");
      if (leadText) {
        const embedding = await embedText(leadText);
        if (embedding) {
          const { data: ragDocs } = await supabase.rpc("match_documents", {
            query_embedding: embedding, match_vertical: VERTICAL, match_count: 5, days_lookback: 90, min_relevance: 5
          });
          if (ragDocs?.length > 0) {
            ragContext = ragDocs.map((d: any) => `- ${d.title}\n  ${(d.body || "").substring(0, 200)}`).join("\n");
            console.log(`[${FUNCTION_VERSION}] RAG: ${ragDocs.length} docs`);
          }
        }
      }
    } catch {}

    const { data: draft, error: draftError } = await supabase.from("brief_drafts").insert({
      vertical: VERTICAL,
      status: "ready",
      today_label: today,
      dateline,
      editorial_json: enrichedEditorial,
      rag_context: ragContext,
      editors_note: body.editor_note || null,
      triage_model: triageModel,
      test_mode: testMode
    }).select("id").single();
    if (draftError) throw draftError;

    console.log(`[${FUNCTION_VERSION}] Draft written - ${draft.id}`);
    return new Response(JSON.stringify({
      success: true, draft_id: draft.id, test_mode: testMode,
      bullets: bulletCount, function_version: FUNCTION_VERSION
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    console.error(`[${FUNCTION_VERSION}] Error:`, err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500 });
  }
});
