import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// write-brief-universal v1 — Config-driven brief writer
// Reads editorial DNA from vertical_config table
// POST { "vertical": "Canada Europe Connects" }

Deno.serve(async (req: Request) => {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const hdrKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && hdrKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  if (!ANTHROPIC_API_KEY) return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }), { status: 500 });

  if (req.method === 'GET') {
    const { data: verticals } = await supabase.from('vertical_config').select('vertical, brief_name, cadence, schedule_cron, timezone, version, is_active').order('cadence');
    return new Response(JSON.stringify({ status: 'ok', version: 1, verticals }), { headers: { 'Content-Type': 'application/json' } });
  }

  let body: any = {};
  try { body = await req.json(); } catch {}
  const verticalName = body.vertical;
  if (!verticalName) return new Response(JSON.stringify({ error: 'Missing: vertical' }), { status: 400 });
  const editorGuidance = body.editor_guidance || body.guidance || body.focus || '';

  const { data: config, error: configErr } = await supabase.from('vertical_config').select('*').eq('vertical', verticalName).eq('is_active', true).single();
  if (configErr || !config) return new Response(JSON.stringify({ error: `Vertical not found: ${verticalName}` }), { status: 404 });

  const startTime = Date.now();
  const datelineConfig = config.dateline_config as Array<{tz: string, label: string}>;
  const datelineParts = datelineConfig.map((d: {tz: string, label: string}) => { const time = new Date().toLocaleString('en-CA', { timeZone: d.tz, hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\./g, '').toUpperCase(); return `${time} ${d.label}`; });
  const dateline = datelineParts.join(' \u00b7 ');
  const today = new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: config.timezone });
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: config.timezone });

  const cutoff = new Date(Date.now() - config.lookback_hours * 60 * 60 * 1000).toISOString();
  const { data: articles } = await supabase.from('rss_articles').select('title, notes, raw_summary, source_name, url, relevance_score, published_at, category').gte('published_at', cutoff).eq('is_relevant', true).eq('vertical', verticalName).neq('source_name', config.perplexity_source_name).order('relevance_score', { ascending: false }).limit(config.article_limit);
  const { data: perplexityResults } = await supabase.from('rss_articles').select('title, notes, url, published_at, category').eq('source_name', config.perplexity_source_name).eq('vertical', verticalName).gte('published_at', cutoff).order('published_at', { ascending: false }).limit(config.perplexity_limit);

  if (!articles?.length && !perplexityResults?.length) return new Response(JSON.stringify({ error: `No articles for ${verticalName}` }), { status: 404 });

  function formatDate(d: string): string { return new Date(d).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: config.timezone }); }
  const articleContext = (articles ?? []).map((a: any, i: number) => `[${i+1}] "${a.title}"\n  ${formatDate(a.published_at)} | ${a.source_name} | Score:${a.relevance_score}/10\n  URL: ${a.url}\n  ${a.notes ?? a.raw_summary ?? ''}`).join('\n\n');
  const perplexityContext = (perplexityResults ?? []).map((p: any, i: number) => `[P${i+1}] "${p.title}"\n  ${formatDate(p.published_at)} | ${p.url}\n  ${p.notes ?? ''}`).join('\n\n');

  let previousContext = '';
  if (config.cadence === 'daily') {
    const { data: prev } = await supabase.from('briefs').select('body').eq('vertical', verticalName).lt('published_at', new Date(Date.now() - 12*60*60*1000).toISOString()).order('published_at', { ascending: false }).limit(1);
    if (prev?.[0]?.body) { const headlines = prev[0].body.split('\n').filter((l: string) => l.startsWith('###')).map((l: string) => l.replace(/[#*]/g, '').trim()).join(', '); if (headlines) previousContext = `YESTERDAY: ${headlines}\nDo not repeat.`; }
  }

  let editorQuestion = editorGuidance;
  if (!editorQuestion) {
    const { data: di } = await supabase.from('daily_instructions').select('instruction, context').eq('active_date', todayDate);
    if (di?.length) editorQuestion = di.map((d: any) => d.instruction).join(' ');
  }
  const editorBlock = editorQuestion ? `\nEDITOR'S GUIDANCE: "${editorQuestion}"` : '';

  function fillTemplate(template: string, vars: Record<string, string>): string { let r = template; for (const [k, v] of Object.entries(vars)) r = r.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v); return r; }
  const tv: Record<string, string> = { today, today_date: todayDate, dateline, article_context: articleContext, perplexity_context: perplexityContext, editorial_thesis: config.editorial_thesis, previous_context: previousContext, editor_block: editorBlock, footer: config.footer ?? '' };

  const sonnetResp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: config.analysis_model, max_tokens: config.analysis_max_tokens, messages: [{ role: 'user', content: fillTemplate(config.sonnet_prompt_template, tv) }] }) });
  if (!sonnetResp.ok) return new Response(JSON.stringify({ error: `Analysis error: ${await sonnetResp.text()}` }), { status: 500 });
  const editorialNote = (await sonnetResp.json()).content?.[0]?.text ?? '';
  tv.editorial_note = editorialNote;

  const opusResp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: config.writing_model, max_tokens: config.writing_max_tokens, messages: [{ role: 'user', content: fillTemplate(config.opus_prompt_template, tv) }] }) });
  if (!opusResp.ok) return new Response(JSON.stringify({ error: `Writing error: ${await opusResp.text()}` }), { status: 500 });
  const brief = (await opusResp.json()).content?.[0]?.text ?? '';

  if (editorQuestion && !editorGuidance) await supabase.from('daily_instructions').update({ applied: true }).eq('active_date', todayDate);

  const { data: savedBrief, error: saveErr } = await supabase.from('briefs').insert({ vertical: verticalName, title: `${config.brief_name} \u2014 ${today}`, body: brief, model_used: `${config.analysis_model}\u2192${config.writing_model}`, status: 'draft', published_at: new Date().toISOString() }).select('id').single();

  const dur = Math.round((Date.now() - startTime) / 1000);
  await supabase.from('pipeline_runs').insert({ job_name: 'write-brief-universal', stage: 'write_brief', run_date: todayDate, status: saveErr ? 'warn' : 'success', articles_fetched: (articles?.length ?? 0) + (perplexityResults?.length ?? 0), notes: `universal-v1 ${config.brief_name}. A:${articles?.length ?? 0} P:${perplexityResults?.length ?? 0}. ${dur}s`, started_at: new Date(startTime).toISOString(), completed_at: new Date().toISOString(), duration_seconds: dur });

  return new Response(JSON.stringify({ success: true, vertical: verticalName, brief_id: savedBrief?.id, brief, duration_seconds: dur, version: 'universal-v1' }), { headers: { 'Content-Type': 'application/json' } });
});
