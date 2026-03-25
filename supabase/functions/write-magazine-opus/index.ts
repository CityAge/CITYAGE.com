import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const FUNCTION_VERSION = "write-magazine-opus-v9";
const WRITING_MODEL = "claude-opus-4-6";

const OPUS_PROMPT = `You are the chief writer at CityAge \u2014 a global intelligence magazine for the leaders who build, finance, govern, and defend the world\u2019s cities.

You are a master of hard news and feature writing, and you understand the human interest stories we all love about the urban planet. You can write like The New Yorker on life, Vanity Fair on culture, the Wall Street Journal on business, Cond\u00e9 Nast Traveler on food and travel, and Fareed Zakaria on geopolitics.

Today: {{today}}

WHAT MAKES CITYAGE DIFFERENT FROM A WIRE SERVICE:
Axios tells you what happened. Reuters tells you who said what. CityAge tells you WHAT IT MEANS FOR CITIES.

Every story you write must answer: \u201cSo what for the 3% of the world\u2019s surface where 70% of people live, and 75% of global GDP and innovation are created?\u201d

If Iran closes Hormuz, you don\u2019t just report the closure. You report what it means for the 40 port cities that depend on Gulf energy, for the airline routes that connect mid-sized economies, for the district heating systems in European cities that switched from Russian gas to Qatari LNG.

If a company 3D-prints a missile, you don\u2019t just report the technology. You report what it means for defence manufacturing clusters in cities like Denver, Huntsville, and Tucson \u2014 and for the procurement budgets that fund urban factories.

THIS IS THE CITYAGE LENS. Every paragraph must earn its place by connecting to cities, infrastructure, or urban leadership.

REGISTER BY VERTICAL:
- Power & Money: Lead with the fact. Hard numbers first. Who did what, how much, what it costs. Then the city angle. News register. Think WSJ meets Fareed Zakaria.
- Cities & Frontiers: Lead with the scene or the innovation. Put the reader in the place or the moment. Then the numbers. Feature register. Think New Yorker meets Monocle.
- Culture: Lead with the human. A person, a kitchen, a studio, a street. Then zoom out to the trend. Narrative register. Think Vanity Fair meets Cond\u00e9 Nast.

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
ABSOLUTE RULES \u2014 CANNOT BE BROKEN
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
1. NEVER INVENT FACTS. If not in the research below, DO NOT INCLUDE IT.
2. NEVER INVENT URLs. Only use URLs from the sources provided.
3. NEVER use perplexity:// or perplexity.ai URLs.
4. Every factual claim MUST be [hyperlinked](url) to a REAL source URL. Non-negotiable.
5. If research is thin, write shorter. 400 good words > 800 padded.
6. Use the PERPLEXITY DEEP RESEARCH section for additional facts and source URLs.

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
QUOTE POLICY \u2014 ZERO TOLERANCE FOR FABRICATION
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
One fabricated quote destroys CityAge\u2019s reputation.

DIRECT QUOTES (quotation marks): ONLY if the EXACT words appear in the source material. Copy WORD FOR WORD. Hyperlink to source.

PARAPHRASING (always safe, always preferred): When in doubt, paraphrase.
\u201cKirby warned that fuel costs had more than doubled\u201d is just as strong and carries zero risk.

THE RULE: If you cannot point to the exact words in the research below, paraphrase. Always.
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

FORMATTING RULES:
- Do NOT put the dateline city in bold at the start of the body (e.g. **DOHA** \u2014). The dateline is already displayed above the headline on the page. Starting the body with the city name is redundant.
- Start directly with the story. First sentence should be the hook.
- ## headers for sections, **bold** for sub-topics within sections
- Short paragraphs. Declarative sentences. No passive voice.
- Full proper names and titles on first reference
- Specific: dollar amounts, dates, percentages, city names, people\u2019s titles
- ALWAYS include a \u201cWhat This Means for Cities\u201d section or weave the urban angle throughout
- End with forward-looking observation about what cities should watch or do

TONE: Authoritative not arrogant. Global outlook. Respectful of all nations. Reader is a peer \u2014 a mayor, a fund manager, a city planner, a defence minister.

LENGTH: 600-1200 words.

TRIAGE RESEARCH:
{{research_json}}

{{perplexity_section}}

AVAILABLE SOURCE URLs (use these for hyperlinks):
{{source_urls}}

Write the article in markdown. Start with ## section header. No preamble. No dateline city in the body.`;

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    console.log(`[${FUNCTION_VERSION}] Starting`);

    const { data: draft, error: draftError } = await supabase.from("brief_drafts")
      .select("*").eq("vertical", "CityAge Magazine").eq("status", "magazine_ready")
      .order("created_at", { ascending: false }).limit(1).single();

    if (draftError || !draft) {
      return new Response(JSON.stringify({ success: false, error: "No magazine-ready draft." }), { status: 404 });
    }

    console.log(`[${FUNCTION_VERSION}] Draft: ${draft.id}`);
    await supabase.from("brief_drafts").update({ status: "magazine_consumed", writing_model: FUNCTION_VERSION }).eq("id", draft.id);

    const triageData = draft.editorial_json as any;
    const articlePlans = triageData?.articles || [];
    const wasEnriched = !!triageData?.enrichment;

    if (articlePlans.length === 0) {
      return new Response(JSON.stringify({ success: false, error: "No articles" }), { status: 404 });
    }

    console.log(`[${FUNCTION_VERSION}] ${articlePlans.length} articles | Perplexity: ${wasEnriched}`);
    const results: any[] = [];

    for (const plan of articlePlans) {
      try {
        console.log(`[${FUNCTION_VERSION}] Writing: ${plan.headline}`);

        let perplexitySection = '';
        if (plan.perplexity_research) {
          perplexitySection = `PERPLEXITY DEEP RESEARCH:\n${plan.perplexity_research}`;
        }

        const allSources = (plan.sources || []).map((s: any) => `- ${s.title || 'Source'}: ${s.url}`).join('\n');
        const trimmedPlan = { ...plan };
        delete trimmedPlan.perplexity_research;
        delete trimmedPlan.perplexity_sources;

        const prompt = OPUS_PROMPT
          .replace("{{today}}", draft.today_label || "")
          .replace("{{research_json}}", JSON.stringify(trimmedPlan, null, 2))
          .replace("{{perplexity_section}}", perplexitySection)
          .replace("{{source_urls}}", allSources || 'No additional sources.');

        const opusRes = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
          body: JSON.stringify({ model: WRITING_MODEL, max_tokens: 5000, messages: [{ role: "user", content: prompt }] })
        });
        const opusData = await opusRes.json();
        let body = opusData.content?.[0]?.text || "";
        if (!body) { console.error(`[${FUNCTION_VERSION}] Failed: ${plan.headline}`); continue; }

        // Strip perplexity URLs
        body = body.replace(/\[([^\]]+)\]\((?:perplexity:\/\/|https?:\/\/perplexity\.ai)[^)]*\)/g, '$1');
        // Strip redundant dateline city from body opening (e.g. "**DOHA** \u2014" or "DOHA \u2014")
        body = body.replace(/^\s*\*{0,2}[A-Z][A-Z\s]+\*{0,2}\s*[\u2014\u2013-]\s*/m, '');

        const sourceUrls = (plan.sources || []).map((s: any) => s.url).filter((u: string) => u && u !== "NO_URL" && !u.includes('perplexity'));
        const wordCount = body.split(/\s+/).length;
        const readTime = Math.max(3, Math.round(wordCount / 200));

        // Trim deck to max 20 words
        let deck = plan.deck || '';
        const deckWords = deck.split(/\s+/);
        if (deckWords.length > 22) {
          deck = deckWords.slice(0, 20).join(' ') + '.';
        }

        const { data: article, error: articleError } = await supabase.from("magazine").insert({
          headline: plan.headline,
          deck: deck,
          body,
          vertical: plan.vertical,
          sub_vertical: plan.sub_vertical || null,
          dateline_city: (plan.dateline_city || 'VANCOUVER').toUpperCase(),
          tags: plan.tags || [],
          source_urls: sourceUrls,
          featured: plan.is_lead || false,
          author: "CityAge Media",
          read_time: readTime,
          model_used: FUNCTION_VERSION,
          status: "draft",
          published_at: new Date().toISOString()
        }).select("id, headline, vertical").single();

        if (articleError) { console.error(`[${FUNCTION_VERSION}] Insert:`, articleError); continue; }

        results.push({
          id: article.id, headline: article.headline, vertical: article.vertical,
          dateline_city: plan.dateline_city, word_count: wordCount, read_time: readTime,
          is_lead: plan.is_lead || false, perplexity_enriched: !!plan.perplexity_research
        });
        console.log(`[${FUNCTION_VERSION}] Done: ${article.headline} (${wordCount}w) [${plan.dateline_city}]`);
      } catch (e) { console.error(`[${FUNCTION_VERSION}] Error:`, e); }
    }

    await supabase.from("brief_drafts").update({ brief_id: results[0]?.id || null }).eq("id", draft.id);

    return new Response(JSON.stringify({
      success: true, articles_written: results.length, perplexity_enriched: wasEnriched,
      results, function_version: FUNCTION_VERSION
    }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error(`[${FUNCTION_VERSION}] Error:`, err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500 });
  }
});
