import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// write-brief-signal-canada v3
// Signal Canada — weekly reputation intelligence
// v3: Sonnet outputs INDEX_SCORES block, parsed and written to signal_index table
// Computes deltas vs prior week. Opus receives clean editorial JSON only.

const VERTICAL = 'Signal Canada';
const JOB_NAME = 'write-brief-signal-canada';

function getCurrentSunday(): string {
  const d = new Date();
  const day = d.getUTCDay();
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().split('T')[0];
}

Deno.serve(async (req: Request) => {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const apiKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && apiKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  if (!ANTHROPIC_API_KEY) return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }), { status: 500 });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 3, vertical: VERTICAL }), { headers: { 'Content-Type': 'application/json' } });

  const ottawaTime = new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\./g, '').toUpperCase();
  const dateline = `${ottawaTime} Ottawa`;
  const today = new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Toronto' });
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const startTime = Date.now();
  const weekOf = getCurrentSunday();

  const { data: articles } = await supabase.from('rss_articles').select('title, notes, full_text, raw_summary, source_name, url, relevance_score, published_at, category').gte('published_at', cutoff).eq('is_relevant', true).eq('vertical', VERTICAL).neq('source_name', 'Perplexity Signal Canada').order('relevance_score', { ascending: false }).limit(40);
  const { data: perplexityResults } = await supabase.from('rss_articles').select('title, notes, full_text, url, published_at, category').eq('source_name', 'Perplexity Signal Canada').eq('vertical', VERTICAL).gte('published_at', cutoff).order('published_at', { ascending: false }).limit(20);

  if (!articles?.length && !perplexityResults?.length) return new Response(JSON.stringify({ error: 'No articles in last 7 days' }), { status: 404 });

  function formatDate(d: string): string { return new Date(d).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Toronto' }); }
  const articleContext = (articles ?? []).map((a, i) => { const content = a.full_text ?? a.notes ?? a.raw_summary ?? ''; return `[${i+1}] "${a.title}"\n  Source: ${a.source_name} | ${formatDate(a.published_at)} | Score:${a.relevance_score}/10\n  URL: ${a.url ?? 'NO URL'}\n  Content: ${content.slice(0, 2000)}`; }).join('\n\n---\n\n');
  const perplexityContext = (perplexityResults ?? []).map((p, i) => { const content = p.full_text ?? p.notes ?? ''; return `[P${i+1}] "${p.title}"\n  URL: ${p.url ?? 'NO URL'}\n  Intelligence: ${content.slice(0, 1500)}`; }).join('\n\n');

  const thesis = `Signal Canada tracks what influential investors, institutions, editorial boards, and leaders say about Canada as a destination for capital. NOT a news summary — a PERCEPTION MAP. Five beats: Investor Sentiment, Trade & Competitiveness, Resource & Energy, Tech & Innovation, Political Stability. Every story must pass: (1) reveals how specific voice PERCEIVES Canada, (2) perception is shifting.`;

  const sonnetPrompt = `Senior analyst, Signal Canada. ${today}. Weekly.\n\n${thesis}\n\nFor each story: headline, beat, who, what, the_narrative, the_number, sentiment, sources (with real URLs from corpus).\nAlso: weeks_signal. Max 6 stories. Named quotes and data prioritized.\n\nThen append:\n---INDEX_SCORES_START---\n{"geopolitical_score":<1-100>,"investment_score":<1-100>,"narrative_score":<1-100>,"composite_score":<1-100>,"geopolitical_direction":"up|down|flat","investment_direction":"up|down|flat","narrative_direction":"up|down|flat","overall_direction":"up|down|flat","weekly_signal":"one sentence","scoring_rationale":{"geopolitical":"2 sentences","investment":"2 sentences","narrative":"2 sentences","composite":"1 sentence"}}\n---INDEX_SCORES_END---\n\nRSS:\n${articleContext}\n\nPERPLEXITY:\n${perplexityContext}`;

  const sonnetResp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 3000, messages: [{ role: 'user', content: sonnetPrompt }] }) });
  if (!sonnetResp.ok) return new Response(JSON.stringify({ error: `Sonnet: ${await sonnetResp.text()}` }), { status: 500 });
  const sonnetRaw = (await sonnetResp.json()).content?.[0]?.text ?? '{}';

  let indexScores: any = null;
  let editorialJson = sonnetRaw;
  const scoresStart = sonnetRaw.indexOf('---INDEX_SCORES_START---');
  const scoresEnd = sonnetRaw.indexOf('---INDEX_SCORES_END---');
  if (scoresStart !== -1 && scoresEnd !== -1 && scoresEnd > scoresStart) {
    try { indexScores = JSON.parse(sonnetRaw.slice(scoresStart + 24, scoresEnd).trim()); } catch { console.error('Failed to parse index scores'); }
    editorialJson = sonnetRaw.slice(0, scoresStart).trim();
  }

  let analysis: any;
  try { analysis = JSON.parse(editorialJson.replace(/```json|```/g, '').trim()); } catch { analysis = { stories: [], weeks_signal: '' }; }

  let priorScores: any = null;
  const { data: priorWeek } = await supabase.from('signal_index').select('geopolitical_score, investment_score, narrative_score, composite_score').eq('vertical', VERTICAL).lt('week_of', weekOf).order('week_of', { ascending: false }).limit(1).single();
  if (priorWeek) priorScores = priorWeek;

  const opusPrompt = `Writer, Signal Canada. ${today}. Weekly.\n\n${thesis}\n\nVoice: Economist intelligence unit meets Ben Thompson's Stratechery. Analytical, not reportorial. Named voices, specific data, sentiment direction, comparisons. Contrarian signals are gold.\n\nBANNED: major, significant, key, robust, comprehensive, stakeholders, "it is worth noting"\n\nHYPERLINKING NON-NEGOTIABLE: Every fact hyperlinked [Source](URL). Every paragraph has links. No orphan claims.\n\nFormat:\n# Signal Canada\n## The Influence Letter — Reputation Intelligence\n${dateline} · ${today}\n*[One-line thesis]*\n---\nTHE SIGNAL [3-4 sentences]\n---\n### [Headline]\n[2-3 sentences] **The Narrative:** **The Number:** [Source](URL)\n---\n[Repeat]\n---\n### The Contrarian Signal [2-3 sentences with source]\n---\n*Signal Canada — The Influence Letter. Reputation Intelligence. Weekly from Ottawa.*\n\nSTORIES:\n${JSON.stringify(analysis, null, 2)}\n\nWeek's signal: ${analysis.weeks_signal ?? ''}\n\nWrite the brief. Every fact hyperlinked.`;

  const opusResp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: 'claude-opus-4-6', max_tokens: 4000, messages: [{ role: 'user', content: opusPrompt }] }) });
  if (!opusResp.ok) return new Response(JSON.stringify({ error: `Opus: ${await opusResp.text()}` }), { status: 500 });
  const brief = (await opusResp.json()).content?.[0]?.text ?? '';

  const { data: savedBrief, error: saveErr } = await supabase.from('briefs').insert({ vertical: VERTICAL, title: `Signal Canada — Weekly — ${today}`, body: brief, model_used: 'sonnet-4→opus-4.6-v3', status: 'published', published_at: new Date().toISOString() }).select('id').single();

  let indexWriteError: string | null = null;
  if (indexScores && savedBrief?.id) {
    const geoDelta = priorScores ? (indexScores.geopolitical_score - priorScores.geopolitical_score) : null;
    const invDelta = priorScores ? (indexScores.investment_score - priorScores.investment_score) : null;
    const narDelta = priorScores ? (indexScores.narrative_score - priorScores.narrative_score) : null;
    const compDelta = priorScores ? (indexScores.composite_score - priorScores.composite_score) : null;
    const { error: indexErr } = await supabase.from('signal_index').insert({
      vertical: VERTICAL, brief_id: savedBrief.id, week_of: weekOf,
      geopolitical_score: indexScores.geopolitical_score, investment_score: indexScores.investment_score,
      narrative_score: indexScores.narrative_score, composite_score: indexScores.composite_score,
      geopolitical_delta: geoDelta, investment_delta: invDelta, narrative_delta: narDelta, composite_delta: compDelta,
      geopolitical_direction: indexScores.geopolitical_direction, investment_direction: indexScores.investment_direction,
      narrative_direction: indexScores.narrative_direction, overall_direction: indexScores.overall_direction,
      weekly_signal: indexScores.weekly_signal, scoring_rationale: indexScores.scoring_rationale
    });
    if (indexErr) indexWriteError = indexErr.message;
  }

  const durationSeconds = Math.round((Date.now() - startTime) / 1000);
  await supabase.from('pipeline_runs').insert({ job_name: JOB_NAME, stage: 'write_brief', run_date: todayDate, status: saveErr ? 'warn' : 'success', articles_fetched: (articles?.length ?? 0) + (perplexityResults?.length ?? 0), notes: `v3 index-scoring. RSS:${articles?.length ?? 0} P:${perplexityResults?.length ?? 0} IndexParsed:${indexScores ? 'yes' : 'no'} IndexErr:${indexWriteError ?? 'none'}`, started_at: new Date(startTime).toISOString(), completed_at: new Date().toISOString(), duration_seconds: durationSeconds });

  return new Response(JSON.stringify({ success: true, vertical: VERTICAL, version: 3, brief_id: savedBrief?.id, week_of: weekOf, index_scores: indexScores, brief, duration_seconds: durationSeconds }), { headers: { 'Content-Type': 'application/json' } });
});
