import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY")!;
const FUNCTION_VERSION = "score-daily-capitals-v2";
const OTTAWA_TZ = "America/Toronto";

// Daily Capital Temperature — scores Washington, Brussels, New Delhi, Ottawa
// Based on today's CEC brief. Sonnet analysis. Balanced progress/friction scoring.

function direction(delta: number | null): string { if (delta === null) return 'stable'; if (delta >= 5) return 'improving'; if (delta <= -5) return 'deteriorating'; if (Math.abs(delta) <= 2) return 'stable'; return 'volatile'; }
function arrow(delta: number | null): string { if (delta === null) return ''; if (delta > 0) return `↑${delta}`; if (delta < 0) return `↓${Math.abs(delta)}`; return '→'; }

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    const now = new Date();
    const scoredDate = new Intl.DateTimeFormat("en-CA", { timeZone: OTTAWA_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);

    const todayStart = new Date(); todayStart.setUTCHours(0, 0, 0, 0);
    const { data: todayBrief } = await supabase.from('briefs').select('id, body').eq('vertical', 'Canada Europe Connects').gte('created_at', todayStart.toISOString()).order('created_at', { ascending: false }).limit(1).single();
    let brief = todayBrief;
    if (!brief?.body) { const { data: rb } = await supabase.from('briefs').select('id, body').eq('vertical', 'Canada Europe Connects').order('created_at', { ascending: false }).limit(1).single(); brief = rb; }
    if (!brief?.body) return new Response(JSON.stringify({ error: 'No CEC brief' }), { status: 404 });

    const { data: prevScore } = await supabase.from('daily_capital_temperature').select('*').order('scored_date', { ascending: false }).limit(1).single();
    const previousScores = prevScore ? `Washington:${prevScore.washington_score} Brussels:${prevScore.brussels_score} NewDelhi:${prevScore.new_delhi_score} Ottawa:${prevScore.ottawa_score}` : 'First day.';

    const prompt = `Score Canada's daily capital relationships 1-100 based on CEC brief. Dimensions: WASHINGTON, BRUSSELS, NEW_DELHI, OTTAWA. For each: identify progress avenues AND friction points. Score reflects which outweighs.\n\nCEC BRIEF:\n${brief.body.substring(0, 5000)}\n\nPREVIOUS:\n${previousScores}\n\nJSON only: {"washington_score":0,"brussels_score":0,"new_delhi_score":0,"ottawa_score":0,"daily_signal":"one sentence","rationale":{"washington":"progress/friction/read","brussels":"","new_delhi":"","ottawa":""}}`;

    const res = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }, body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 800, messages: [{ role: 'user', content: prompt }] }) });
    const data = await res.json();
    let scores: Record<string, any> = {};
    try { scores = JSON.parse((data.content?.[0]?.text || '{}').replace(/```json|```/g, '').trim()); } catch { return new Response(JSON.stringify({ error: 'Parse failed' }), { status: 500 }); }

    const delta = (key: string) => prevScore ? (scores[key] - (prevScore as any)[key]) : null;
    const row = { scored_date: scoredDate, brief_id: brief.id, washington_score: scores.washington_score, brussels_score: scores.brussels_score, new_delhi_score: scores.new_delhi_score, ottawa_score: scores.ottawa_score, washington_delta: delta('washington_score'), brussels_delta: delta('brussels_score'), new_delhi_delta: delta('new_delhi_score'), ottawa_delta: delta('ottawa_score'), washington_direction: direction(delta('washington_score')), brussels_direction: direction(delta('brussels_score')), new_delhi_direction: direction(delta('new_delhi_score')), ottawa_direction: direction(delta('ottawa_score')), daily_signal: scores.daily_signal, scoring_rationale: scores.rationale };

    const { error } = await supabase.from('daily_capital_temperature').upsert(row, { onConflict: 'scored_date' });
    if (error) throw error;

    return new Response(JSON.stringify({ success: true, scored_date: scoredDate, daily_signal: scores.daily_signal, scores: { washington: scores.washington_score, brussels: scores.brussels_score, new_delhi: scores.new_delhi_score, ottawa: scores.ottawa_score } }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) { return new Response(JSON.stringify({ error: String(err) }), { status: 500 }); }
});
