import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// rss-fetch-reputation v1 — Canada Investment Reputation vertical
const VERTICAL = 'Canada Investment Reputation';
const JOB_NAME = 'rss-fetch-reputation';

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
    if (title && url) items.push({ title: stripHtml(title).trim(), url: url.trim(), published: published?.trim() ?? new Date().toISOString(), summary: stripHtml(summary ?? '').slice(0, 1000).trim() });
  }
  return items.slice(0, 10);
}
function extractTag(t: string, tag: string): string { const re = new RegExp(`<${tag}[^>]*><!\\\[CDATA\\\[([\\s\\S]*?)\\\]\\\]><\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i'); const m = re.exec(t); return m ? (m[1] ?? m[2] ?? '').trim() : ''; }
function extractAttr(t: string, tag: string, attr: string): string { const re = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["'][^>]*\/?>`, 'i'); const m = re.exec(t); return m ? m[1] : ''; }
function stripHtml(html: string): string { return html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').replace(/\s+/g, ' ').trim(); }

async function fetchFeed(url: string): Promise<string> {
  const resp = await fetch(url, { headers: { 'User-Agent': 'CityAge/CanadaInvestmentReputation RSS 1.0' }, signal: AbortSignal.timeout(10000) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return await resp.text();
}

async function synopsizeArticle(title: string, summary: string, sourceName: string, category: string, apiKey: string, recentTitles: string[]): Promise<{synopsis: string, relevance: number, duplicate: boolean}> {
  if (!apiKey) return { synopsis: 'NO_API_KEY', relevance: 0, duplicate: false };
  const dedupeContext = recentTitles.length > 0 ? `\nALREADY PROCESSED:\n${recentTitles.slice(0, 15).map((t, i) => `${i+1}. ${t}`).join('\n')}\nDuplicate if same event.` : '';
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }, body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 300, messages: [{ role: 'user', content: `Reputation intelligence analyst tracking how the world perceives Canada as an investment destination.\n\nSource: ${sourceName} (${category})\nTitle: ${title}\nSummary: ${summary}\n${dedupeContext}\n\nJSON only: {"synopsis":"2-3 sentences. WHO said WHAT about Canada's investment climate.","relevance":7,"duplicate":false}\n\n8-10: Named leader/CEO/institution statement about Canada investment attractiveness, FDI with dollar amounts\n5-7: Policy affecting investment climate, capital flow data, rating action\n3-4: General Canadian business news\n1-2: No connection to investment reputation` }] }) });
    if (!resp.ok) return { synopsis: `API_ERR_${resp.status}`, relevance: 0, duplicate: false };
    const data = await resp.json();
    const t = data.content?.[0]?.text ?? '{}';
    try { const p = JSON.parse(t.replace(/```json|```/g, '').trim()); return { synopsis: p.synopsis ?? '', relevance: p.relevance ?? 1, duplicate: p.duplicate ?? false }; } catch { return { synopsis: t.slice(0, 300), relevance: 5, duplicate: false }; }
  } catch (err) { return { synopsis: `ERROR: ${(err as Error).message}`, relevance: 0, duplicate: false }; }
}

Deno.serve(async (req: Request) => {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 1, vertical: VERTICAL }), { headers: { 'Content-Type': 'application/json' } });
  const apiKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && apiKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const startTime = Date.now();
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
  const results = { fetched: 0, inserted: 0, synopsized: 0, skipped: 0, duplicates_blocked: 0, errors: [] as string[] };
  const processedTitles: string[] = [];
  const { data: recentArticles } = await supabase.from('rss_articles').select('title').gte('created_at', new Date(Date.now() - 24*60*60*1000).toISOString()).eq('is_synopsized', true).eq('vertical', VERTICAL);
  processedTitles.push(...(recentArticles ?? []).map((a: any) => a.title));

  try {
    const { data: sources, error: srcErr } = await supabase.from('rss_sources').select('id, name, feed_url, category').eq('vertical', VERTICAL).eq('is_active', true);
    if (srcErr) throw srcErr;
    if (!sources?.length) return new Response(JSON.stringify({ message: 'No active sources' }), { status: 200 });

    for (const source of sources) {
      try {
        const xml = await fetchFeed(source.feed_url);
        const items = parseRSSItems(xml);
        results.fetched += items.length;
        for (const item of items) {
          const pubDate = new Date(item.published);
          const { error: insertErr } = await supabase.from('rss_articles').insert({ source_id: source.id, source_name: source.name, vertical: VERTICAL, category: source.category, title: item.title, url: item.url, published_at: (isNaN(pubDate.getTime()) ? new Date() : pubDate).toISOString(), raw_summary: item.summary, is_synopsized: false });
          if (insertErr) { if (insertErr.code === '23505') results.skipped++; } else results.inserted++;
        }
        await new Promise(r => setTimeout(r, 300));
      } catch (err) { results.errors.push(`${source.name}: ${(err as Error).message}`); }
    }

    let totalSyn = 0;
    while (true) {
      const { data: unsyn } = await supabase.from('rss_articles').select('id, title, raw_summary, source_name, category').eq('is_synopsized', false).eq('vertical', VERTICAL).order('published_at', { ascending: false }).limit(10);
      if (!unsyn?.length) break;
      for (const a of unsyn) {
        const { synopsis, relevance, duplicate } = await synopsizeArticle(a.title, a.raw_summary ?? '', a.source_name, a.category ?? '', ANTHROPIC_API_KEY, processedTitles);
        if (duplicate) { await supabase.from('rss_articles').update({ is_synopsized: true, is_relevant: false, relevance_score: 1, notes: `[DUP] ${synopsis}` }).eq('id', a.id); results.duplicates_blocked++; }
        else { await supabase.from('rss_articles').update({ is_synopsized: true, is_relevant: relevance >= 5, relevance_score: relevance, notes: synopsis }).eq('id', a.id); processedTitles.push(a.title); }
        totalSyn++; await new Promise(r => setTimeout(r, 200));
      }
      results.synopsized = totalSyn;
    }
    await supabase.from('rss_sources').update({ last_scraped_at: new Date().toISOString() }).eq('vertical', VERTICAL).eq('is_active', true);
  } catch (err) { return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 }); }

  await supabase.from('pipeline_runs').insert({ job_name: JOB_NAME, stage: 'rss_fetch', run_date: todayDate, status: results.errors.length > 0 ? 'warn' : 'success', articles_fetched: results.fetched, articles_inserted: results.inserted, notes: `v1 Reputation. Syn:${results.synopsized} Dup:${results.duplicates_blocked}`, started_at: new Date(startTime).toISOString(), completed_at: new Date().toISOString(), duration_seconds: Math.round((Date.now() - startTime) / 1000) });
  return new Response(JSON.stringify({ success: true, vertical: VERTICAL, results }), { headers: { 'Content-Type': 'application/json' } });
});
