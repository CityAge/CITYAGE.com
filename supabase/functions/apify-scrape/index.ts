import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// apify-scrape v6 — CEC government source crawler
// Cheerio crawler for public gov.ca sources, weekday beat rotation

const VERTICAL = 'Canada Europe Connects';
const JOB_NAME = 'apify-scrape';

const SCRAPE_TARGETS: Array<{
  url: string; label: string; beat: string; maxPages: number; globs?: string[];
}> = [
  { url: 'https://www.canada.ca/en/department-national-defence/news.html', label: 'DND News', beat: 'defence', maxPages: 5, globs: ['https://www.canada.ca/en/department-national-defence/news/**'] },
  { url: 'https://www.canada.ca/en/department-national-defence/services/procurement.html', label: 'DND Procurement', beat: 'defence', maxPages: 3, globs: ['https://www.canada.ca/en/department-national-defence/**'] },
  { url: 'https://natural-resources.canada.ca/energy/news-and-events', label: 'NRCan Energy News', beat: 'energy', maxPages: 5, globs: ['https://natural-resources.canada.ca/**'] },
  { url: 'https://www.canada.ca/en/environment-climate-change/news.html', label: 'ECCC News', beat: 'energy', maxPages: 5, globs: ['https://www.canada.ca/en/environment-climate-change/news/**'] },
  { url: 'https://www.canada.ca/en/global-affairs/news.html', label: 'GAC News', beat: 'trade', maxPages: 5, globs: ['https://www.canada.ca/en/global-affairs/news/**'] },
  { url: 'https://www.canada.ca/en/innovation-science-economic-development/news.html', label: 'ISED News', beat: 'trade', maxPages: 5, globs: ['https://www.canada.ca/en/innovation-science-economic-development/news/**'] },
  { url: 'https://ised-isde.canada.ca/site/invest-canada/en', label: 'Invest in Canada', beat: 'trade', maxPages: 3, globs: ['https://ised-isde.canada.ca/site/invest-canada/**'] },
  { url: 'https://www.cyber.gc.ca/en/alerts-advisories', label: 'CCCS Advisories', beat: 'technology', maxPages: 5, globs: ['https://www.cyber.gc.ca/en/**'] },
  { url: 'https://www.canada.ca/en/communications-security/news.html', label: 'CSE News', beat: 'technology', maxPages: 3, globs: ['https://www.canada.ca/en/communications-security/news/**'] },
  { url: 'https://ised-isde.canada.ca/site/ai-strategy/en', label: 'Canada AI Strategy', beat: 'technology', maxPages: 3, globs: ['https://ised-isde.canada.ca/site/ai-strategy/**'] },
  { url: 'https://www.cppinvestments.com/newsroom/', label: 'CPPIB Newsroom', beat: 'capital', maxPages: 5, globs: ['https://www.cppinvestments.com/newsroom/**', 'https://www.cppinvestments.com/news/**'] },
  { url: 'https://www.investpsp.com/en/news/', label: 'PSP Investments News', beat: 'capital', maxPages: 3, globs: ['https://www.investpsp.com/en/**'] },
  { url: 'https://www.infrastructure.gc.ca/news-nouvelles/index-eng.html', label: 'Infrastructure Canada', beat: 'capital', maxPages: 3, globs: ['https://www.infrastructure.gc.ca/**'] },
  { url: 'https://www.pm.gc.ca/en/news', label: 'PMO News', beat: 'cross-beat', maxPages: 5, globs: ['https://www.pm.gc.ca/en/news/**', 'https://www.pm.gc.ca/en/media/**'] },
  { url: 'https://www.canada.ca/en/privy-council/news.html', label: 'PCO News', beat: 'cross-beat', maxPages: 3, globs: ['https://www.canada.ca/en/privy-council/news/**'] },
];

const DAILY_BEATS: Record<number, string[]> = {
  1: ['defence', 'cross-beat'], 2: ['energy'], 3: ['trade'], 4: ['technology'], 5: ['capital'], 0: [], 6: [],
};

async function checkRunStatus(apiToken: string, runId: string): Promise<string> {
  try {
    const resp = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${apiToken}`);
    if (!resp.ok) return 'UNKNOWN';
    return (await resp.json())?.data?.status || 'UNKNOWN';
  } catch { return 'UNKNOWN'; }
}

async function fetchDataset(apiToken: string, datasetId: string): Promise<Array<{url: string, title: string, text: string}>> {
  try {
    const resp = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiToken}&format=json&limit=30`);
    if (!resp.ok) return [];
    const items = await resp.json();
    return (items || []).map((item: any) => ({
      url: item.url || '', title: item.metadata?.title || item.title || '',
      text: (item.markdown || item.text || '').slice(0, 3000)
    })).filter((item: any) => item.url && item.text.length > 100);
  } catch { return []; }
}

async function synopsizePage(
  title: string, text: string, label: string, beat: string,
  apiKey: string, recentTitles: string[]
): Promise<{synopsis: string, relevance: number, duplicate: boolean}> {
  if (!apiKey) return { synopsis: 'NO_API_KEY', relevance: 5, duplicate: false };
  const dedupeContext = recentTitles.length > 0
    ? `\nALREADY IN PIPELINE:\n${recentTitles.slice(0, 15).map((t, i) => `${i+1}. ${t}`).join('\n')}\nDuplicate if same specific announcement.`
    : '';
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', max_tokens: 200,
        messages: [{ role: 'user', content:
          `Intelligence editor for Canada Europe Connects (defence, trade, energy, tech, capital).\n\nSource: ${label} (${beat})\nTitle: ${title}\nContent: ${text.slice(0, 1500)}\n${dedupeContext}\n\nJSON only: {"synopsis":"2 sentences","relevance":7,"duplicate":false}\n\nScoring:\n8-10: Specific dollar amount, named partner, concrete policy decision\n5-7: Policy announcement with substance\n3-4: General departmental info\n1-2: Navigation page, boilerplate`
        }]
      })
    });
    if (!resp.ok) return { synopsis: `API_ERR_${resp.status}`, relevance: 4, duplicate: false };
    const data = await resp.json();
    const t = data.content?.[0]?.text ?? '{}';
    try {
      const p = JSON.parse(t.replace(/```json|```/g, '').trim());
      return { synopsis: p.synopsis ?? '', relevance: p.relevance ?? 4, duplicate: p.duplicate ?? false };
    } catch { return { synopsis: t.slice(0, 200), relevance: 4, duplicate: false }; }
  } catch { return { synopsis: '', relevance: 4, duplicate: false }; }
}

Deno.serve(async (req: Request) => {
  const APIFY_API_TOKEN = Deno.env.get('APIFY_API_TOKEN') ?? '';
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const hdrKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && hdrKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const ottawaDay = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Toronto' })).getDay();

  if (req.method === 'GET') {
    return new Response(JSON.stringify({
      status: 'ok', version: 6, total_targets: SCRAPE_TARGETS.length,
      today_beats: DAILY_BEATS[ottawaDay] || [],
      schedule: { Mon: 'defence+cross-beat', Tue: 'energy', Wed: 'trade', Thu: 'technology', Fri: 'capital' }
    }), { headers: { 'Content-Type': 'application/json' } });
  }

  if (!APIFY_API_TOKEN) return new Response(JSON.stringify({ error: 'APIFY_API_TOKEN not set' }), { status: 500 });

  const startTime = Date.now();
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });

  let todayBeats = DAILY_BEATS[ottawaDay] || [];
  let manualLabels: string[] | null = null;
  try {
    const body = await req.json();
    if (body?.all === true) todayBeats = ['defence','energy','trade','technology','capital','cross-beat'];
    else if (body?.beats && Array.isArray(body.beats)) todayBeats = body.beats;
    else if (body?.labels && Array.isArray(body.labels)) manualLabels = body.labels;
  } catch {}

  const targetsToRun = manualLabels
    ? SCRAPE_TARGETS.filter(t => manualLabels!.includes(t.label))
    : SCRAPE_TARGETS.filter(t => todayBeats.includes(t.beat));

  const { data: runRow } = await supabase.from('pipeline_runs').insert({
    job_name: JOB_NAME, stage: 'apify_scrape', run_date: todayDate,
    status: 'running', started_at: new Date().toISOString(),
    notes: `v6 | Day ${ottawaDay} beats:${todayBeats.join('+')} targets:${targetsToRun.length}`
  }).select('id').single();
  const runId = runRow?.id ?? null;

  if (targetsToRun.length === 0) {
    if (runId) await supabase.from('pipeline_runs').update({ status: 'skipped', completed_at: new Date().toISOString(), duration_seconds: 0 }).eq('id', runId);
    return new Response(JSON.stringify({ success: true, message: 'No targets today' }), { headers: { 'Content-Type': 'application/json' } });
  }

  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: recentArts } = await supabase.from('rss_articles').select('title, url').eq('vertical', VERTICAL).gte('created_at', since24h);
  const recentTitles = (recentArts ?? []).map((a: any) => a.title);
  const recentUrls = new Set((recentArts ?? []).map((a: any) => a.url));

  const stats = { targets: targetsToRun.length, started: 0, succeeded: 0, pages: 0, inserted: 0, dupes: 0, low_rel: 0, by_beat: {} as Record<string, number>, errors: [] as string[] };

  try {
    for (const target of targetsToRun) {
      try {
        const apifyInput: any = {
          startUrls: [{ url: target.url }], maxCrawlPages: target.maxPages,
          crawlerType: 'cheerio', maxCrawlDepth: 2, outputFormats: ['markdown'],
          removeElementsCssSelector: 'nav, footer, header, .breadcrumb, #wb-info, #wb-sec, #wb-bar, #wb-sm, .pagedetails, .gc-srvinfo, aside, [role="navigation"], [role="banner"], [role="contentinfo"]',
        };
        if (target.globs?.length) apifyInput.includeUrlGlobs = target.globs;

        const resp = await fetch(
          `https://api.apify.com/v2/acts/apify~website-content-crawler/runs?token=${APIFY_API_TOKEN}&waitForFinish=90`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(apifyInput) }
        );
        if (!resp.ok) { stats.errors.push(`${target.label}: HTTP ${resp.status}`); continue; }

        const runData = await resp.json();
        const apifyRunId = runData?.data?.id;
        const datasetId = runData?.data?.defaultDatasetId;
        let runStatus = runData?.data?.status;
        stats.started++;

        if (runStatus === 'RUNNING' || runStatus === 'READY') {
          for (let i = 0; i < 6; i++) {
            await new Promise(r => setTimeout(r, 10000));
            runStatus = await checkRunStatus(APIFY_API_TOKEN, apifyRunId);
            if (runStatus === 'SUCCEEDED' || runStatus === 'FAILED' || runStatus === 'ABORTED') break;
          }
        }
        if (runStatus !== 'SUCCEEDED') { stats.errors.push(`${target.label}: ${runStatus}`); continue; }
        stats.succeeded++;

        const pages = await fetchDataset(APIFY_API_TOKEN, datasetId);
        stats.pages += pages.length;

        for (const page of pages) {
          if (page.url === target.url) continue;
          if (recentUrls.has(page.url)) { stats.dupes++; continue; }

          const { synopsis, relevance, duplicate } = await synopsizePage(page.title, page.text, target.label, target.beat, ANTHROPIC_API_KEY, recentTitles);
          if (duplicate) { stats.dupes++; continue; }
          if (relevance < 3) { stats.low_rel++; continue; }

          const { error: insertErr } = await supabase.from('rss_articles').insert({
            source_id: null, source_name: `Apify: ${target.label}`,
            vertical: VERTICAL, category: target.beat,
            title: `[GOV] ${page.title}`.slice(0, 500), url: page.url,
            published_at: new Date().toISOString(), raw_summary: page.text.slice(0, 2000),
            is_synopsized: true, is_relevant: relevance >= 5, relevance_score: relevance, notes: synopsis
          });
          if (insertErr) { if (insertErr.code === '23505') stats.dupes++; else stats.errors.push(`Insert: ${insertErr.message}`); }
          else { stats.inserted++; stats.by_beat[target.beat] = (stats.by_beat[target.beat] || 0) + 1; recentTitles.push(page.title); recentUrls.add(page.url); }
          await new Promise(r => setTimeout(r, 150));
        }
      } catch (err) { stats.errors.push(`${target.label}: ${(err as Error).message}`); }
      await new Promise(r => setTimeout(r, 500));
    }
  } finally {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const closePayload: any = {
      status: stats.errors.length > stats.targets / 2 ? 'warn' : 'success',
      articles_fetched: stats.pages, articles_inserted: stats.inserted, articles_skipped: stats.dupes + stats.low_rel,
      completed_at: new Date().toISOString(), duration_seconds: duration,
      notes: `v6 | Day ${ottawaDay} [${todayBeats.join('+')}] | T:${stats.targets} S:${stats.started} OK:${stats.succeeded} P:${stats.pages} In:${stats.inserted} Dup:${stats.dupes} Lo:${stats.low_rel} E:${stats.errors.length}`
    };
    if (stats.errors.length) closePayload.error_message = stats.errors.slice(0, 3).join(' | ');
    if (runId) await supabase.from('pipeline_runs').update(closePayload).eq('id', runId);
  }

  return new Response(JSON.stringify({ success: true, version: 6, vertical: VERTICAL, stats }), { headers: { 'Content-Type': 'application/json' } });
});
