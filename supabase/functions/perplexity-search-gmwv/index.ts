import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// perplexity-search-gmwv v5
// Reporter prompt: Vanity Fair-style, no gossip, finds news and predicts what things mean
// News burst + standing queries + depth follow-ups

const VERTICAL = 'West Van Daybreaker';
const JOB_NAME = 'perplexity-search-gmwv';
const BATCH_SIZE = 8;
const BATCH_DELAY_MS = 500;

Deno.serve(async (req: Request) => {
  const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY') ?? '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const hdrKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && hdrKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 5, vertical: VERTICAL }), { headers: { 'Content-Type': 'application/json' } });
  if (!PERPLEXITY_API_KEY) return new Response(JSON.stringify({ error: 'PERPLEXITY_API_KEY not set' }), { status: 500 });

  const startTime = Date.now();
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const results = { news_burst: 0, standing_queried: 0, targeted_queried: 0, inserted: 0, skipped: 0, errors: [] as string[] };

  const standingSystemPrompt = `You are the reporter for West Van Daybreaker — a daily intelligence newsletter for West Vancouver, BC. Find news, uncover human interest stories, predict what things mean. No gossip. No blame by name. Write as if you worked for Vanity Fair. Be specific: locations, businesses, dollar amounts, vote counts, dates. Cite sources with URLs.`;

  const newsBurstSystemPrompt = `You are a sharp local reporter covering West Vancouver, BC. Readers want: surprising/unusual things, real numbers (property tax, home prices, road closure times), council decisions, film crews, crime patterns, business openings/closings, human interest. Be specific. Cite sources with URLs.`;

  async function runQuery(query: string, systemPrompt: string, maxTokens = 800): Promise<{ content: string; citations: string[] } | null> {
    try {
      const resp = await fetch('https://api.perplexity.ai/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${PERPLEXITY_API_KEY}` }, body: JSON.stringify({ model: 'sonar', messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: query }], max_tokens: maxTokens, return_citations: true }) });
      if (!resp.ok) { results.errors.push(`"${query.slice(0, 40)}": HTTP ${resp.status}`); return null; }
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content ?? '';
      return content ? { content, citations: data.citations ?? [] } : null;
    } catch (err) { results.errors.push(`"${query.slice(0, 40)}": ${(err as Error).message}`); return null; }
  }

  async function insertResult(title: string, sourceName: string, category: string, content: string, citations: string[], score: number) {
    const { error } = await supabase.from('rss_articles').insert({ source_id: null, source_name: sourceName, vertical: VERTICAL, category, title, url: `perplexity://gmwv-${category}-${Date.now()}-${Math.random().toString(36).slice(2)}`, published_at: new Date().toISOString(), raw_summary: content, full_text: content, is_synopsized: true, is_relevant: true, relevance_score: score, notes: `${content}\n\nSources: ${citations.slice(0, 8).join(' | ')}` });
    if (error) { if (error.code === '23505') results.skipped++; else results.errors.push(`Insert: ${error.message}`); } else results.inserted++;
  }

  // NEWS BURST
  const burstResult = await runQuery(`Morning of ${today}. What are the most interesting things that happened in West Vancouver in the last 24-48 hours? 6-10 stories with headlines, key facts, source URLs. Cover: council, property tax, real estate, roads, weather, crime, business, filming, events, human interest. Neighbourhoods: Ambleside, Dundarave, Caulfeild, Horseshoe Bay, British Properties, Cypress Mountain, Park Royal.`, newsBurstSystemPrompt, 1200);
  if (burstResult) { await insertResult(`[NEWS BURST] West Van today — ${todayDate}`, 'Perplexity News Burst', 'news_burst', burstResult.content, burstResult.citations, 10); results.news_burst = 1; }

  // STANDING QUERIES
  const { data: queries } = await supabase.from('perplexity_queries').select('id, query').eq('vertical', VERTICAL).eq('is_active', true);
  const queryList = queries ?? [];

  for (let i = 0; i < queryList.length; i += BATCH_SIZE) {
    const batch = queryList.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(q => runQuery(q.query, standingSystemPrompt)));
    await Promise.all(batch.map(async (q, idx) => {
      const r = batchResults[idx]; if (!r) return;
      results.standing_queried++;
      await insertResult(`[INTEL] ${q.query.slice(0, 100)}`, 'Perplexity GMWV', 'perplexity_intelligence', r.content, r.citations, 8);
      await supabase.from('perplexity_queries').update({ last_run_at: new Date().toISOString() }).eq('id', q.id);
    }));
    if (i + BATCH_SIZE < queryList.length) await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
  }

  // DEPTH FOLLOW-UPS
  const { data: thinArticles } = await supabase.from('rss_articles').select('id, title, url, source_name').eq('vertical', VERTICAL).eq('is_relevant', true).is('full_text', null).neq('source_name', 'Perplexity GMWV').neq('source_name', 'Perplexity News Burst').gte('published_at', new Date(Date.now() - 36*60*60*1000).toISOString()).order('relevance_score', { ascending: false }).limit(5);
  if (thinArticles?.length) {
    const depthResults = await Promise.all(thinArticles.map(a => runQuery(`Tell me everything publicly available about this West Vancouver story — facts, names, figures, quotes: "${a.title}". Source: ${a.source_name}.`, standingSystemPrompt)));
    await Promise.all(thinArticles.map(async (a, idx) => {
      const r = depthResults[idx]; if (!r) return;
      results.targeted_queried++;
      await insertResult(`[DEPTH] ${a.title.slice(0, 100)}`, 'Perplexity GMWV Depth', 'perplexity_depth', r.content, r.citations, 9);
    }));
  }

  const dur = Math.round((Date.now() - startTime) / 1000);
  await supabase.from('pipeline_runs').insert({ job_name: JOB_NAME, stage: 'perplexity_search', run_date: todayDate, status: results.errors.length > 3 ? 'warn' : 'success', articles_fetched: results.news_burst + results.standing_queried + results.targeted_queried, articles_inserted: results.inserted, notes: `v5. Burst:${results.news_burst} Standing:${results.standing_queried} Depth:${results.targeted_queried} Ins:${results.inserted} T:${dur}s`, started_at: new Date(startTime).toISOString(), completed_at: new Date().toISOString(), duration_seconds: dur });

  return new Response(JSON.stringify({ success: true, vertical: VERTICAL, version: 5, duration_seconds: dur, results }), { headers: { 'Content-Type': 'application/json' } });
});
