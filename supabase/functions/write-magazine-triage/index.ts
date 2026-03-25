import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const FUNCTION_VERSION = "write-magazine-triage-v10";
const TRIAGE_MODEL = "claude-sonnet-4-6";
const LOOKBACK_HOURS = 48;
const ARTICLE_LIMIT = 15;
const RELEVANCE_THRESHOLD = 6;

const TRIAGE_PROMPT = `You are the senior editor at CityAge \u2014 a global intelligence magazine for the leaders who build, finance, govern, and defend the world\u2019s cities.

Today is {{today}}.

WHAT MAKES CITYAGE DIFFERENT FROM A WIRE SERVICE:
Axios tells you what happened. Reuters tells you who said what. CityAge tells you WHAT IT MEANS FOR CITIES.

Every story must answer: \u201cSo what for the 3% of the world\u2019s surface where 70% of people live, and 75% of global GDP and innovation are created?\u201d

When you write why_it_matters, think specifically:
- Iran closes Hormuz \u2192 What does this mean for 40 port cities? For airline routes connecting mid-sized economies? For European district heating?
- 3D-printed missiles \u2192 What does this mean for defence manufacturing clusters in Denver, Huntsville, Tucson? For procurement budgets funding urban factories?
- Institutional capital in space \u2192 Why does this matter to cities whose GPS logistics, climate monitoring, and broadband depend on orbital infrastructure?

THIS IS THE CITYAGE LENS. Apply it to every story.

VERTICALS:
Power (Defence, Trade, Governance) | Money (Markets, Investment, Infrastructure Finance) | Cities (Mobility, Housing, Architecture) | Frontiers (Space, AI, Energy, Health) | Culture (Design, Entertainment, Fashion, Food, Gaming)

FRESHNESS: Last 48 hours only. Never select stories older than 72 hours.

EDITOR: {{editors_note}}

SKIP: {{dedup_context}}

SOURCES:
{{article_context}}

Select 3 stories. One LEAD, two SUPPORTING. Diversity across verticals.

RULES:
1. Only facts from sources above. Never invent.
2. Real source URLs only.
3. Verbatim quotes only.
4. dateline_city = city where news originates.
5. why_it_matters must name specific cities affected.

Output ONLY valid JSON:
{
  "triage_date": "{{today}}",
  "articles": [
    {
      "headline": "max 10 words, active verb, CityAge angle",
      "deck": "max 18 words. The SO WHAT for cities. Tight and punchy.",
      "dateline_city": "CITY",
      "vertical": "Power|Money|Cities|Frontiers|Culture",
      "sub_vertical": "sub",
      "is_lead": true,
      "what_happened": "3-5 fact sentences",
      "why_it_matters": "3-4 sentences naming specific cities affected. Most important field.",
      "key_facts": ["numbers"],
      "key_quotes": ["verbatim only"],
      "key_people": ["name, title, org"],
      "sources": [{"title": "t", "url": "https://..."}],
      "confidence": "high|medium|low",
      "tags": ["tag1"]
    }
  ],
  "killed": ["topic \u2014 reason"]
}`;

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    const reqBody = await req.json().catch(() => ({}));
    console.log(`[${FUNCTION_VERSION}] Starting`);

    const now = new Date();
    const lookbackTime = new Date(now.getTime() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto", weekday: "long", year: "numeric", month: "long", day: "numeric"
    }).format(now);

    const editorsNote = reqBody.editor_note || "3 stories. One lead, two supporting. Diversity across verticals.";

    const { data: articles, error: artErr } = await supabase.from("magazine_articles")
      .select("title, url, raw_summary, full_text, source_name, published_at, relevance_score, category, magazine_vertical")
      .eq("is_scored", true).eq("is_relevant", true).eq("is_duplicate", false)
      .gte("published_at", lookbackTime).gte("relevance_score", RELEVANCE_THRESHOLD)
      .order("relevance_score", { ascending: false }).limit(ARTICLE_LIMIT);

    if (artErr) throw new Error(`query: ${artErr.message}`);
    console.log(`[${FUNCTION_VERSION}] ${articles?.length || 0} fresh articles`);
    if (!articles || articles.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "No fresh articles" }), { status: 404, headers: { "Content-Type": "application/json" } });
    }

    const { data: recentMag } = await supabase.from("magazine")
      .select("headline, vertical").in("status", ["published", "draft"])
      .order("created_at", { ascending: false }).limit(25);
    const dedupLines = (recentMag || []).map(m => `- [${m.vertical}] ${m.headline}`).join("\n") || "None.";

    const articleContext = articles.map(a =>
      `SOURCE: ${a.source_name} | ${a.magazine_vertical} | SCORE: ${a.relevance_score}/10 | ${a.published_at}\nTITLE: ${a.title}\nURL: ${a.url}\nTEXT: ${(a.full_text || a.raw_summary || "").substring(0, 1200)}\n---`
    ).join("\n");

    const prompt = TRIAGE_PROMPT
      .replace(/\{\{today\}\}/g, today)
      .replace("{{editors_note}}", editorsNote)
      .replace("{{dedup_context}}", dedupLines)
      .replace("{{article_context}}", articleContext);

    console.log(`[${FUNCTION_VERSION}] Prompt: ${prompt.length} chars`);

    const triageRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: TRIAGE_MODEL, max_tokens: 4000, messages: [{ role: "user", content: prompt }] })
    });

    if (!triageRes.ok) { const e = await triageRes.text(); throw new Error(`Sonnet ${triageRes.status}: ${e.slice(0, 200)}`); }
    const triageData = await triageRes.json();
    const rawText = triageData.content?.[0]?.text || "";
    if (!rawText) throw new Error("Empty");

    let triageResult: any = {};
    try { triageResult = JSON.parse(rawText.replace(/```json|```/g, "").trim()); }
    catch (e) { throw new Error(`JSON: ${(e as Error).message}`); }

    const cleaned = JSON.stringify(triageResult).replace(/"perplexity:\/\/[^"]*"/g, '"NO_URL"').replace(/"https?:\/\/perplexity\.ai[^"]*"/g, '"NO_URL"');
    try { triageResult = JSON.parse(cleaned); } catch {}

    const { data: draft, error: draftError } = await supabase.from("brief_drafts").insert({
      vertical: "CityAge Magazine", today_label: today, dateline: today,
      editorial_json: triageResult, editors_note: editorsNote,
      rag_context: "", status: "magazine_ready", triage_model: FUNCTION_VERSION
    }).select().single();

    if (draftError) { console.error(`[${FUNCTION_VERSION}] INSERT: ${draftError.message}`); throw new Error(`Insert: ${draftError.message}`); }

    const headlines = (triageResult.articles || []).map((a: any) => `${a.dateline_city}: ${a.headline}`).join(' | ');
    console.log(`[${FUNCTION_VERSION}] Done | ${headlines}`);
    return new Response(JSON.stringify({ success: true, draft_id: draft.id, articles_selected: triageResult.articles?.length || 0, headlines }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(`[${FUNCTION_VERSION}] Error:`, err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
});
