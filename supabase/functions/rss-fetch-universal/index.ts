import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// rss-fetch-universal v4 — THE definitive RSS engine for all verticals
// Inline Haiku scoring, full-text fetch, batching support, proper runId UPDATE pattern

const JOB_NAME = 'rss-fetch-universal';
const FEED_TIMEOUT_MS = 12_000;
const ARTICLE_TIMEOUT_MS = 8_000;
const HAIKU_TIMEOUT_MS = 12_000;

function parseRSSItems(xml: string): Array<{title: string, url: string, published: string, summary: string}> {
  const items: Array<{title: string, url: string, published: string, summary: string}> = [];
  const itemRegex = /<(?:item|entry)[^>]*>([\s\S]*?)<\/(?:item|entry)>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, 'title');
    const url = extractTag(block, 'link') || extractAttr(block, 'link', 'href');
    const published = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated');
    const summary = extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content');
    if (title && url) items.push({ title: stripHtml(title).trim(), url: url.trim(), published: published?.trim() ?? new Date().toISOString(), summary: stripHtml(summary ?? '').slice(0, 2000).trim() });
  }
  return items.slice(0, 10);
}
function extractTag(t: string, tag: string): string { const re = new RegExp(`<${tag}[^>]*><!\\\[CDATA\\\[([\\s\\S]*?)\\\]\\\]><\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i'); const m = re.exec(t); return m ? (m[1] ?? m[2] ?? '').trim() : ''; }
function extractAttr(t: string, tag: string, attr: string): string { const re = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["'][^>]*\/?>`, 'i'); const m = re.exec(t); return m ? m[1] : ''; }
function stripHtml(h: string): string { return h.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&#\d+;/g,'').replace(/\s+/g,' ').trim(); }

async function fetchFeed(url: string): Promise<string> {
  const resp = await fetch(url, { headers: { 'User-Agent': 'CityAge-UrbanPlanet/4.0', 'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' }, signal: AbortSignal.timeout(FEED_TIMEOUT_MS) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.text();
}

async function fetchFullArticle(url: string): Promise<string | null> {
  try {
    if (!url.startsWith('http')) return null;
    const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CityAge-UrbanPlanet/4.0)' }, signal: AbortSignal.timeout(ARTICLE_TIMEOUT_MS) });
    if (!resp.ok) return null;
    const html = await resp.text();
    const paywallHits = ['subscribe to read','subscription required','sign in to read','paywall','premium content'].filter(s => html.toLowerCase().includes(s)).length;
    if (paywallHits >= 2) return null;
    const text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi,' ').replace(/<header[^>]*>[\s\S]*?<\/header>/gi,' ').replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi,' ').replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi,' ').replace(/<!--[\s\S]*?-->/g,' ').replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&#\d+;/g,'').replace(/\s+/g,' ').trim();
    return text.length < 200 ? null : text.slice(0, 4000);
  } catch { return null; }
}

async function scoreArticle(title: string, content: string, sourceName: string, category: string, screeningPrompt: string | null, apiKey: string, recentTitles: string[]): Promise<{relevance: number, duplicate: boolean, notes: string}> {
  if (!apiKey) return { relevance: 6, duplicate: false, notes: '' };
  const dedupeContext = recentTitles.length > 0 ? `\nALREADY COVERED:\n${recentTitles.slice(0, 20).map((t, i) => `${i+1}. ${t}`).join('\n')}\nMark duplicate:true if same event.` : '';
  let prompt: string;
  if (screeningPrompt) {
    prompt = screeningPrompt.replace(/{{source_name}}/g, sourceName).replace(/{{title}}/g, title).replace(/{{summary}}/g, content.slice(0, 1000)).replace(/{{category}}/g, category).replace(/{{dedupe_context}}/g, dedupeContext) + '\n\nJSON only: {"relevance":7,"duplicate":false,"notes":""}';
  } else {
    prompt = `Score relevance 1-10. Source: ${sourceName} (${category})\nTitle: ${title}\nContent: ${content.slice(0, 800)}\n${dedupeContext}\n\nJSON only: {"relevance":6,"duplicate":false,"notes":""}`;
  }
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 80, messages: [{ role: 'user', content: prompt }] }), signal: AbortSignal.timeout(HAIKU_TIMEOUT_MS) });
    if (!resp.ok) return { relevance: 6, duplicate: false, notes: '' };
    const data = await resp.json(); const t = data.content?.[0]?.text ?? '{}';
    try { const p = JSON.parse(t.replace(/```json|```/g, '').trim()); return { relevance: p.relevance ?? 6, duplicate: p.duplicate ?? false, notes: p.notes ?? '' }; } catch { return { relevance: 6, duplicate: false, notes: '' }; }
  } catch { return { relevance: 6, duplicate: false, notes: '' }; }
}

Deno.serve(async (req: Request) => {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 4 }), { headers: { 'Content-Type': 'application/json' } });
  const hdrKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && hdrKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  let body: any = {};
  try { body = await req.json(); } catch {}
  const vertical: string = body.vertical;
  if (!vertical) return new Response(JSON.stringify({ error: 'Missing: vertical' }), { status: 400 });
  const batchNum: number = body.batch ?? 0;
  const totalBatches: number = body.total_batches ?? 1;
  const skipScoring: boolean = body.skip_scoring ?? false;

  const startTime = Date.now();
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
  const { data: runRow } = await supabase.from('pipeline_runs').insert({ job_name: JOB_NAME, stage: 'rss_fetch', run_date: todayDate, status: 'running', started_at: new Date().toISOString(), notes: `${vertical} | batch:${batchNum}/${totalBatches}` }).select('id').single();
  const runId = runRow?.id ?? null;

  const stats = { sources: 0, fetched: 0, inserted: 0, skipped: 0, ft_ok: 0, ft_fail: 0, scored: 0, duplicates_blocked: 0, errors: [] as string[] };
  let finalStatus = 'success';
  let finalError: string | null = null;

  try {
    const { data: config } = await supabase.from('vertical_config').select('rss_screening_prompt, relevance_threshold').eq('vertical', vertical).single();
    const screeningPrompt: string | null = config?.rss_screening_prompt ?? null;
    const relevanceThreshold: number = config?.relevance_threshold ?? 5;

    const since36h = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
    const { data: recentArticles } = await supabase.from('rss_articles').select('title').eq('vertical', vertical).eq('is_synopsized', true).gte('created_at', since36h);
    const recentTitles: string[] = (recentArticles ?? []).map((a: any) => a.title);

    const { data: allSources, error: srcErr } = await supabase.from('rss_sources').select('id, name, feed_url, category').eq('vertical', vertical).eq('is_active', true).order('id');
    if (srcErr) throw new Error(`rss_sources: ${srcErr.message}`);
    if (!allSources?.length) throw new Error(`No active sources for: ${vertical}`);

    let sources = allSources;
    if (batchNum > 0 && totalBatches > 1) { const cs = Math.ceil(allSources.length / totalBatches); sources = allSources.slice((batchNum - 1) * cs, (batchNum - 1) * cs + cs); }
    stats.sources = sources.length;

    for (const source of sources) {
      try {
        const xml = await fetchFeed(source.feed_url); const items = parseRSSItems(xml); stats.fetched += items.length;
        for (const item of items) {
          const pubDate = new Date(item.published); const validDate = isNaN(pubDate.getTime()) ? new Date() : pubDate;
          const fullText = await fetchFullArticle(item.url); fullText ? stats.ft_ok++ : stats.ft_fail++;
          const { error: insertErr } = await supabase.from('rss_articles').insert({ source_id: source.id, source_name: source.name, vertical, category: source.category ?? null, title: item.title, url: item.url, published_at: validDate.toISOString(), raw_summary: item.summary, full_text: fullText, is_synopsized: false });
          if (insertErr) { if (insertErr.code === '23505') stats.skipped++; else stats.errors.push(`${source.name}: ${insertErr.message}`); } else stats.inserted++;
        }
        await new Promise(r => setTimeout(r, 150));
      } catch (err) { stats.errors.push(`FEED [${source.name}]: ${(err as Error).message}`); }
    }
    await supabase.from('rss_sources').update({ last_scraped_at: new Date().toISOString() }).eq('vertical', vertical).eq('is_active', true);

    if (!skipScoring) {
      let round = 0;
      while (true) {
        const { data: unscored } = await supabase.from('rss_articles').select('id, title, raw_summary, full_text, source_name, category').eq('is_synopsized', false).eq('vertical', vertical).order('published_at', { ascending: false }).limit(20);
        if (!unscored?.length) break;
        round++;
        for (const a of unscored) {
          const content = a.full_text ?? a.raw_summary ?? a.title;
          const { relevance, duplicate, notes } = await scoreArticle(a.title, content, a.source_name, a.category ?? '', screeningPrompt, ANTHROPIC_API_KEY, recentTitles);
          if (duplicate) { await supabase.from('rss_articles').update({ is_synopsized: true, is_relevant: false, relevance_score: 1, notes: `[DUP] ${notes}` }).eq('id', a.id); stats.duplicates_blocked++; }
          else { await supabase.from('rss_articles').update({ is_synopsized: true, is_relevant: relevance >= relevanceThreshold, relevance_score: relevance, notes: notes || null }).eq('id', a.id); if (relevance >= relevanceThreshold) recentTitles.push(a.title); }
          stats.scored++; await new Promise(r => setTimeout(r, 100));
        }
        if (round >= 15) break;
      }
    }
    finalStatus = stats.errors.length > 0 ? 'warn' : 'success';
  } catch (err) { finalStatus = 'failed'; finalError = (err as Error).message; } finally {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const closePayload: any = { status: finalStatus, articles_fetched: stats.fetched, articles_inserted: stats.inserted, articles_skipped: stats.skipped, articles_synopsized: stats.scored, completed_at: new Date().toISOString(), duration_seconds: duration, notes: `v4 | ${vertical} | batch:${batchNum}/${totalBatches} | s:${stats.sources} f:${stats.fetched} n:${stats.inserted} sk:${stats.skipped} sc:${stats.scored} dup:${stats.duplicates_blocked} e:${stats.errors.length}` };
    if (finalError) closePayload.error_message = finalError;
    if (runId) await supabase.from('pipeline_runs').update(closePayload).eq('id', runId);
  }
  return new Response(JSON.stringify({ success: finalStatus !== 'failed', version: 4, vertical, stats, duration_seconds: Math.round((Date.now() - startTime) / 1000) }), { headers: { 'Content-Type': 'application/json' } });
});
