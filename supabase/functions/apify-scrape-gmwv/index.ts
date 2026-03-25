import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// apify-scrape-gmwv v5 — West Van council & community sources
// playwright:firefox for JS-rendered sites, cheerio for static

const VERTICAL = 'West Van Daybreaker';
const JOB_NAME = 'apify-scrape-gmwv';

const SCRAPE_TARGETS: Array<{ url: string; label: string; content_type: string; maxPages: number; crawler: 'cheerio' | 'playwright:firefox'; globs?: string[]; }> = [
  { url: 'https://westvancouver.ca/news', label: 'District of WV News', content_type: 'council_record', maxPages: 8, crawler: 'cheerio', globs: ['https://westvancouver.ca/news/**'] },
  { url: 'https://westvancouver.ca/mayor-council/council-agendas-minutes', label: 'WV Council Agendas', content_type: 'council_record', maxPages: 5, crawler: 'cheerio', globs: ['https://westvancouver.ca/mayor-council/**'] },
  { url: 'https://westvancouver.ca/news/notices', label: 'WV Public Notices', content_type: 'council_record', maxPages: 5, crawler: 'cheerio', globs: ['https://westvancouver.ca/news/**'] },
  { url: 'https://www.westvancouverite.ca/', label: 'westvancouverITE Projects', content_type: 'council_record', maxPages: 8, crawler: 'playwright:firefox', globs: ['https://www.westvancouverite.ca/**'] },
  { url: 'https://kaymeek.com/whats-on/', label: 'Kay Meek Events', content_type: 'community_event', maxPages: 5, crawler: 'playwright:firefox', globs: ['https://kaymeek.com/**'] },
  { url: 'https://westvanlibrary.ca/events-programs/', label: 'WV Library Events', content_type: 'community_event', maxPages: 5, crawler: 'playwright:firefox', globs: ['https://westvanlibrary.ca/**'] },
  { url: 'https://westvanpolice.ca/crime-alerts/', label: 'WV Police Alerts', content_type: 'crime_safety', maxPages: 5, crawler: 'cheerio', globs: ['https://westvanpolice.ca/**'] },
];

async function fetchDataset(apiToken: string, datasetId: string): Promise<Array<{url: string, title: string, text: string}>> {
  try {
    const resp = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiToken}&format=json&limit=20`);
    if (!resp.ok) return [];
    const items = await resp.json();
    return (items || []).map((i: any) => ({ url: i.url || '', title: i.metadata?.title || i.title || '', text: (i.markdown || i.text || '').slice(0, 4000) })).filter((i: any) => i.url && i.text.length > 80);
  } catch { return []; }
}

async function checkRunStatus(apiToken: string, runId: string): Promise<string> {
  try { const r = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${apiToken}`); return r.ok ? ((await r.json())?.data?.status || 'UNKNOWN') : 'UNKNOWN'; } catch { return 'UNKNOWN'; }
}

async function synopsizePage(title: string, text: string, label: string, apiKey: string, recentTitles: string[]): Promise<{synopsis: string, relevance: number, duplicate: boolean}> {
  if (!apiKey) return { synopsis: '', relevance: 5, duplicate: false };
  const dedupeCtx = recentTitles.length > 0 ? `\nALREADY PROCESSED:\n${recentTitles.slice(0, 15).map((t, i) => `${i+1}. ${t}`).join('\n')}\nDuplicate if same event.` : '';
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 200, messages: [{ role: 'user', content: `Editor of West Van Daybreaker.\n\nSource: ${label}\nTitle: ${title}\nContent: ${text.slice(0, 2500)}${dedupeCtx}\n\nJSON only: {"synopsis":"2-3 sentences","relevance":7,"duplicate":false}\n\n9-10=council decision/crime, 7-8=project/event, 5-6=general, 3-4=boilerplate, 1-2=nav page` }] }) });
    if (!resp.ok) return { synopsis: '', relevance: 5, duplicate: false };
    const t = (await resp.json()).content?.[0]?.text ?? '{}';
    try { const p = JSON.parse(t.replace(/```json|```/g, '').trim()); return { synopsis: p.synopsis ?? '', relevance: p.relevance ?? 5, duplicate: p.duplicate ?? false }; } catch { return { synopsis: '', relevance: 4, duplicate: false }; }
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
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 5, vertical: VERTICAL, targets: SCRAPE_TARGETS.map(t => t.label) }), { headers: { 'Content-Type': 'application/json' } });
  if (!APIFY_API_TOKEN) return new Response(JSON.stringify({ error: 'APIFY_API_TOKEN not set' }), { status: 500 });

  const startTime = Date.now();
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
  let targetsToRun = SCRAPE_TARGETS;
  try { const body = await req.json(); if (body?.labels) targetsToRun = SCRAPE_TARGETS.filter(t => body.labels.includes(t.label)); } catch {}

  const { data: runRow } = await supabase.from('pipeline_runs').insert({ job_name: JOB_NAME, stage: 'apify_scrape', run_date: todayDate, status: 'running', started_at: new Date().toISOString() }).select('id').single();
  const runId = runRow?.id ?? null;

  const { data: recentArts } = await supabase.from('rss_articles').select('title, url').eq('vertical', VERTICAL).gte('created_at', new Date(Date.now() - 48*60*60*1000).toISOString());
  const recentTitles = (recentArts ?? []).map((a: any) => a.title);
  const recentUrls = new Set((recentArts ?? []).map((a: any) => a.url));
  const results = { targets: targetsToRun.length, started: 0, succeeded: 0, pages: 0, inserted_docs: 0, inserted_articles: 0, dupes: 0, low_rel: 0, errors: [] as string[] };

  try {
    for (const target of targetsToRun) {
      try {
        const resp = await fetch(`https://api.apify.com/v2/acts/apify~website-content-crawler/runs?token=${APIFY_API_TOKEN}&waitForFinish=90`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ startUrls: [{ url: target.url }], maxCrawlPages: target.maxPages, crawlerType: target.crawler, maxCrawlDepth: 2, outputFormats: ['markdown'], removeElementsCssSelector: 'nav, footer, header, .breadcrumb, script, style', ...(target.globs?.length ? { includeUrlGlobs: target.globs } : {}) }) });
        if (!resp.ok) { results.errors.push(`${target.label}: HTTP ${resp.status}`); continue; }
        const runData = await resp.json(); const apifyRunId = runData?.data?.id; const datasetId = runData?.data?.defaultDatasetId; let runStatus = runData?.data?.status; results.started++;
        if (runStatus === 'RUNNING' || runStatus === 'READY') { for (let i = 0; i < 8; i++) { await new Promise(r => setTimeout(r, 10000)); runStatus = await checkRunStatus(APIFY_API_TOKEN, apifyRunId); if (['SUCCEEDED','FAILED','ABORTED'].includes(runStatus)) break; } }
        if (runStatus !== 'SUCCEEDED') { results.errors.push(`${target.label}: ${runStatus}`); continue; }
        results.succeeded++;
        const pages = await fetchDataset(APIFY_API_TOKEN, datasetId); results.pages += pages.length;
        for (const page of pages) {
          if (page.url === target.url || recentUrls.has(page.url)) { results.dupes++; continue; }
          const { synopsis, relevance, duplicate } = await synopsizePage(page.title, page.text, target.label, ANTHROPIC_API_KEY, recentTitles);
          if (duplicate) { results.dupes++; continue; } if (relevance < 4) { results.low_rel++; continue; }
          await supabase.from('documents').insert({ content_type: target.content_type, vertical: VERTICAL, title: page.title.slice(0, 500), body: page.text.slice(0, 5000), summary: synopsis, source_name: `Apify: ${target.label}`, url: page.url, is_proprietary: false, published_at: new Date().toISOString() });
          results.inserted_docs++;
          const { error: artErr } = await supabase.from('rss_articles').insert({ source_id: null, source_name: `Apify: ${target.label}`, vertical: VERTICAL, category: target.content_type, title: page.title.slice(0, 500), url: page.url, published_at: new Date().toISOString(), raw_summary: page.text.slice(0, 2000), is_synopsized: true, is_relevant: relevance >= 5, relevance_score: relevance, notes: synopsis });
          if (!artErr) { results.inserted_articles++; recentTitles.push(page.title); recentUrls.add(page.url); }
          await new Promise(r => setTimeout(r, 200));
        }
      } catch (err) { results.errors.push(`${target.label}: ${(err as Error).message}`); }
      await new Promise(r => setTimeout(r, 500));
    }
  } finally {
    const dur = Math.round((Date.now() - startTime) / 1000);
    const payload: any = { status: results.errors.length > results.targets / 2 ? 'warn' : 'success', articles_fetched: results.pages, articles_inserted: results.inserted_docs + results.inserted_articles, articles_skipped: results.dupes + results.low_rel, completed_at: new Date().toISOString(), duration_seconds: dur, notes: `v5 GMWV | T:${results.targets} OK:${results.succeeded} P:${results.pages} D:${results.inserted_docs} A:${results.inserted_articles} Dup:${results.dupes} E:${results.errors.length}` };
    if (results.errors.length) payload.error_message = results.errors.slice(0, 3).join(' | ');
    if (runId) await supabase.from('pipeline_runs').update(payload).eq('id', runId);
  }

  return new Response(JSON.stringify({ success: true, version: 5, vertical: VERTICAL, results }), { headers: { 'Content-Type': 'application/json' } });
});
