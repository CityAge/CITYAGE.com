import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const FUNCTION_VERSION = "score-signal-canada-v1";

const SCORING_PROMPT = `You are the analyst behind the Canada Signal Index — a weekly intelligence score tracking Canada's reputation across seven dimensions.

Score each 1-100. Dimensions: GEOPOLITICAL, INVESTMENT, NARRATIVE, WASHINGTON, BRUSSELS, BEIJING, NEW DELHI.
COMPOSITE weighted: Investment 20%, Brussels 20%, Washington 18%, Geopolitical 15%, Narrative 12%, Beijing 8%, New Delhi 7%.

SIGNAL CANADA BRIEF:
{{brief_body}}

PREVIOUS WEEK:
{{previous_scores}}

JSON only:
{"geopolitical_score":0,"investment_score":0,"narrative_score":0,"washington_score":0,"brussels_score":0,"beijing_score":0,"new_delhi_score":0,"composite_score":0,"weekly_signal":"one sentence","overall_direction":"improving|deteriorating|stable|volatile","rationale":{"geopolitical":"","investment":"","narrative":"","washington":"","brussels":"","beijing":"","new_delhi":""}}`;

function direction(delta: number | null): string {
  if (delta === null) return 'stable';
  if (delta >= 5) return 'improving'; if (delta <= -5) return 'deteriorating';
  if (Math.abs(delta) <= 2) return 'stable'; return 'volatile';
}

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    const { data: brief } = await supabase.from('briefs').select('id, title, body, created_at').eq('vertical', 'Signal Canada').order('created_at', { ascending: false }).limit(1).single();
    if (!brief?.body) return new Response(JSON.stringify({ error: 'No Signal Canada brief' }), { status: 404 });

    const { data: prevScore } = await supabase.from('canada_signal_index').select('*').order('week_of', { ascending: false }).limit(1).single();
    const previousScores = prevScore ? `Geo:${prevScore.geopolitical_score} Inv:${prevScore.investment_score} Nar:${prevScore.narrative_score} Wash:${prevScore.washington_score} Bru:${prevScore.brussels_score} Bei:${prevScore.beijing_score} ND:${prevScore.new_delhi_score} Comp:${prevScore.composite_score}` : 'First week.';

    const prompt = SCORING_PROMPT.replace('{{brief_body}}', brief.body.substring(0, 6000)).replace('{{previous_scores}}', previousScores);
    const res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }) });
    const data = await res.json();
    let scores: Record<string, any> = {};
    try { scores = JSON.parse((data.content?.[0]?.text || '{}').replace(/```json|```/g, '').trim()); } catch { return new Response(JSON.stringify({ error: 'Parse failed', raw: data.content?.[0]?.text }), { status: 500 }); }

    const delta = (key: string) => prevScore ? (scores[key] - (prevScore as any)[key]) : null;
    const weekOf = new Date().toISOString().split('T')[0];

    const row = { week_of: weekOf, brief_id: brief.id, geopolitical_score: scores.geopolitical_score, investment_score: scores.investment_score, narrative_score: scores.narrative_score, washington_score: scores.washington_score, brussels_score: scores.brussels_score, beijing_score: scores.beijing_score, new_delhi_score: scores.new_delhi_score, composite_score: scores.composite_score, geopolitical_delta: delta('geopolitical_score'), investment_delta: delta('investment_score'), narrative_delta: delta('narrative_score'), washington_delta: delta('washington_score'), brussels_delta: delta('brussels_score'), beijing_delta: delta('beijing_score'), new_delhi_delta: delta('new_delhi_score'), composite_delta: delta('composite_score'), overall_direction: scores.overall_direction, weekly_signal: scores.weekly_signal, scoring_rationale: scores.rationale };

    const { error } = await supabase.from('canada_signal_index').upsert(row, { onConflict: 'week_of' }).select().single();
    if (error) throw error;

    return new Response(JSON.stringify({ success: true, week_of: weekOf, composite_score: scores.composite_score, weekly_signal: scores.weekly_signal }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) { return new Response(JSON.stringify({ error: String(err) }), { status: 500 }); }
});
