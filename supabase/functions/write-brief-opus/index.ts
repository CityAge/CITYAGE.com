import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// write-brief-opus v5 — CEC Opus writing pass
// Reads from brief_drafts (written by write-brief-triage), runs Opus, saves to briefs
// Strips any perplexity URLs as safety net

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const VERTICAL = "Canada Europe Connects";
const FUNCTION_VERSION = "write-brief-opus-v4";
const FALLBACK_WRITING = "claude-opus-4-6";
const FOOTER = "*Defence. Energy. Trade. Technology. Capital. Weekday mornings. The Influence Letter is a publication of The Influence Company and CityAge Media.*";

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    let writingModel = FALLBACK_WRITING;
    try { const { data: mr } = await supabase.from("model_config").select("key, model_string").eq("key", "writing_model"); if (mr?.[0]) writingModel = mr[0].model_string; } catch {}

    const { data: draft, error: draftError } = await supabase.from("brief_drafts").select("*").eq("vertical", VERTICAL).in("status", ["ready", "triage_complete"]).order("created_at", { ascending: false }).limit(1).single();
    if (draftError || !draft) return new Response(JSON.stringify({ error: "No ready draft. Run write-brief-triage first." }), { status: 404 });

    await supabase.from("brief_drafts").update({ status: "consumed", writing_model: writingModel }).eq("id", draft.id);
    const today = draft.today_label || "";
    const corridorTemp = draft.canada_signal || "The corridor awaits today's developments.";

    const opusPrompt = `You are writing The Influence Letter — CEC Edition.\n\nToday: ${today}\n\nEDITOR'S NOTE:\n${draft.editors_note || "No editor's note — write from the research."}\n\nTHE CORRIDOR:\n${corridorTemp}\n\nANALYST RESEARCH:\n${JSON.stringify(draft.editorial_json, null, 2)}\n\nRELATED HISTORY:\n${draft.rag_context || "No related history."}\n\nVoice: Morning Brew meets Economist. Scannable, authoritative. US tone: analytical, never adversarial.\nRules: Every fact hyperlinked (real URLs only, never perplexity://). Full proper titles. Signal + Trade on every story.\n\nStructure:\n# The Influence Letter\n**Canada Europe Connects Edition**\n*${draft.dateline || ""}*\n*[Corridor sentence — italic]*\n---\n## [Lead] [150-200w] **The Signal:** **The Trade:**\n## [Second] [100-150w] **The Signal:** **The Trade:**\n## On The Radar\n- **[Beat]** — [40-60w]\n---\n${FOOTER}\n\nTOTAL: 1,100-1,300 words.`;

    const opusRes = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" }, body: JSON.stringify({ model: writingModel, max_tokens: 5000, messages: [{ role: "user", content: opusPrompt }] }) });
    let briefBody = (await opusRes.json()).content?.[0]?.text || "Brief generation failed.";
    if (briefBody === "Brief generation failed.") { await supabase.from("brief_drafts").update({ status: "failed" }).eq("id", draft.id); return new Response(JSON.stringify({ error: "Opus failed" }), { status: 500 }); }

    // Strip perplexity URLs
    const pCount = (briefBody.match(/perplexity\.ai|perplexity:\/\//g) || []).length;
    if (pCount > 0) briefBody = briefBody.replace(/\[([^\]]+)\]\((?:perplexity:\/\/|https?:\/\/perplexity\.ai)[^)]*\)/g, '$1');

    const title = `The Influence Letter — Canada Europe Connects — ${today}`;
    const { data: brief, error: briefError } = await supabase.from("briefs").insert({ vertical: VERTICAL, title, body: briefBody, status: "draft", model_used: `triage→${writingModel}-v4`, published_at: new Date().toISOString() }).select().single();
    if (briefError) throw briefError;
    await supabase.from("brief_drafts").update({ brief_id: brief.id }).eq("id", draft.id);

    return new Response(JSON.stringify({ success: true, brief_id: brief.id, title, writing_model: writingModel, draft_id: draft.id, perplexity_urls_stripped: pCount }), { headers: { "Content-Type": "application/json" } });
  } catch (err) { return new Response(JSON.stringify({ error: String(err) }), { status: 500 }); }
});
