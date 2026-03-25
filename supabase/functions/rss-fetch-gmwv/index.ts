import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// rss-fetch-gmwv v5 — West Van Daybreaker
// Parallel Haiku scoring in batches of 8. Full article text fetch.

const VERTICAL = 'West Van Daybreaker';
const JOB_NAME = 'rss-fetch-gmwv';
const FEED_TIMEOUT_MS = 12_000;
const ARTICLE_FETCH_TIMEOUT_MS = 8_000;
const HAIKU_TIMEOUT_MS = 10_000;
const SCORE_BATCH_SIZE = 8;

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
function stripHtml(h: string): string { return h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').replace(/\s+/g, ' ').trim(); }

async function fetchFeed(url: string): Promise<string> {
  const resp = await fetch(url, { headers: { 'User-Agent': 'WestVanDaybreaker/5.0', 'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' }, signal: AbortSignal.timeout(FEED_TIMEOUT_MS) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return await resp.text();
}

async function fetchFullArticle(url: string): Promise<string | null> {
  try {
    if (!url.startsWith('http')) return null;
    const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; WestVanDaybreaker/5.0)' }, signal: AbortSignal.timeout(ARTICLE_FETCH_TIMEOUT_MS) });
    if (!resp.ok) return null;
    const html = await resp.text();
    const paywallSignals = ['subscribe to read', 'subscription required', 'sign in to read', 'paywall', 'subscribers only'];
    if (paywallSignals.filter(s => html.toLowerCase().includes(s)).length >= 2) return null;
    const text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, ' ').replace(/<header[^>]*>[\s\S]*?<\/header>/gi, ' ').replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, ' ').replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').replace(/\s+/g, ' ').trim();
    return text.length < 200 ? null : text.slice(0, 4000);
  } catch { return null; }
}

async function scoreArticle(id: string, title: string, content: string, sourceName: string, category: string, apiKey: string, recentTitles: string[]): Promise<{id: string, relevance: number, duplicate: boolean}> {
  if (!apiKey) return { id, relevance: 5, duplicate: false };
  const dedupeCtx = recentTitles.length > 0 ? `\nALREADY COVERED:\n${recentTitles.slice(0, 20).map((t, i) => `${i+1}. ${t}`).join('\n')}\nMark duplicate:true if same event.` : '';
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 60, messages: [{ role: 'user', content: `Rate relevance to West Vancouver residents (1-10). Duplicate?\n\nSource: ${sourceName} (${category})\nTitle: ${title}\nContent: ${content.slice(0, 600)}\n${dedupeCtx}\n\n8-10: Directly West Van (Ambleside, Dundarave, Caulfeild, Horseshoe Bay, District council, local crime/business)\n5-7: North Shore or Greater Vancouver directly affecting West Van\n3-4: Metro Vancouver, loose connection\n1-2: No connection\n\nJSON only: {"relevance":7,"duplicate":false}` }] }), signal: AbortSignal.timeout(HAIKU_TIMEOUT_MS) });
    if (!resp.ok) return { id, relevance: 5, duplicate: false };
    const data = await resp.json(); const t = data.content?.[0]?.text ?? '{}';
    try { const p = JSON.parse(t.replace(/```json|```/g, '').trim()); return { id, relevance: p.relevance ?? 5, duplicate: p.duplicate ?? false }; } catch { return { id, relevance: 5, duplicate: false }; }
  } catch { return { id, relevance: 5, duplicate: false }; }
}

Deno.serve(async (req: Request) => {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 5, vertical: VERTICAL }), { headers: { 'Content-Type': 'application/json' } });
  const hdrKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && hdrKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const startTime = Date.now();
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
  const results = { fetched: 0, inserted: 0, full_text_fetched: 0, full_text_failed: 0, synopsized: 0, skipped: 0, duplicates_blocked: 0, errors: [] as string[] };
  let finalStatus = 'success'; let finalError: string | null = null;

  const { data: runRow } = await supabase.from('pipeline_runs').insert({ job_name: JOB_NAME, stage: 'rss_fetch', run_date: todayDate, status: 'running', started_at: new Date().toISOString() }).select('id').single();
  const runId = runRow?.id ?? null;

  try {
    const since36h = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
    const { data: recent } = await supabase.from('rss_articles').select('title').gte('created_at', since36h).eq('is_synopsized', true).eq('vertical', VERTICAL);
    const recentTitles: string[] = (recent ?? []).map((a: any) => a.title);

    const { data: sources, error: srcErr } = await supabase.from('rss_sources').select('id, name, feed_url, category').eq('vertical', VERTICAL).eq('is_active', true);
    if (srcErr) throw srcErr;
    if (!sources?.length) throw new Error(`No active RSS sources for ${VERTICAL}`);

    for (const source of sources) {
      try {
        const xml = await fetchFeed(source.feed_url); const items = parseRSSItems(xml); results.fetched += items.length;
        const fullTexts = await Promise.all(items.map(item => fetchFullArticle(item.url)));
        for (let i = 0; i < items.length; i++) {
          const item = items[i]; const fullText = fullTexts[i];
          if (fullText) results.full_text_fetched++; else results.full_text_failed++;
          const pubDate = new Date(item.published);
          const { error: insertErr } = await supabase.from('rss_articles').insert({ source_id: source.id, source_name: source.name, vertical: VERTICAL, category: source.category, title: item.title, url: item.url, published_at: (isNaN(pubDate.getTime()) ? new Date() : pubDate).toISOString(), raw_summary: item.summary, full_text: fullText, is_synopsized: false });
          if (insertErr) { if (insertErr.code === '23505') results.skipped++; } else results.inserted++;
        }
        await new Promise(r => setTimeout(r, 150));
      } catch (err) { results.errors.push(`FEED ${source.name}: ${(err as Error).message}`); }
    }

    await supabase.from('rss_sources').update({ last_scraped_at: new Date().toISOString() }).eq('vertical', VERTICAL).eq('is_active', true);

    const { data: unscored } = await supabase.from('rss_articles').select('id, title, raw_summary, full_text, source_name, category').eq('is_synopsized', false).eq('vertical', VERTICAL).order('published_at', { ascending: false }).limit(150);
    const articles = unscored ?? [];

    for (let i = 0; i < articles.length; i += SCORE_BATCH_SIZE) {
      const batch = articles.slice(i, i + SCORE_BATCH_SIZE);
      const scores = await Promise.all(batch.map(a => scoreArticle(a.id, a.title, a.full_text ?? a.raw_summary ?? a.title, a.source_name, a.category ?? '', ANTHROPIC_API_KEY, recentTitles)));
      await Promise.all(scores.map(async ({ id, relevance, duplicate }) => {
        if (duplicate) { await supabase.from('rss_articles').update({ is_synopsized: true, is_relevant: false, relevance_score: 1, notes: '[DUP]' }).eq('id', id); results.duplicates_blocked++; }
        else { await supabase.from('rss_articles').update({ is_synopsized: true, is_relevant: relevance >= 5, relevance_score: relevance }).eq('id', id); const art = batch.find(a => a.id === id); if (art && relevance >= 5) recentTitles.push(art.title); }
        results.synopsized++;
      }));
      if (i + SCORE_BATCH_SIZE < articles.length) await new Promise(r => setTimeout(r, 300));
    }
    finalStatus = results.errors.length > 0 ? 'warn' : 'success';
  } catch (err) { finalStatus = 'failed'; finalError = (err as Error).message; } finally {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const closePayload: any = { status: finalStatus, articles_fetched: results.fetched, articles_inserted: results.inserted, articles_skipped: results.skipped, articles_synopsized: results.synopsized, notes: `v5 parallel(${SCORE_BATCH_SIZE}). F:${results.fetched} N:${results.inserted} S:${results.skipped} FT:${results.full_text_fetched} Scored:${results.synopsized} Dup:${results.duplicates_blocked} E:${results.errors.length} T:${duration}s`, completed_at: new Date().toISOString(), duration_seconds: duration };
    if (finalError) closePayload.error_message = finalError;
    if (runId) await supabase.from('pipeline_runs').update(closePayload).eq('id', runId);
  }

  return new Response(JSON.stringify({ success: finalStatus !== 'failed', version: 5, vertical: VERTICAL, results }), { headers: { 'Content-Type': 'application/json' } });
});
