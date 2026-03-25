import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// perplexity-search-boutique v1 — Perplexity search for Boutique Hotel Intelligence
const VERTICAL = 'Boutique Hotel Intelligence';
const JOB_NAME = 'perplexity-search-boutique';

Deno.serve(async (req: Request) => {
  const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY') ?? '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const apiKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && apiKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 1, vertical: VERTICAL }), { headers: { 'Content-Type': 'application/json' } });
  if (!PERPLEXITY_API_KEY) return new Response(JSON.stringify({ error: 'PERPLEXITY_API_KEY not set' }), { status: 500 });

  const startTime = Date.now();
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
  const results: any = { queried: 0, inserted: 0, skipped: 0, errors: [] as string[] };

  const { data: queries } = await supabase.from('perplexity_queries').select('id, query').eq('vertical', VERTICAL).eq('is_active', true);
  if (!queries?.length) return new Response(JSON.stringify({ message: 'No active queries' }), { status: 200 });

  const systemPrompt = `You are an intelligence analyst for a boutique hotel investment publication. Focus on: boutique hotel acquisitions/launches/deals, Holbox Island/Yucatan development, family offices (India, Middle East, global) in luxury hospitality, impact investing/ecotourism/conservation, whale shark/turtle/mangrove protection. Be precise about names, companies, dollar amounts, locations, timelines.`;

  for (const q of queries) {
    try {
      const resp = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${PERPLEXITY_API_KEY}` },
        body: JSON.stringify({ model: 'sonar', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: q.query }], max_tokens: 600, return_citations: true })
      });
      if (!resp.ok) { results.errors.push(`"${q.query.slice(0, 40)}": HTTP ${resp.status}`); continue; }
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content ?? '';
      const citations = data.citations ?? [];
      if (!content) continue;
      results.queried++;

      const { error: insertErr } = await supabase.from('rss_articles').insert({
        source_id: null, source_name: 'Perplexity Boutique Search', vertical: VERTICAL, category: 'perplexity',
        title: `[PERPLEXITY] ${q.query.slice(0, 100)}`, url: `perplexity://boutique-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        published_at: new Date().toISOString(), raw_summary: content,
        is_synopsized: true, is_relevant: true, relevance_score: 8,
        notes: `${content}\n\nSources: ${citations.slice(0, 5).join(' | ')}`
      });
      if (insertErr) { if (insertErr.code === '23505') results.skipped++; else results.errors.push(`Insert: ${insertErr.message}`); } else results.inserted++;
      await supabase.from('perplexity_queries').update({ last_run_at: new Date().toISOString() }).eq('id', q.id);
      await new Promise(r => setTimeout(r, 400));
    } catch (err) { results.errors.push(`"${q.query.slice(0, 40)}": ${(err as Error).message}`); }
  }

  await supabase.from('pipeline_runs').insert({ job_name: JOB_NAME, stage: 'perplexity_search', run_date: todayDate, status: results.errors.length > 3 ? 'warn' : 'success', articles_fetched: results.queried, articles_inserted: results.inserted, articles_skipped: results.skipped, notes: `v1 Boutique. Q:${queries.length} R:${results.queried} I:${results.inserted}`, started_at: new Date(startTime).toISOString(), completed_at: new Date().toISOString(), duration_seconds: Math.round((Date.now() - startTime) / 1000) });

  return new Response(JSON.stringify({ success: true, vertical: VERTICAL, results }), { headers: { 'Content-Type': 'application/json' } });
});
