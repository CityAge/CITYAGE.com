import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// perplexity-search-universal v1
// Universal Perplexity search — replaces all vertical-specific functions
// Sources:
//   1. perplexity_queries table — all active rows for the vertical
//   2. vertical_config.standing_queries — live/context/historical JSON arrays (if populated)
//   3. Depth layer — targeted follow-up for thin/paywalled RSS articles
// Config-driven: system_prompt and source_name from vertical_config
// Always closes pipeline_runs via try/finally

Deno.serve(async (req: Request) => {
  const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY') ?? '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const hdrKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && hdrKey !== SYNC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (req.method === 'GET') {
    return new Response(JSON.stringify({ status: 'ok', version: 1, function: 'perplexity-search-universal' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!PERPLEXITY_API_KEY) {
    return new Response(JSON.stringify({ error: 'PERPLEXITY_API_KEY not set' }), { status: 500 });
  }

  let body: any = {};
  try { body = await req.json(); } catch (_) {}
  const vertical: string = body.vertical ?? 'Canada Europe Connects';

  const startTime = Date.now();

  const tzMap: Record<string, string> = {
    'West Van Daybreaker':    'America/Vancouver',
    'Good Morning Beverly Hills': 'America/Los_Angeles',
    'Good Morning Fairfax':   'America/New_York',
    'Canada Europe Connects': 'America/Toronto',
    'Signal Canada':          'America/Toronto',
    'Boutique Hotel Intelligence': 'America/Cancun',
    'Canada Investment Reputation': 'America/Toronto',
  };
  const tz = tzMap[vertical] ?? 'America/Toronto';
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: tz });

  const results: any = {
    vertical,
    table_queried: 0,
    config_queried: 0,
    depth_queried: 0,
    inserted: 0,
    skipped: 0,
    errors: [] as string[]
  };

  let pipelineRunId: string | null = null;
  try {
    const { data: runRow } = await supabase.from('pipeline_runs').insert({
      job_name: 'perplexity-search-universal',
      stage: 'perplexity_search',
      run_date: todayDate,
      status: 'running',
      notes: `v1 universal — vertical: ${vertical}`,
      started_at: new Date(startTime).toISOString()
    }).select('id').single();
    pipelineRunId = runRow?.id ?? null;
  } catch (_) {}

  try {
    const { data: config } = await supabase
      .from('vertical_config')
      .select('perplexity_system_prompt, perplexity_source_name, standing_queries')
      .eq('vertical', vertical)
      .single();

    if (!config) {
      throw new Error(`No vertical_config found for: ${vertical}`);
    }

    const systemPrompt: string = config.perplexity_system_prompt ??
      `You are an intelligence researcher. Answer the query with precision, citing sources. Focus on facts, names, dollar amounts, and specific developments.`;
    const sourceName: string = config.perplexity_source_name ?? `Perplexity ${vertical}`;
    const standingQueries: { live?: string[], context?: string[], historical?: string[] } =
      config.standing_queries ?? {};

    async function runQuery(
      queryText: string,
      category: string,
      overrideSourceName?: string
    ) {
      try {
        const resp = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
          },
          body: JSON.stringify({
            model: 'sonar',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: queryText }
            ],
            max_tokens: 700,
            return_citations: true
          })
        });

        if (!resp.ok) {
          results.errors.push(`[${category}] "${queryText.slice(0, 50)}": HTTP ${resp.status}`);
          return;
        }

        const data = await resp.json();
        const content: string = data.choices?.[0]?.message?.content ?? '';
        const citations: string[] = data.citations ?? [];

        if (!content) {
          results.errors.push(`[${category}] "${queryText.slice(0, 50)}": empty response`);
          return;
        }

        const scoreMap: Record<string, number> = {
          live: 9, context: 7, historical: 6,
          perplexity_intelligence: 8, perplexity_depth: 9
        };
        const score = scoreMap[category] ?? 8;

        const labelMap: Record<string, string> = {
          live: '[LIVE]', context: '[CONTEXT]', historical: '[HISTORICAL]',
          perplexity_intelligence: '[INTEL]', perplexity_depth: '[DEPTH]'
        };
        const label = labelMap[category] ?? '[INTEL]';

        const useSource = overrideSourceName ?? sourceName;
        const url = `perplexity://${vertical.toLowerCase().replace(/\s+/g, '-')}-${category}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        const { error: insertErr } = await supabase.from('rss_articles').insert({
          source_id: null,
          source_name: useSource,
          vertical,
          category,
          title: `${label} ${queryText.slice(0, 100)}`,
          url,
          published_at: new Date().toISOString(),
          raw_summary: content,
          full_text: content,
          is_synopsized: true,
          is_relevant: true,
          relevance_score: score,
          notes: `${content}\n\nCitations: ${citations.slice(0, 5).join(' | ')}`
        });

        if (insertErr) {
          if (insertErr.code === '23505') results.skipped++;
          else results.errors.push(`Insert [${category}]: ${insertErr.message}`);
        } else {
          results.inserted++;
        }

        await new Promise(r => setTimeout(r, 400));
      } catch (err) {
        results.errors.push(`[${category}] "${queryText.slice(0, 40)}": ${(err as Error).message}`);
      }
    }

    const { data: tableQueries } = await supabase
      .from('perplexity_queries')
      .select('id, query, vertical')
      .eq('vertical', vertical)
      .eq('is_active', true);

    for (const q of tableQueries ?? []) {
      await runQuery(q.query, 'perplexity_intelligence');
      results.table_queried++;
      await supabase.from('perplexity_queries').update({ last_run_at: new Date().toISOString() }).eq('id', q.id);
    }

    const liveQueries = standingQueries.live ?? [];
    const contextQueries = standingQueries.context ?? [];
    const historicalQueries = standingQueries.historical ?? [];

    for (const q of liveQueries) { await runQuery(q, 'live'); results.config_queried++; }
    for (const q of contextQueries) { await runQuery(q, 'context'); results.config_queried++; }
    for (const q of historicalQueries) { await runQuery(q, 'historical'); results.config_queried++; }

    const since36h = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
    const { data: thinArticles } = await supabase
      .from('rss_articles')
      .select('id, title, url, source_name')
      .eq('vertical', vertical)
      .eq('is_relevant', true)
      .is('full_text', null)
      .not('source_name', 'ilike', '%Perplexity%')
      .gte('published_at', since36h)
      .order('relevance_score', { ascending: false })
      .limit(8);

    for (const article of thinArticles ?? []) {
      const depthQuery = `Tell me everything publicly available about this story. Give specific facts, names, dollar amounts, quotes, and context: "${article.title}". From: ${article.source_name}. What is the full picture?`;
      await runQuery(depthQuery, 'perplexity_depth', `${sourceName} Depth`);
      results.depth_queried++;
    }

    const totalQueried = results.table_queried + results.config_queried + results.depth_queried;
    const status = results.errors.length > 5 ? 'warn' : 'success';
    const notes = `v1 universal. Table:${results.table_queried} Config:${results.config_queried} Depth:${results.depth_queried} Ins:${results.inserted} Skip:${results.skipped} Err:${results.errors.length}`;

    if (pipelineRunId) {
      await supabase.from('pipeline_runs').update({
        status, articles_fetched: totalQueried, articles_inserted: results.inserted,
        articles_skipped: results.skipped, notes,
        completed_at: new Date().toISOString(),
        duration_seconds: Math.round((Date.now() - startTime) / 1000)
      }).eq('id', pipelineRunId);
    } else {
      await supabase.from('pipeline_runs').insert({
        job_name: 'perplexity-search-universal', stage: 'perplexity_search',
        run_date: todayDate, status, articles_fetched: totalQueried,
        articles_inserted: results.inserted, articles_skipped: results.skipped, notes,
        started_at: new Date(startTime).toISOString(),
        completed_at: new Date().toISOString(),
        duration_seconds: Math.round((Date.now() - startTime) / 1000)
      });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    const errorMsg = (err as Error).message;
    results.errors.push(`Fatal: ${errorMsg}`);

    const closePayload = {
      status: 'error',
      notes: `v1 fatal error: ${errorMsg}`,
      completed_at: new Date().toISOString(),
      duration_seconds: Math.round((Date.now() - startTime) / 1000)
    };

    if (pipelineRunId) {
      await supabase.from('pipeline_runs').update(closePayload).eq('id', pipelineRunId);
    } else {
      const todayFallback = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
      await supabase.from('pipeline_runs').insert({
        job_name: 'perplexity-search-universal', stage: 'perplexity_search',
        run_date: todayFallback, articles_fetched: 0, articles_inserted: 0,
        articles_skipped: 0, ...closePayload
      });
    }

    return new Response(JSON.stringify({ success: false, error: errorMsg, results }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
});
