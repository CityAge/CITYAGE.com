import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// write-brief-reputation v1 — Canada Investment Reputation
// Weekly reputation intelligence | Sonnet + Opus 4.6 | Ottawa dateline

const VERTICAL = 'Canada Investment Reputation';
const JOB_NAME = 'write-brief-reputation';

Deno.serve(async (req: Request) => {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const apiKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && apiKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  if (!ANTHROPIC_API_KEY) return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }), { status: 500 });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 1, vertical: VERTICAL }), { headers: { 'Content-Type': 'application/json' } });

  const ottawaTime = new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\./g, '').toUpperCase();
  const dateline = `${ottawaTime} Ottawa`;
  const today = new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Toronto' });
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: articles } = await supabase.from('rss_articles').select('title, notes, raw_summary, source_name, url, relevance_score, published_at, category').gte('published_at', cutoff).eq('is_relevant', true).eq('vertical', VERTICAL).neq('source_name', 'Perplexity Reputation Search').order('relevance_score', { ascending: false }).limit(40);
  const { data: perplexityResults } = await supabase.from('rss_articles').select('title, notes, url, published_at, category').eq('source_name', 'Perplexity Reputation Search').eq('vertical', VERTICAL).gte('published_at', cutoff).order('published_at', { ascending: false }).limit(20);

  if (!articles?.length && !perplexityResults?.length) return new Response(JSON.stringify({ error: 'No articles in last 7 days' }), { status: 404 });

  function formatDate(d: string): string { return new Date(d).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Toronto' }); }
  const articleContext = (articles ?? []).map((a, i) => `[${i+1}] "${a.title}"\n  ${formatDate(a.published_at)} | ${a.source_name} | Score:${a.relevance_score}/10\n  URL: ${a.url}\n  ${a.notes ?? a.raw_summary ?? ''}`).join('\n\n');
  const perplexityContext = (perplexityResults ?? []).map((p, i) => `[P${i+1}] "${p.title}"\n  ${formatDate(p.published_at)} | ${p.url}\n  ${p.notes ?? ''}`).join('\n\n');

  const thesis = `Canada Investment Reputation tracks what the world's most influential voices are saying about Canada as a destination for capital. Unit of analysis: the STATEMENT. Who said what, when, in what context. Five beats: Global Voices, Capital Flows, Risk Signals, Competitive Position, People & Institutions. Every item must have ATTRIBUTION.`;

  const sonnetResp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: 'claude-sonnet-4-5', max_tokens: 2000, messages: [{ role: 'user', content: `Senior analyst, Canada Investment Reputation. ${today}. Weekly.\n\n${thesis}\n\nFor each signal: WHO, WHAT THEY SAID, SENTIMENT, BEAT, IMPLICATION, SOURCE. Also: REPUTATION DIRECTION, THE NARRATIVE, max 6 signals.\n\nRSS:\n${articleContext}\n\nPERPLEXITY:\n${perplexityContext}` }] }) });
  if (!sonnetResp.ok) return new Response(JSON.stringify({ error: `Sonnet: ${await sonnetResp.text()}` }), { status: 500 });
  const editorialNote = (await sonnetResp.json()).content?.[0]?.text ?? '';

  const opusResp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: 'claude-opus-4-6', max_tokens: 3500, messages: [{ role: 'user', content: `Writer, Canada Investment Reputation. ${today}. Weekly.\n\n${thesis}\n\nVoice: Deputy minister's briefing before meeting foreign investors. Precise, attributed, unsentimental. Patterns over incidents.\n\nFormat:\n# Canada Investment Reputation\n## The Influence Letter\n${dateline} · ${today}\n*[One-line reputation verdict]*\n---\nTHE NARRATIVE [3-4 sentences]\n---\n### ↑/↓/↔ [Headline]\nWho: | What: | Why it matters: | [Source](URL)\n---\n[4-6 signals]\n---\n### Reputation Scorecard table\n---\n*Canada Investment Reputation — The Influence Letter. Weekly from Ottawa.*\n\nTarget: 1,000-1,500 words. Hyperlink sources. Directional arrows on every headline.\n\nEDITORIAL NOTE:\n${editorialNote}` }] }) });
  if (!opusResp.ok) return new Response(JSON.stringify({ error: `Opus: ${await opusResp.text()}` }), { status: 500 });
  const brief = (await opusResp.json()).content?.[0]?.text ?? '';

  const { data: savedBrief, error: saveErr } = await supabase.from('briefs').insert({ vertical: VERTICAL, title: `Canada Investment Reputation — Weekly — ${today}`, body: brief, model_used: 'claude-opus-4-6', status: 'draft', published_at: new Date().toISOString() }).select('id').single();
  await supabase.from('pipeline_runs').insert({ job_name: JOB_NAME, stage: 'write_brief', run_date: todayDate, status: saveErr ? 'warn' : 'success', articles_fetched: (articles?.length ?? 0) + (perplexityResults?.length ?? 0), notes: `v1 Reputation Weekly. Articles:${articles?.length ?? 0} Perplexity:${perplexityResults?.length ?? 0}`, started_at: new Date().toISOString(), completed_at: new Date().toISOString() });

  return new Response(JSON.stringify({ success: true, vertical: VERTICAL, brief_id: savedBrief?.id, brief, version: 'v1', articles_used: (articles?.length ?? 0) + (perplexityResults?.length ?? 0) }), { headers: { 'Content-Type': 'application/json' } });
});
