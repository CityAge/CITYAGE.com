import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY")!;

const VERTICAL = "Canada Europe Connects";
const FUNCTION_VERSION = "write-brief-v30";

const OTTAWA_TZ  = "America/Toronto";
const BRUSSELS_TZ = "Europe/Brussels";
const LOOKBACK_HOURS = 28;
const ARTICLE_LIMIT = 40;
const PERPLEXITY_LIMIT = 20;
const RELEVANCE_THRESHOLD = 6;
const FOOTER = "*Defence. Energy. Trade. Technology. Capital. Weekday mornings. The Influence Letter is a publication of The Influence Company and CityAge Media.*";

const FALLBACK_TRIAGE  = "claude-sonnet-4-6";
const FALLBACK_WRITING = "claude-opus-4-6";

const SONNET_PROMPT = `You are the senior analyst for The Influence Letter — Canada Europe Connects Edition.

Today is {{today}}.
{{previous_context}}

You have RSS articles and Perplexity intelligence covering the transatlantic corridor: defence, energy, technology, trade, and capital between Canada and Europe.

YOUR JOB: Extract the real material. Find what shifted. Build the editorial brief that Opus will write from.

For each story worth covering:
- WHAT HAPPENED — specific facts, figures, dollar amounts, vote counts, named individuals with full titles
- THE CORRIDOR ANGLE — why this matters for Canada-Europe specifically
- THE SIGNAL — one sentence: what strategic door opened or closed
- THE TRADE — one sentence: the business or policy action this creates
- VERBATIM QUOTES — pulled directly from source text
- URL — source link

BEAT PRIORITIES:
1. Defence & Security — SAFE, Arctic, NATO industrial base
2. Energy & Climate — hydrogen, critical minerals, carbon border, clean tech, LNG
3. Technology & AI — data governance, dual-use, digital trade, quantum, cyber
4. Trade & Industrial Policy — CETA, supply chain, EU derisking
5. Capital & Infrastructure — European investment, pension funds, co-financing

DEDUP — skip anything without a material new development:
{{dedup_context}}

RSS ARTICLES:
{{article_context}}

PERPLEXITY INTELLIGENCE:
{{intel_context}}

Output JSON only — no preamble, no markdown fences:
{
  "lead_story": {
    "headline": "active verb, specific",
    "beat": "beat name",
    "what": "specific event with real numbers",
    "corridor_angle": "Canada-Europe angle",
    "signal": "one sentence",
    "trade": "one sentence",
    "quotes": ["verbatim from source"],
    "facts": ["specific figure"],
    "url": "source url"
  },
  "stories": [
    { "headline": "", "beat": "", "what": "", "corridor_angle": "", "signal": "", "trade": "", "quotes": [], "facts": [], "url": "" }
  ],
  "radar_items": [
    { "beat": "", "what": "", "signal_or_trade": "", "url": "" }
  ],
  "killed": ["story — reason"]
}`;

const OPUS_PROMPT = `You are writing The Influence Letter — Canada Europe Connects Edition.

Today: {{today}}

EDITOR'S NOTE — read this first. This is the analytical lens for today's brief:
{{editors_note}}

THE CANADA SIGNAL — reputation intelligence this week:
{{canada_signal}}

YOUR ANALYST HAS DONE THE RESEARCH:
{{editorial_note}}

RELATED HISTORY — what we've covered on similar topics in the last 90 days (CEC + Signal Canada):
{{rag_context}}
Use this as background only. If a story is ongoing, note what has developed since we last covered it — briefly, in the publication voice.

YOUR ONLY JOB IS TO WRITE.

THE READER: Senior policy professional, trade lawyer, pension fund executive, defence procurement lead, minister's chief of staff. Five minutes. They need to know what shifted and who should be calling whom.

THE VOICE: Morning Brew meets the Economist Briefing. Scannable but authoritative. Short paragraphs. Declarative sentences. No throat-clearing.

Working: "Brussels didn't kill the deal. It repriced it."
Failing: "It remains to be seen..." / "This underscores the importance of..."

TONE ON THE UNITED STATES: The United States is Canada's historic friend, largest trading partner, and closest ally. Cover US-Canada friction analytically and clearly — never emotionally, never adversarially. No nationalist rhetoric. No triumphalism. No alarm. Write the way a serious financial publication covers a business dispute between long-term partners.

RULES:
- Open with THE CANADA SIGNAL block — include the index scores and weekly signal, then 60-80 words of context
- The Editor's Note shapes your analytical framing — use it, don't quote it
- Full proper titles on first reference always
- Dollar amounts, vote counts, timelines — always specific
- Every factual claim [hyperlinked](url)
- End every major story with The Signal and The Trade on their own lines
- No passive voice on anything important
- No invented context

STRUCTURE:

# The Influence Letter
**Canada Europe Connects Edition**
*{{dateline}}*

## The Canada Signal

**{{index_line}}**

[60-80 words. The ambient reputation read this week — what the index scores mean, what's moving, what the reader should hold in mind as they read today's stories. Analytical. No sentiment.]

---

## [Lead headline — active verb]

[150-200 words. Real figures. Full proper names. Hyperlinked. Verbatim quotes.]

**The Signal:** [one sentence — what shifted]
**The Trade:** [one sentence — the action + timeline]

## [Second headline]
[100-150 words.]
**The Signal:** [one sentence]
**The Trade:** [one sentence]

## [Third headline if strong material]
[100-150 words.]
**The Signal:** [one sentence]
**The Trade:** [one sentence]

## On The Radar
- **[Beat]** — [40-60 words. One Signal or Trade line. Hyperlinked.]
- **[Beat]** — [same]
- **[Beat]** — [same]

---
${FOOTER}

TOTAL: 1,100-1,300 words.`;

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

function arrow(delta: number | null): string {
  if (delta === null) return '';
  if (delta > 0) return ` ↑${delta}`;
  if (delta < 0) return ` ↓${Math.abs(delta)}`;
  return ' →';
}

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    const reqBody = await req.json().catch(() => ({}));
    console.log(`[${FUNCTION_VERSION}] Starting`);

    // ── Model config
    let triageModel  = FALLBACK_TRIAGE;
    let writingModel = FALLBACK_WRITING;
    try {
      const { data: modelRows } = await supabase
        .from("model_config")
        .select("key, model_string")
        .in("key", ["triage_model", "writing_model"]);
      if (modelRows) {
        for (const row of modelRows) {
          if (row.key === "triage_model")  triageModel  = row.model_string;
          if (row.key === "writing_model") writingModel = row.model_string;
        }
      }
    } catch (e) {
      console.warn(`[${FUNCTION_VERSION}] model_config read failed, using fallbacks:`, e);
    }

    const now = new Date();
    const lookbackTime = new Date(now.getTime() - LOOKBACK_HOURS * 60 * 60 * 1000).toISOString();
    const ottawaDate = new Intl.DateTimeFormat("en-CA", { timeZone: OTTAWA_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: OTTAWA_TZ, weekday: "long", year: "numeric", month: "long", day: "numeric"
    }).format(now);

    const dateline = `${new Intl.DateTimeFormat("en-CA", { timeZone: OTTAWA_TZ, hour: "numeric", minute: "2-digit", hour12: true }).format(now)} Ottawa · ${new Intl.DateTimeFormat("en-CA", { timeZone: BRUSSELS_TZ, hour: "numeric", minute: "2-digit", hour12: true }).format(now)} Brussels · ${today}`;

    // ── Editor's Note
    let editorsNote = reqBody.editor_note || "";
    if (!editorsNote) {
      try {
        const { data: noteRow } = await supabase
          .from("editors_note")
          .select("instruction, context")
          .eq("active_date", ottawaDate)
          .eq("applied", false)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
        if (noteRow) {
          editorsNote = noteRow.context
            ? `${noteRow.instruction}\n\nCONTEXT: ${noteRow.context}`
            : noteRow.instruction;
          await supabase.from("editors_note").update({ applied: true }).eq("active_date", ottawaDate).eq("applied", false);
          console.log(`[${FUNCTION_VERSION}] Editor's note loaded`);
        }
      } catch (e) {
        console.warn(`[${FUNCTION_VERSION}] editors_note fetch failed (non-fatal):`, e);
      }
    }
    const editorsNoteBlock = editorsNote || "No editor's note today — write from the research.";

    // ── Canada Signal Index + brief
    let canadaSignal = "No Signal Canada data available this week.";
    let indexLine = "Canada Signal Index: no data";
    try {
      const { data: indexRow } = await supabase
        .from("canada_signal_index")
        .select("*")
        .order("week_of", { ascending: false })
        .limit(1)
        .single();

      if (indexRow) {
        indexLine = `Canada Signal Index: ${indexRow.composite_score}/100${arrow(indexRow.composite_delta)} · ${indexRow.overall_direction?.charAt(0).toUpperCase()}${indexRow.overall_direction?.slice(1)} · Washington ${indexRow.washington_score}${arrow(indexRow.washington_delta)} · Brussels ${indexRow.brussels_score}${arrow(indexRow.brussels_delta)} · Beijing ${indexRow.beijing_score}${arrow(indexRow.beijing_delta)} · New Delhi ${indexRow.new_delhi_score}${arrow(indexRow.new_delhi_delta)}`;

        canadaSignal = `INDEX (week of ${indexRow.week_of}): ${indexLine}\n\nWEEKLY SIGNAL: ${indexRow.weekly_signal}\n\nRATIONALE:\n- Geopolitical (${indexRow.geopolitical_score}): ${indexRow.scoring_rationale?.geopolitical || ''}\n- Investment (${indexRow.investment_score}): ${indexRow.scoring_rationale?.investment || ''}\n- Narrative (${indexRow.narrative_score}): ${indexRow.scoring_rationale?.narrative || ''}\n- Washington (${indexRow.washington_score}): ${indexRow.scoring_rationale?.washington || ''}\n- Brussels (${indexRow.brussels_score}): ${indexRow.scoring_rationale?.brussels || ''}\n- Beijing (${indexRow.beijing_score}): ${indexRow.scoring_rationale?.beijing || ''}\n- New Delhi (${indexRow.new_delhi_score}): ${indexRow.scoring_rationale?.new_delhi || ''}`;
        console.log(`[${FUNCTION_VERSION}] Signal Index loaded: composite ${indexRow.composite_score}`);
      }

      const { data: signalBrief } = await supabase
        .from("briefs")
        .select("body, created_at")
        .eq("vertical", "Signal Canada")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      if (signalBrief?.body) {
        canadaSignal += `\n\nFROM SIGNAL CANADA BRIEF (${new Date(signalBrief.created_at).toLocaleDateString("en-CA")}):\n${signalBrief.body.substring(0, 800)}`;
      }
    } catch (e) {
      console.warn(`[${FUNCTION_VERSION}] Signal Canada fetch failed (non-fatal):`, e);
    }

    const { data: articles } = await supabase
      .from("rss_articles")
      .select("title, url, raw_summary, full_text, source_name, published_at, relevance_score, category")
      .eq("vertical", VERTICAL)
      .gte("created_at", lookbackTime)
      .gte("relevance_score", RELEVANCE_THRESHOLD)
      .not("category", "in", "(perplexity_intelligence,perplexity_depth,live,context,historical)")
      .order("relevance_score", { ascending: false })
      .limit(ARTICLE_LIMIT);

    const { data: perplexityRows } = await supabase
      .from("rss_articles")
      .select("title, full_text, raw_summary, notes, category")
      .eq("vertical", VERTICAL)
      .gte("created_at", lookbackTime)
      .in("category", ["perplexity_intelligence", "perplexity_depth", "live", "context", "historical"])
      .order("relevance_score", { ascending: false })
      .limit(PERPLEXITY_LIMIT);

    const dedup48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const { data: recentBriefs } = await supabase
      .from("briefs")
      .select("title, body")
      .eq("vertical", VERTICAL)
      .gte("created_at", dedup48h.toISOString())
      .lt("created_at", now.toISOString())
      .order("created_at", { ascending: false })
      .limit(2);

    const articleContext = (articles || []).map(a =>
      `SOURCE: ${a.source_name} | SCORE: ${a.relevance_score}/10\nTITLE: ${a.title}\nURL: ${a.url}\nDATE: ${a.published_at}\nTEXT: ${(a.full_text || a.raw_summary || "(no text)").substring(0, 2500)}\n---`
    ).join("\n") || "No RSS articles this window.";

    const intelContext = (perplexityRows || []).map(p =>
      `${p.title}\n${(p.full_text || p.raw_summary || p.notes || "").substring(0, 1500)}\n---`
    ).join("\n") || "No Perplexity intelligence this window.";

    const dedupLines = (recentBriefs || []).map(b => `"${b.title}": ${(b.body || "").substring(0, 600)}`).join("\n\n");
    const dedup = dedupLines
      ? `COVERED IN LAST 48 HOURS — skip unless material new development:\n${dedupLines}`
      : "No previous brief — fresh start.";

    const previousContext = recentBriefs?.[0]
      ? `\n\nYESTERDAY'S BRIEF (first 800 chars):\n${recentBriefs[0].body?.substring(0, 800)}`
      : "";

    const sonnetFilled = SONNET_PROMPT
      .replace("{{today}}", today)
      .replace("{{previous_context}}", previousContext)
      .replace("{{dedup_context}}", dedup)
      .replace("{{article_context}}", articleContext)
      .replace("{{intel_context}}", intelContext);

    const sonnetRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: triageModel, max_tokens: 3000, messages: [{ role: "user", content: sonnetFilled }] })
    });
    const sonnetData = await sonnetRes.json();
    let editorial: Record<string, unknown> = {};
    try { editorial = JSON.parse((sonnetData.content?.[0]?.text || "{}").replace(/```json|```/g, "").trim()); }
    catch { editorial = { raw: sonnetData.content?.[0]?.text }; }

    // ── RAG: CEC + Signal Canada cross-vertical
    let ragContext = "No related history found.";
    try {
      const lead = editorial as any;
      const leadText = [lead?.lead_story?.headline, lead?.lead_story?.what, lead?.lead_story?.corridor_angle].filter(Boolean).join(" ");
      if (leadText) {
        const leadEmbedding = await embedText(leadText, OPENAI_KEY);
        if (leadEmbedding) {
          const { data: cecDocs } = await supabase.rpc("match_documents", {
            query_embedding: leadEmbedding, match_vertical: VERTICAL,
            match_count: 4, days_lookback: 90, min_relevance: 6
          });
          const { data: signalDocs } = await supabase.rpc("match_documents", {
            query_embedding: leadEmbedding, match_vertical: "Signal Canada",
            match_count: 2, days_lookback: 90, min_relevance: 5
          });
          const allDocs = [...(cecDocs || []), ...(signalDocs || [])];
          if (allDocs.length > 0) {
            ragContext = allDocs.map((d: any) =>
              `— [${d.vertical}] ${d.title} (${new Date(d.published_at).toLocaleDateString("en-CA")}, ${d.source_name})\n  ${(d.body || "").substring(0, 300)}`
            ).join("\n");
          }
        }
      }
    } catch (ragErr) {
      console.warn(`[${FUNCTION_VERSION}] RAG failed (non-fatal):`, ragErr);
    }

    const opusFilled = OPUS_PROMPT
      .replace("{{today}}", today)
      .replace("{{dateline}}", dateline)
      .replace("{{editors_note}}", editorsNoteBlock)
      .replace("{{canada_signal}}", canadaSignal)
      .replace("{{index_line}}", indexLine)
      .replace("{{editorial_note}}", JSON.stringify(editorial, null, 2))
      .replace("{{rag_context}}", ragContext);

    const opusRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: writingModel, max_tokens: 5000, messages: [{ role: "user", content: opusFilled }] })
    });
    const opusData = await opusRes.json();
    const briefBody = opusData.content?.[0]?.text || "Brief generation failed.";

    const title = `The Influence Letter — Canada Europe Connects — ${today}`;
    const { data: brief, error: briefError } = await supabase
      .from("briefs")
      .insert({ vertical: VERTICAL, title, body: briefBody, status: "draft",
        model_used: `${triageModel}→signal→rag→${writingModel}-v30`,
        published_at: now.toISOString() })
      .select().single();
    if (briefError) throw briefError;

    console.log(`[${FUNCTION_VERSION}] Done — ${brief.id}`);
    return new Response(
      JSON.stringify({ success: true, brief_id: brief.id, title, function_version: FUNCTION_VERSION,
        index_composite: indexLine,
        editors_note_applied: !!editorsNote }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(`[${FUNCTION_VERSION}] Error:`, err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500 });
  }
});
