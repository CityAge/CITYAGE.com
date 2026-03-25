import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// rss-score-universal v1
// PURPOSE: Phase 2 of 2 — Haiku scores ALL unscored articles for a vertical.
// Runs after rss-fetch-universal completes. No fetching, no inserting.
// Works for ANY vertical — pass { "vertical": "West Van Daybreaker" } in body.
//
// Haiku does two things per article:
//   1. Relevance score 1-10 against the vertical's editorial scope
//   2. Duplicate detection against articles already scored today
//
// Articles scoring >= relevance_threshold in vertical_config are marked is_relevant=true
// Articles below threshold or flagged duplicate are marked is_relevant=false
//
// HOW IT FITS:
//   Cron slot 1: rss-fetch-universal { vertical }
//   Cron slot 2: rss-score-universal { vertical }  <— THIS FUNCTION
//   Cron slot 3: write-brief { vertical }

const JOB_NAME = 'rss-score-universal';
const HAIKU_TIMEOUT_MS = 12_000;
const BATCH_SIZE = 20; // articles per scoring loop

Deno.serve(async (req: Request) => {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  if (req.method === 'GET') {
    return new Response(JSON.stringify({ status: 'ok', version: 1, function: JOB_NAME }), { headers: { 'Content-Type': 'application/json' } });
  }

  const hdrKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && hdrKey !== SYNC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  let body: any = {};
  try { body = await req.json(); } catch {}
  const vertical = body.vertical;
  if (!vertical) {
    return new Response(JSON.stringify({ error: 'Missing required field: vertical' }), { status: 400 });
  }

  const startTime = Date.now();
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });

  // Load vertical config for relevance threshold and scoring prompt
  const { data: config } = await supabase
    .from('vertical_config')
    .select('relevance_threshold, rss_screening_prompt, editorial_thesis')
    .eq('vertical', vertical)
    .single();

  const relevanceThreshold = config?.relevance_threshold ?? 5;

  // Build the Haiku scoring prompt — use vertical's own screening prompt if set, else generic
  const scoringContext = config?.rss_screening_prompt ||
    `You are scoring articles for relevance to: ${vertical}.

Score 1-10:
10: Directly about this city/community, its residents, local government, local business, local environment
7-9: Regional news directly affecting this community
5-6: Broader regional news with indirect relevance
3-4: Tangential connection
1-2: No meaningful connection

Also flag duplicates — if this article covers the same event/story as one already processed, mark duplicate:true.`;

  // Insert run row
  const { data: runRow } = await supabase
    .from('pipeline_runs')
    .insert({ job_name: JOB_NAME, stage: 'scoring', run_date: todayDate, status: 'running', started_at: new Date().toISOString(), notes: `Scoring RSS for: ${vertical}` })
    .select('id').single();
  const runId = runRow?.id ?? null;

  const stats = { scored: 0, relevant: 0, irrelevant: 0, duplicates: 0, errors: 0 };
  let finalStatus = 'success';
  let finalError: string | null = null;

  // Build dedup context from recently scored articles (last 36h)
  const since36h = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
  const { data: recentScored } = await supabase
    .from('rss_articles')
    .select('title')
    .eq('vertical', vertical)
    .eq('is_synopsized', true)
    .eq('is_relevant', true)
    .gte('created_at', since36h)
    .order('created_at', { ascending: false })
    .limit(40);
  const recentTitles: string[] = (recentScored ?? []).map((a: any) => a.title);
  const scoredThisRun: string[] = []; // track what we score in this run for intra-run dedup

  try {
    let round = 0;
    while (true) {
      // Fetch next batch of unscored articles for this vertical
      const { data: unscored, error: fetchErr } = await supabase
        .from('rss_articles')
        .select('id, title, raw_summary, full_text, source_name, category')
        .eq('vertical', vertical)
        .eq('is_synopsized', false)
        .order('published_at', { ascending: false })
        .limit(BATCH_SIZE);

      if (fetchErr) throw new Error(`Fetch unscored failed: ${fetchErr.message}`);
      if (!unscored || unscored.length === 0) break; // all done

      for (const article of unscored) {
        const content = article.full_text ?? article.raw_summary ?? article.title;
        const allKnownTitles = [...recentTitles, ...scoredThisRun];
        const dedupeBlock = allKnownTitles.length > 0
          ? `\nALREADY COVERED:\n${allKnownTitles.slice(-30).map((t, i) => `${i+1}. ${t}`).join('\n')}\nSet duplicate:true if this covers the same event.`
          : '';

        try {
          const resp = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
            body: JSON.stringify({
              model: 'claude-haiku-4-5-20251001',
              max_tokens: 80,
              messages: [{ role: 'user', content:
                `${scoringContext}\n\nSource: ${article.source_name} (${article.category ?? 'general'})\nTitle: ${article.title}\nContent: ${content.slice(0, 1000)}${dedupeBlock}\n\nRespond JSON only: {"relevance":7,"duplicate":false}` }]
            }),
            signal: AbortSignal.timeout(HAIKU_TIMEOUT_MS)
          });

          let relevance = relevanceThreshold; // default to threshold on failure
          let duplicate = false;

          if (resp.ok) {
            const data = await resp.json();
            const text = data.content?.[0]?.text ?? '{}';
            try {
              const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
              relevance = parsed.relevance ?? relevanceThreshold;
              duplicate = parsed.duplicate ?? false;
            } catch { /* keep defaults */ }
          }

          const isRelevant = !duplicate && relevance >= relevanceThreshold;

          await supabase.from('rss_articles').update({
            is_synopsized: true,
            is_relevant: isRelevant,
            relevance_score: relevance,
            notes: duplicate ? `[DUP] score:${relevance}` : null
          }).eq('id', article.id);

          if (duplicate) {
            stats.duplicates++;
          } else if (isRelevant) {
            stats.relevant++;
            scoredThisRun.push(article.title); // add to intra-run dedup
          } else {
            stats.irrelevant++;
          }
          stats.scored++;

        } catch (err) {
          // On individual article failure, mark as scored with default relevance
          // so it doesn't block the queue
          await supabase.from('rss_articles').update({
            is_synopsized: true,
            is_relevant: true,
            relevance_score: relevanceThreshold,
            notes: `[SCORE-ERR] ${(err as Error).message.slice(0, 80)}`
          }).eq('id', article.id);
          stats.errors++;
          stats.scored++;
        }

        await new Promise(r => setTimeout(r, 80)); // brief pause between Haiku calls
      }

      round++;
      if (round >= 20) break; // safety cap: 400 articles max per run
    }

    finalStatus = stats.errors > 0 ? 'warn' : 'success';

  } catch (err) {
    finalStatus = 'failed';
    finalError = (err as Error).message;
  } finally {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const closePayload: any = {
      status: finalStatus,
      articles_synopsized: stats.scored,
      articles_relevant: stats.relevant,
      completed_at: new Date().toISOString(),
      duration_seconds: duration,
      notes: `v1 score-only | ${vertical} | scored:${stats.scored} relevant:${stats.relevant} irrelevant:${stats.irrelevant} dup:${stats.duplicates} err:${stats.errors} threshold:${relevanceThreshold}`
    };
    if (finalError) closePayload.error_message = finalError;
    if (runId) await supabase.from('pipeline_runs').update(closePayload).eq('id', runId);
    else await supabase.from('pipeline_runs').insert({ job_name: JOB_NAME, stage: 'scoring', run_date: todayDate, started_at: new Date(startTime).toISOString(), ...closePayload });
  }

  return new Response(JSON.stringify({ success: finalStatus !== 'failed', vertical, stats }), { headers: { 'Content-Type': 'application/json' } });
});
