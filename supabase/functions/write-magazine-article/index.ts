import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const FUNCTION_VERSION = "write-magazine-article-v1";
const WRITING_MODEL = "claude-opus-4-6";

const VERTICALS: Record<string, string[]> = {
  "Power": ["Defence", "Trade", "Governance", "Diplomacy"],
  "Money": ["Markets", "Investment", "Real Estate", "Infrastructure Finance"],
  "Cities": ["Mobility", "Infrastructure", "Housing", "Architecture"],
  "Frontiers": ["Space", "AI & Tech", "Energy", "Oceans", "Health"],
  "Culture": ["Design", "Urban Life", "Film & Media", "Food", "Tourism"]
};

const MAGAZINE_PROMPT = `You are writing for The Urban Planet \u2014 a magazine in the tradition of Monocle.

Today: {{today}}

THE URBAN PLANET RELEVANCE FILTER:
Every article must pass this test: Does this story matter to the factors that determine how people live, invest, work, and play in the 3% of the world\u2019s surface where 70% of people live and 79% of GDP is created?

If the answer is no, kill the story. If the answer is yes, the urban angle IS the story.

We cover cities not as a beat but as the operating system of civilization. Defence procurement flows through urban factories. Energy transitions happen on urban grids. Trade corridors connect urban economies. AI labs cluster in urban districts. Culture lives in urban streets.

EDITOR\u2019S INSTRUCTIONS:
{{editors_note}}

THE SOURCE MATERIAL:
{{source_material}}

WRITE A MAGAZINE ARTICLE.

THE READER: Infrastructure CEO, defence executive, city mayor, urban planner, investor, policy-maker. They are busy, senior, and allergic to fluff. They want to know what happened, why it matters, and what to do about it.

THE VOICE: Authoritative but not academic. Informed but not dry. Write like Monocle \u2014 where the words and images are the focus, not tricky treatments. Declarative sentences. Specific facts. Named sources. Real numbers.

Working: \u201cSingapore has a problem that most cities would envy: too much success, not enough land.\u201d
Failing: \u201cIt remains to be seen...\u201d / \u201cThis underscores the importance of...\u201d / \u201cIn today\u2019s rapidly changing world...\u201d

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
CRITICAL HYPERLINK RULES \u2014 NON-NEGOTIABLE
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
1. Every factual claim MUST be [hyperlinked](url) to a REAL source.
2. NEVER link to perplexity.ai or any perplexity:// URL.
3. Only use https:// URLs from real news sites, government pages, corporate releases.
4. If a claim has no real URL, state the fact without a link \u2014 never invent a URL.
5. Every section should contain at least one hyperlink to an original source.
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

STRUCTURE:

## [Section heading \u2014 active, specific]

[Body paragraphs. 3-5 paragraphs per section. Each paragraph 2-4 sentences. Hyperlinked facts. Specific numbers, names, dates, dollar amounts.]

**[Bold subheading for new angle within the story]**

[More paragraphs...]

RULES:
- Open strong. First sentence must hook. No throat-clearing.
- Full proper titles on first reference: \u201cPrime Minister Mark Carney\u201d, \u201cEU Commissioner Maro\u0161 \u0160ef\u010dovi\u010d\u201d
- Dollar amounts, percentages, timelines \u2014 always specific
- Include direct quotes from named sources where available
- No passive voice on anything important
- No invented context or speculative claims
- Write 600-1200 words depending on the depth of material
- Do NOT include a title or headline \u2014 I will generate those separately

OUTPUT FORMAT \u2014 JSON only, no preamble, no markdown fences:
{
  "headline": "Punchy, specific, active verb. Max 12 words.",
  "deck": "One sentence that tells the reader why this matters. Max 25 words.",
  "body": "The full article in markdown with [hyperlinked](url) sources.",
  "vertical": "One of: Power, Money, Cities, Frontiers, Culture",
  "sub_vertical": "The specific sub-vertical from the list",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "source_urls": ["https://...", "https://..."],
  "read_time": 5,
  "image_search_terms": "3-5 words for finding a relevant Unsplash image"
}`;

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    const reqBody = await req.json().catch(() => ({}));
    console.log(`[${FUNCTION_VERSION}] Starting`);

    let sourceMaterial = reqBody.source_material || "";
    let editorsNote = reqBody.editors_note || "No specific editorial direction \u2014 write the strongest urban story from the material.";
    let vertical = reqBody.vertical || "";

    if (!sourceMaterial) {
      const lookback = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
      
      let query = supabase.from("rss_articles")
        .select("title, url, raw_summary, full_text, source_name, published_at, relevance_score, category")
        .gte("created_at", lookback)
        .gte("relevance_score", 6)
        .not("category", "in", "(perplexity_intelligence,perplexity_depth,live,context,historical)")
        .order("relevance_score", { ascending: false })
        .limit(15);

      if (vertical) {
        query = query.eq("vertical", vertical);
      }

      const { data: articles } = await query;

      if (!articles || articles.length === 0) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: "No high-relevance articles found in the last 48 hours" 
        }), { status: 404 });
      }

      sourceMaterial = articles.map(a =>
        `SOURCE: ${a.source_name} | SCORE: ${a.relevance_score}/10\nTITLE: ${a.title}\nURL: ${a.url}\nDATE: ${a.published_at}\nTEXT: ${(a.full_text || a.raw_summary || "(no text)").substring(0, 3000)}\n---`
      ).join("\n");
    }

    if (editorsNote === "No specific editorial direction \u2014 write the strongest urban story from the material.") {
      try {
        const ottawaDate = new Intl.DateTimeFormat("en-CA", { 
          timeZone: "America/Toronto", year: "numeric", month: "2-digit", day: "2-digit" 
        }).format(new Date());
        
        const { data: noteRow } = await supabase
          .from("editors_note")
          .select("instruction, context")
          .eq("active_date", ottawaDate)
          .eq("applied", false)
          .order("created_at", { ascending: false })
          .limit(1).single();
        
        if (noteRow) {
          editorsNote = noteRow.context 
            ? `${noteRow.instruction}\n\nCONTEXT: ${noteRow.context}` 
            : noteRow.instruction;
        }
      } catch { /* non-fatal */ }
    }

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Toronto", weekday: "long", year: "numeric", month: "long", day: "numeric"
    }).format(new Date());

    const filledPrompt = MAGAZINE_PROMPT
      .replace("{{today}}", today)
      .replace("{{editors_note}}", editorsNote)
      .replace("{{source_material}}", sourceMaterial);

    console.log(`[${FUNCTION_VERSION}] Calling ${WRITING_MODEL}`);
    const opusRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { 
        "x-api-key": ANTHROPIC_KEY, 
        "anthropic-version": "2023-06-01", 
        "content-type": "application/json" 
      },
      body: JSON.stringify({ 
        model: WRITING_MODEL, 
        max_tokens: 4000, 
        messages: [{ role: "user", content: filledPrompt }] 
      })
    });
    const opusData = await opusRes.json();
    const rawText = opusData.content?.[0]?.text || "";

    if (!rawText) {
      console.error(`[${FUNCTION_VERSION}] Opus returned empty`);
      return new Response(JSON.stringify({ success: false, error: "Opus returned empty", details: opusData }), { status: 500 });
    }

    let article;
    try {
      article = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    } catch {
      console.error(`[${FUNCTION_VERSION}] Failed to parse Opus output`);
      return new Response(JSON.stringify({ success: false, error: "Failed to parse article JSON", raw: rawText.substring(0, 500) }), { status: 500 });
    }

    let body = article.body || "";
    body = body.replace(/\[([^\]]+)\]\((?:perplexity:\/\/|https?:\/\/perplexity\.ai)[^)]*\)/g, '$1');

    const validVertical = VERTICALS[article.vertical] ? article.vertical : (vertical || "Cities");
    const validSubVertical = VERTICALS[validVertical]?.includes(article.sub_vertical) 
      ? article.sub_vertical 
      : VERTICALS[validVertical]?.[0] || "Infrastructure";

    const { data: mag, error: magError } = await supabase
      .from("magazine")
      .insert({
        headline: article.headline,
        deck: article.deck,
        body: body,
        vertical: validVertical,
        sub_vertical: validSubVertical,
        tags: article.tags || [],
        source_urls: article.source_urls || [],
        author: "The Urban Planet",
        read_time: article.read_time || 5,
        model_used: WRITING_MODEL,
        status: "draft",
        featured: false
      })
      .select().single();

    if (magError) throw magError;

    console.log(`[${FUNCTION_VERSION}] Article written \u2014 ${mag.id} | ${article.headline}`);
    return new Response(JSON.stringify({
      success: true,
      article_id: mag.id,
      headline: article.headline,
      vertical: validVertical,
      sub_vertical: validSubVertical,
      image_search_terms: article.image_search_terms,
      function_version: FUNCTION_VERSION,
      model: WRITING_MODEL
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    console.error(`[${FUNCTION_VERSION}] Error:`, err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500 });
  }
});
