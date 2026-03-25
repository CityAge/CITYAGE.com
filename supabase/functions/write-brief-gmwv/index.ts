import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY")!;

const VERTICAL = "West Van Daybreaker";
const PUBLICATION_NAME = "West Van Daybreaker";
const FUNCTION_VERSION = "write-brief-gmwv-v31";

const TIMEZONE = "America/Vancouver";
const LOOKBACK_HOURS = 28;
const ARTICLE_LIMIT = 40;
const PERPLEXITY_LIMIT = 25;
const RELEVANCE_THRESHOLD = 5;
const FOOTER = `*${PUBLICATION_NAME} is a non-partisan publication of CityAge Media, for the people who live, want to live, or have never quite stopped thinking about this place. Contact: info@CityAge.com*`;

const FALLBACK_TRIAGE  = "claude-sonnet-4-6";
const FALLBACK_WRITING = "claude-opus-4-6";

function extractUrls(body: string): string[] {
  const urls: string[] = [];
  const re = /\]\((https?:\/\/[^)]+)\)/g;
  let m;
  while ((m = re.exec(body)) !== null) urls.push(m[1]);
  return urls;
}

function extractHeadlines(body: string): string[] {
  const lines = body.split('\n');
  const headlines: string[] = [];
  for (const line of lines) {
    if (line.startsWith('## ') || line.match(/^[-•] /)) {
      headlines.push(line.replace(/[#*\-•]/g, '').trim().substring(0, 120));
    }
  }
  return headlines;
}

const SONNET_PROMPT = `You are the senior editor of West Van Daybreaker — a daily Morning Brew-style newsletter for West Vancouver residents.

Today is {{today}}.
{{previous_context}}

YOUR TIP SHEET:
{{news_burst}}

Your job is simple: find the best stories and hand them to the writer.

THE FORMAT IS MORNING BREW:
- One lead story at the top. Three punchy paragraphs.
- 10-12 bullets covering the full community. One sentence each. No categories.
- 3 funny/absurd items for the Lunch Wire.

WHAT MAKES A GOOD BULLET:
- 242 salmon returned to Rodgers Creek this week — that's the best count since 2019.
- A parolee booked a short-term rental in British Properties and assaulted a woman. He's remanded to May 24.
- BC Ferries added 120 sailings to Horseshoe Bay–Langdale. The route lost $30M last year.

KILL:
- Anything without a specific fact (number, name, address, dollar amount)
- Generic Metro Vancouver stories with no West Van angle
- Weather unless it closes roads or triggers evacuations
- Stories already covered (see blocked list)

═══ DEDUP ═══
BLOCKED URLS:
{{blocked_urls}}

ALREADY COVERED:
{{blocked_headlines}}
════════════

SELECT:
1. LEAD — single most interesting story. Hard news preferred.
2. BULLETS — 10-12 items. Variety: crime, environment, real estate, council, business, infrastructure, schools, people, marine, events.
3. LUNCH WIRE — 3 funny, absurd, or surprising items.

RSS ARTICLES:
{{article_context}}

POLICE / CRIME:
{{police_context}}

INTELLIGENCE:
{{intel_context}}

Output JSON only — no preamble, no markdown fences:
{
  "lead": { "headline": "", "fact": "", "context": "", "turn": "", "quote": null, "url": "", "deeper_connection": null },
  "bullets": [
    { "text": "", "url": "" }
  ],
  "lunch_wire": [
    { "line": "", "url": "" }
  ],
  "killed": ["story — reason killed"]
}`;

const OPUS_PROMPT = `You are writing West Van Daybreaker — a daily Morning Brew-style intelligence brief for West Vancouver residents.

Today: {{today}}
{{editor_block}}

Your editor has selected today's stories:
{{editorial_note}}

Related history from the last 90 days:
{{rag_context}}

THE MODEL: MORNING BREW. Three sections. Tight. Scannable.

THE VOICE — MIRO: Twenty years in West Van. Write like you'd text a smart friend who also lives here. One sharp thing, move on. Don't explain the joke. Don't hedge.

WORKING:
- "A man slid 150 metres down Brunswick Mountain and stopped just above a waterfall."
- "33 homes sold. 162 listings. 103 days on market. That's not a housing market. That's a waiting room."

FAILING:
- "West Vancouver continues to grapple with..."
- Any sentence that could appear in a District newsletter.

SECTION 1: THE OPENING BELL
Three paragraphs. 120-160 words MAXIMUM.
P1: THE FACT. Cold open. P2: THE CONTEXT. P3: THE TURN.

SECTION 2: THE BULLETIN
10-12 bullets. One sentence each. 15-25 words. One specific fact. Hyperlinked.

SECTION 3: THE LUNCH WIRE
3 items. Funny, absurd, surprising. 🔹 prefix.

STRUCTURE:

# West Van Daybreaker
*{{dateline}} · 5 Minute Read*

## The Opening Bell
[P1] [P2] [P3]

## The Bulletin
- [bullets]

## The Lunch Wire
- 🔹 [items]

---
{{footer}}

TARGET: 400-550 words total.`;

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

function filterStaleArchive(articles: any[], now: Date): any[] {
  const cutoff48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  return articles.filter(a => {
    if (a.category === "council_record" && !a.full_text) {
      const pub = a.published_at ? new Date(a.published_at) : null;
      if (!pub || pub < cutoff48h) return false;
    }
    return true;
  });
}

async function embedText(text: string, openaiKey: string): Promise<number[] | null> {
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${openaiKey}` },
      body: JSON.stringify({ model: "text-embedding-3-small", input: text.slice(0, 8000) })
    });
    const data = await res.json();
    return data?.data?.[0]?.embedding || null;
  } catch { return null; }
}

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    const body = await req.json().catch(() => ({}));
    const testMode = body.test_mode === true;
    const targetTable = testMode ? 'brief_tests' : 'briefs';
    console.log(`[${FUNCTION_VERSION}] Starting — mode: ${testMode ? 'TEST' : 'PRODUCTION'}`);

    let triageModel = FALLBACK_TRIAGE;
    let writingModel = FALLBACK_WRITING;
    try {
      const { data: modelRows } = await supabase.from("model_config").select("key, model_string").in("key", ["triage_model", "writing_model"]);
      if (modelRows) { for (const row of modelRows) { if (row.key === "triage_model") triageModel = row.model_string; if (row.key === "writing_model") writingModel = row.model_string; } }
    } catch (e) { console.warn(`[${FUNCTION_VERSION}] model_config read failed:`, e); }

    const now = new Date();
    const lookbackTime = new Date(now.getTime() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(now);
    const dateline = new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, hour: "numeric", minute: "2-digit", hour12: true, weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(now) + " Pacific";

    const { data: newsBurstRows } = await supabase.from("rss_articles").select("title, full_text, raw_summary, notes").eq("vertical", VERTICAL).eq("category", "news_burst").gte("created_at", lookbackTime).order("created_at", { ascending: false }).limit(1);
    const newsBurst = newsBurstRows?.[0] ? (newsBurstRows[0].full_text || newsBurstRows[0].raw_summary || newsBurstRows[0].notes || "") : "No news burst available.";

    const { data: rawArticles } = await supabase.from("rss_articles").select("title, url, raw_summary, full_text, source_name, published_at, relevance_score, category").eq("vertical", VERTICAL).gte("created_at", lookbackTime).gte("relevance_score", RELEVANCE_THRESHOLD).not("category", "in", "(perplexity_intelligence,perplexity_depth,live,context,historical,news_burst)").order("relevance_score", { ascending: false }).limit(ARTICLE_LIMIT * 3);
    const filteredArticles = filterStaleArchive(rawArticles || [], now);
    const articles = dedupeArticles(filteredArticles).slice(0, ARTICLE_LIMIT);

    const { data: perplexityRows } = await supabase.from("rss_articles").select("title, full_text, raw_summary, notes, category, relevance_score").eq("vertical", VERTICAL).gte("created_at", lookbackTime).in("category", ["perplexity_intelligence", "perplexity_depth"]).order("relevance_score", { ascending: false }).limit(PERPLEXITY_LIMIT);

    const { data: recentBriefs } = await supabase.from("briefs").select("title, body, created_at").eq("vertical", VERTICAL).order("created_at", { ascending: false }).limit(3);

    const blockedUrls = new Set<string>();
    const blockedHeadlines: string[] = [];
    for (const b of (recentBriefs || [])) { for (const url of extractUrls(b.body || "")) blockedUrls.add(url); for (const h of extractHeadlines(b.body || "")) blockedHeadlines.push(h); }
    const blockedUrlsList = blockedUrls.size > 0 ? Array.from(blockedUrls).join("\n") : "(none)";
    const blockedHeadlinesList = blockedHeadlines.length > 0 ? blockedHeadlines.map(h => `• ${h}`).join("\n") : "(none)";

    const freshArticles = articles.filter(a => !blockedUrls.has(a.url));
    const previousContext = recentBriefs?.[0] ? `\nYESTERDAY (do not repeat):\n${recentBriefs[0].body?.substring(0, 500)}` : "";

    const articleContext = freshArticles.map(a => `[${a.source_name} | score:${a.relevance_score}] ${a.title}\nURL: ${a.url}\n${(a.full_text || a.raw_summary || "").substring(0, 1500)}\n---`).join("\n") || "No fresh RSS articles.";
    const policeContext = freshArticles.filter(a => a.category === "crime_safety" || a.source_name?.toLowerCase().includes("police") || a.source_name?.toLowerCase().includes("block watch")).map(a => `${a.title}\n${a.url}\n${(a.full_text || a.raw_summary || "").substring(0, 800)}`).join("\n---\n") || "No fresh police reports.";

    const intelItems = (perplexityRows || []);
    const depthItems = intelItems.filter(p => p.category === "perplexity_depth");
    const intelOnlyItems = intelItems.filter(p => p.category === "perplexity_intelligence");
    const intelContext = [
      depthItems.length > 0 ? `=== SOURCED DEPTH ===\n` + depthItems.map(p => `${p.title}\n${(p.full_text || p.raw_summary || p.notes || "").substring(0, 1200)}\n---`).join("\n") : "",
      intelOnlyItems.length > 0 ? `=== INTELLIGENCE ===\n` + intelOnlyItems.map(p => `${p.title}\n${(p.full_text || p.raw_summary || p.notes || "").substring(0, 800)}\n---`).join("\n") : ""
    ].filter(Boolean).join("\n\n") || "No intelligence.";

    const sonnetFilled = SONNET_PROMPT.replace("{{today}}", today).replace("{{previous_context}}", previousContext).replace("{{news_burst}}", newsBurst).replace("{{blocked_urls}}", blockedUrlsList).replace("{{blocked_headlines}}", blockedHeadlinesList).replace("{{article_context}}", articleContext).replace("{{police_context}}", policeContext).replace("{{intel_context}}", intelContext);

    const sonnetRes = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" }, body: JSON.stringify({ model: triageModel, max_tokens: 4000, messages: [{ role: "user", content: sonnetFilled }] }) });
    const sonnetData = await sonnetRes.json();
    let editorial: Record<string, unknown> = {};
    try { editorial = JSON.parse((sonnetData.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim()); } catch { editorial = { raw: sonnetData.content?.[0]?.text }; }
    const bulletCount = (editorial as any)?.bullets?.length || 0;

    let ragContext = "No related history.";
    try {
      const lead = editorial as any;
      const leadText = [lead?.lead?.headline, lead?.lead?.fact, lead?.lead?.context].filter(Boolean).join(" ");
      if (leadText) {
        const embedding = await embedText(leadText, OPENAI_KEY);
        if (embedding) {
          const { data: ragDocs } = await supabase.rpc("match_documents", { query_embedding: embedding, match_vertical: VERTICAL, match_count: 5, days_lookback: 90, min_relevance: 5 });
          if (ragDocs?.length > 0) ragContext = ragDocs.map((d: any) => `— ${d.title} (${new Date(d.published_at).toLocaleDateString("en-CA")})\n  ${(d.body || "").substring(0, 200)}`).join("\n");
        }
      }
    } catch (e) { console.warn(`[${FUNCTION_VERSION}] RAG failed:`, e); }

    const editorBlock = body.editor_note ? `\n\nEDITOR NOTE FROM MIRO:\n${body.editor_note}\n` : "";
    const opusFilled = OPUS_PROMPT.replace("{{today}}", today).replace("{{editor_block}}", editorBlock).replace("{{editorial_note}}", JSON.stringify(editorial, null, 2)).replace("{{rag_context}}", ragContext).replace("{{dateline}}", dateline).replace("{{footer}}", FOOTER);

    const opusRes = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" }, body: JSON.stringify({ model: writingModel, max_tokens: 10000, messages: [{ role: "user", content: opusFilled }] }) });
    const opusData = await opusRes.json();
    const briefBody = opusData.content?.[0]?.text || "Brief generation failed.";
    const opusTokens = opusData.usage?.output_tokens || 0;

    const title = `${PUBLICATION_NAME} — ${today}${testMode ? ' [TEST]' : ''}`;

    let briefId: string;
    if (testMode) {
      const { data: testBrief, error: testError } = await supabase.from('brief_tests').insert({ vertical: VERTICAL, title, body: briefBody, status: 'test', model_used: `${triageModel}→rag→${writingModel}-v31`, function_version: FUNCTION_VERSION, opus_tokens: opusTokens, rss_articles: freshArticles.length, perplexity_items: intelItems.length, bullets_selected: bulletCount, editor_note: body.editor_note || null }).select('id').single();
      if (testError) throw testError;
      briefId = testBrief.id;
    } else {
      const { data: prodBrief, error: prodError } = await supabase.from('briefs').insert({ vertical: VERTICAL, title, body: briefBody, status: 'draft', model_used: `${triageModel}→rag→${writingModel}-v31`, published_at: now.toISOString() }).select('id').single();
      if (prodError) throw prodError;
      briefId = prodBrief.id;
    }

    return new Response(JSON.stringify({ success: true, brief_id: briefId, table: targetTable, test_mode: testMode, title, function_version: FUNCTION_VERSION, opus_tokens: opusTokens, stats: { rss_articles: freshArticles.length, perplexity_items: intelItems.length, bullets_selected: bulletCount } }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(`[${FUNCTION_VERSION}] Error:`, err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500 });
  }
});
