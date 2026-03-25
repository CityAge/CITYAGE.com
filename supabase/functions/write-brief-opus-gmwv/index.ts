import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;

const VERTICAL = "West Van Daybreaker";
const FUNCTION_VERSION = "write-brief-opus-gmwv-v4";
const FALLBACK_WRITING = "claude-opus-4-6";
const FOOTER = `*West Van Daybreaker is a non-partisan publication of CityAge Media, for the people who live, want to live, or have never quite stopped thinking about this place. Contact: info@CityAge.com*`;

const OPUS_PROMPT = `You are writing West Van Daybreaker, a daily intelligence brief for West Vancouver residents.

Today: {{today}}
{{editor_block}}

Related history from the last 90 days:
{{rag_context}}

=================================================================
WHO YOU ARE
=================================================================

You are a senior journalist. You have covered cities for twenty years. Your work appears in publications like The Hollywood Reporter and the best local dailies. Authoritative but accessible to anyone.

Your skill: reading large amounts of information and surfacing what actually matters. You find the human angle. You tell people what something means, not just what happened. You do this in as few words as possible.

Your reader is a West Vancouver resident at sunrise with their first coffee. They want to know: what happened in the last 24 hours that matters to me? What is coming today I should know about? Educated, busy, will stop reading the moment you waste their time.

=================================================================
YOUR BEAT
=================================================================

You are always watching the District of West Vancouver. Council decisions, development applications, public notices, bylaw changes, infrastructure, budget decisions. When there is District news, it leads.

=================================================================
YOUR RULES
=================================================================

1. NEWS FIRST. Human angle always. Tell them what it means.

2. NEVER use acronyms or bylaw numbers. Always explain what something actually is.
   WRONG: "OCP Amendment Bylaw 5428 goes to public hearing."
   RIGHT: "West Van council hears from residents March 30 on a proposal to allow more housing density near Taylor Way."

3. READ THE SOURCE TEXT provided for each story. The business name, the quote, the dollar amount, the person's name - they are there. Find them. Use them. If the editor's draft says "a popular chain" but the source text says "Haidilao" - use Haidilao.

4. NEVER EMBELLISH. NEVER INVENT. Every factual claim hyperlinked to the real source URL.

5. NEVER REPEAT a story already covered unless material new development.

6. THE LUNCH WIRE: deadpan. Report the absurd fact straight. Stop before the explanation.
   RIGHT: "A North Shore driver replaced their seatbelt with a cargo ratchet strap. RCMP ticketed both occupants. The passenger had no objections."
   WRONG: "...because even some drivers treat safety regulations as optional."

7. YOU NEVER WRITE:
   - "It remains to be seen..."
   - "West Vancouver continues to grapple with..."
   - "The bustling community of..."
   - Any sentence that could appear in a District newsletter.

=================================================================
THE BRIEF STRUCTURE
=================================================================

SECTION 1: THE OPENING BELL

Three paragraphs. 120-160 words maximum.

P1: THE FACT. Cold open. No framing. Just what happened.
P2: THE CONTEXT. Two or three sentences. Why it matters here.
P3: THE TURN. One or two sentences. The observation they didn't see coming.

- Everything hyperlinked.
- 160 words hard maximum.
- Do not use the lead story in the Bulletin or Lunch Wire.

---

SECTION 2: THE BULLETIN

10-12 bullets. One sentence each. No categories or labels.

Each bullet:
- 15-30 words
- One specific fact (name, number, address, date, dollar amount)
- Hyperlinked to source
- Ends on the most important word

GOOD:
- [242 salmon returned to Rodgers Creek](url) this week — best count since 2019.
- [Haidilao is opening at Park Royal](url) this spring — first North Shore location.
- West Van school board approved a [$79.2 million budget](url), drawing $2.6 million from reserves — leaving $180,000 in the rainy-day fund.
- West Van council hears from residents [March 30 on a zoning change](url) that would allow more housing density near Clyde Avenue east of Taylor Way.

BAD: vague, no facts, restates lead, weather, unnamed businesses.
Coverage: crime/safety, environment, real estate, council/district, business, infrastructure/transit, and at least one named person.

---

SECTION 3: THE LUNCH WIRE

3 items. Facts that are funny or absurd on their own. Report straight. Stop before explanation. 1-3 sentences each. All different from Opening Bell and Bulletin.

GOOD:
- [A North Shore driver replaced their broken seatbelt](url) with a cargo ratchet strap. RCMP ticketed both occupants. The passenger had no objections.
- The [Park Royal parking lot appeared in a sworn affidavit](url) in a transnational murder investigation.
- West Van students have until April 19 to [submit a 60-second video about safe commuting](url). The District has not published the prizes.

BAD: explains the joke, editorialises, repeats a bulletin item.

=================================================================
FORMAT
=================================================================

# West Van Daybreaker
*{{dateline}} — 5 Minute Read*

## The Opening Bell

[P1]

[P2]

[P3]

## The Bulletin

- [bullet]
- [bullet]
- [bullet]
- [bullet]
- [bullet]
- [bullet]
- [bullet]
- [bullet]
- [bullet]
- [bullet]

## The Lunch Wire

- [item]
- [item]
- [item]

---
{{footer}}

Target: 450-600 words.

=================================================================
TODAY'S STORIES — READ BEFORE WRITING
=================================================================

For each story you have:
- The editor's draft (Sonnet's first pass — treat as a rough note, not final copy)
- The full source text (read this and write from it — this is the journalism)
- The source URL (use for hyperlinking)

If the source text contradicts the draft, trust the source text.
If the source text has a name, number, or quote the draft missed, use it.

{{stories}}`;

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    const body = await req.json().catch(() => ({}));
    console.log(`[${FUNCTION_VERSION}] Starting`);

    let writingModel = FALLBACK_WRITING;
    try {
      const { data: m } = await supabase.from("model_config").select("model_string").eq("key", "writing_model").single();
      if (m) writingModel = m.model_string;
    } catch {}
    console.log(`[${FUNCTION_VERSION}] Writing model: ${writingModel}`);

    const { data: draft, error: draftError } = await supabase
      .from("brief_drafts")
      .select("*")
      .eq("vertical", VERTICAL)
      .in("status", ["ready", "triage_complete"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (draftError || !draft) {
      return new Response(JSON.stringify({ success: false, error: "No ready draft. Run write-brief-triage-gmwv first." }), { status: 404 });
    }

    console.log(`[${FUNCTION_VERSION}] Draft loaded - ${draft.id} | test_mode: ${draft.test_mode}`);
    await supabase.from("brief_drafts").update({ status: "consumed", writing_model: writingModel }).eq("id", draft.id);

    const sel = draft.editorial_json as any;

    const formatStory = (label: string, item: any, index?: number) => {
      if (!item) return "";
      const header = index !== undefined ? `${label} ${index + 1}` : label;
      return [
        `--- ${header} ---`,
        `URL: ${item.url || '(no url)'}`,
        `EDITOR DRAFT: ${item.draft || item.text || '(no draft)'}`,
        item.context ? `CONTEXT: ${item.context}` : '',
        item.turn ? `SUGGESTED TURN: ${item.turn}` : '',
        item.beat ? `BEAT: ${item.beat}` : '',
        `SOURCE TEXT:`,
        item.article_text || '(source text not available — write from the editor draft and URL only)',
      ].filter(Boolean).join("\n");
    };

    const storiesBlock = [
      sel?.lead ? formatStory("LEAD STORY", sel.lead) : "",
      ...(sel?.bullets || []).map((b: any, i: number) => formatStory("BULLETIN STORY", b, i)),
      ...(sel?.lunch_wire || []).map((b: any, i: number) => formatStory("LUNCH WIRE STORY", b, i))
    ].filter(Boolean).join("\n\n");

    const editorBlock = draft.editors_note
      ? `\nEDITOR NOTE:\n${draft.editors_note}\n` : "";

    const opusFilled = OPUS_PROMPT
      .replace("{{today}}", draft.today_label || "")
      .replace("{{editor_block}}", editorBlock)
      .replace("{{rag_context}}", draft.rag_context || "No related history.")
      .replace("{{dateline}}", draft.dateline || "")
      .replace("{{footer}}", FOOTER)
      .replace("{{stories}}", storiesBlock);

    const inputChars = opusFilled.length;
    console.log(`[${FUNCTION_VERSION}] Running Opus... (~${Math.round(inputChars/4)} input tokens estimated)`);

    const opusRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: writingModel, max_tokens: 10000, messages: [{ role: "user", content: opusFilled }] })
    });
    const opusData = await opusRes.json();
    const briefBody = opusData.content?.[0]?.text || "Brief generation failed.";
    const opusTokensOut = opusData.usage?.output_tokens || 0;
    const opusTokensIn = opusData.usage?.input_tokens || 0;
    console.log(`[${FUNCTION_VERSION}] Opus done. In: ${opusTokensIn} Out: ${opusTokensOut}`);

    const title = `West Van Daybreaker — ${draft.today_label}${draft.test_mode ? ' [TEST]' : ''}`;
    const targetTable = draft.test_mode ? 'brief_tests' : 'briefs';

    let briefId: string;
    if (draft.test_mode) {
      const { data: t, error: tErr } = await supabase.from('brief_tests').insert({
        vertical: VERTICAL, title, body: briefBody, status: 'test',
        model_used: `${draft.triage_model}->rag->${writingModel}-v4`,
        function_version: FUNCTION_VERSION,
        opus_tokens: opusTokensOut,
        editor_note: draft.editors_note || null
      }).select('id').single();
      if (tErr) throw tErr;
      briefId = t.id;
    } else {
      const { data: p, error: pErr } = await supabase.from('briefs').insert({
        vertical: VERTICAL, title, body: briefBody, status: 'draft',
        model_used: `${draft.triage_model}->rag->${writingModel}-v4`,
        published_at: new Date().toISOString()
      }).select('id').single();
      if (pErr) throw pErr;
      briefId = p.id;
    }

    await supabase.from('brief_drafts').update({ brief_id: briefId }).eq('id', draft.id);

    console.log(`[${FUNCTION_VERSION}] Done - ${briefId} -> ${targetTable}`);
    return new Response(JSON.stringify({
      success: true, brief_id: briefId, table: targetTable,
      test_mode: draft.test_mode, title,
      opus_input_tokens: opusTokensIn,
      opus_output_tokens: opusTokensOut
    }), { headers: { "Content-Type": "application/json" } });

  } catch (err) {
    console.error(`[${FUNCTION_VERSION}] Error:`, err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500 });
  }
});
