import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// feed-diagnostic v1 — checks all RSS feeds for health
// Returns: dead, empty, slow, stale, healthy with recommendations

const FUNCTION_VERSION = 'feed-diagnostic-v1';

interface FeedResult { name: string; feed_url: string; vertical: string; category: string; status: 'ok'|'dead'|'empty'|'slow'|'error'; http_status?: number; item_count?: number; last_article?: string; days_since_last?: number; error?: string; response_ms?: number; recommendation?: string; }

async function checkFeed(feed_url: string): Promise<{status: 'ok'|'dead'|'empty'|'slow'|'error'; http_status?: number; item_count?: number; error?: string; response_ms?: number}> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(feed_url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CityAge-FeedBot/1.0)', 'Accept': 'application/rss+xml, application/xml, text/xml, */*' } });
    clearTimeout(timeout);
    const response_ms = Date.now() - start;
    if (!res.ok) return { status: 'dead', http_status: res.status, response_ms };
    const text = await res.text();
    const item_count = (text.match(/<item[\s>]/gi) || []).length + (text.match(/<entry[\s>]/gi) || []).length;
    if (item_count === 0) { if (!text.includes('<rss') && !text.includes('<feed') && !text.includes('<channel')) return { status: 'dead', http_status: res.status, item_count: 0, response_ms, error: 'Not valid RSS/Atom' }; return { status: 'empty', http_status: res.status, item_count: 0, response_ms }; }
    return { status: response_ms > 8000 ? 'slow' : 'ok', http_status: res.status, item_count, response_ms };
  } catch (err) { return { status: 'error', response_ms: Date.now() - start, error: (err as any).name === 'AbortError' ? 'Timeout 12s' : String(err) }; }
}

function recommend(r: FeedResult): string {
  if (r.status === 'dead') { if (r.http_status === 404) return '404 — feed moved'; if (r.http_status === 403) return '403 — blocking bots'; return `Dead (HTTP ${r.http_status})`; }
  if (r.status === 'error') return r.error?.includes('Timeout') ? 'Timeout — try Google News alt' : `Error: ${r.error}`;
  if (r.status === 'empty') return 'Valid but zero items';
  if (r.status === 'slow') return `Slow (${r.response_ms}ms)`;
  if (r.days_since_last && r.days_since_last > 7) return `OK but ${r.days_since_last}d since last article — check scoring`;
  return 'Healthy';
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const vertical = url.searchParams.get('vertical') || null;
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    let query = supabase.from('rss_sources').select('name, feed_url, vertical, category, is_active').eq('is_active', true);
    if (vertical) query = query.eq('vertical', vertical);
    const { data: sources, error: srcError } = await query.order('vertical').order('name');
    if (srcError) throw srcError;

    const { data: lastArticles } = await supabase.from('rss_articles').select('source_name, vertical, created_at').order('created_at', { ascending: false });
    const lastSeen = new Map<string, string>();
    for (const a of (lastArticles || [])) { const k = `${a.source_name}::${a.vertical}`; if (!lastSeen.has(k)) lastSeen.set(k, a.created_at); }

    const results: FeedResult[] = [];
    for (let i = 0; i < (sources || []).length; i += 5) {
      const batch = (sources || []).slice(i, i + 5);
      const br = await Promise.all(batch.map(async (src) => {
        const check = await checkFeed(src.feed_url);
        const lastDate = lastSeen.get(`${src.name}::${src.vertical}`) || null;
        const daysSince = lastDate ? Math.floor((Date.now() - new Date(lastDate).getTime()) / 86400000) : null;
        const r: FeedResult = { name: src.name, feed_url: src.feed_url, vertical: src.vertical, category: src.category, last_article: lastDate, days_since_last: daysSince, ...check };
        r.recommendation = recommend(r);
        return r;
      }));
      results.push(...br);
    }

    const summary = { total: results.length, healthy: results.filter(r => r.status === 'ok' && (!r.days_since_last || r.days_since_last <= 7)).length, dead: results.filter(r => r.status === 'dead' || r.status === 'error').length, empty: results.filter(r => r.status === 'empty').length, stale: results.filter(r => r.status === 'ok' && r.days_since_last && r.days_since_last > 7).length };
    return new Response(JSON.stringify({ version: FUNCTION_VERSION, summary, all_results: results.map(r => ({ status: r.status, name: r.name, vertical: r.vertical, item_count: r.item_count, days_since_last: r.days_since_last, recommendation: r.recommendation })) }, null, 2), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) { return new Response(JSON.stringify({ error: String(err) }), { status: 500 }); }
});
