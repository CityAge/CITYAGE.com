import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// rss-fetch-magazine v4
// CHANGE FROM v3: 72-hour freshness gate — skips articles older than 72h
// Self-contained RSS fetcher for the CityAge magazine pipeline.
// Reads ONLY from magazine_sources. Stores in magazine_articles.

const FUNCTION_VERSION = 'rss-fetch-magazine-v4';
const FEED_TIMEOUT_MS = 12_000;
const ARTICLE_TIMEOUT_MS = 8_000;
const HAIKU_TIMEOUT_MS = 15_000;
const EMBED_TIMEOUT_MS = 10_000;
const MAX_AGE_HOURS = 72; // Articles older than this are skipped

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
    if (title && url) items.push({
      title: stripHtml(title).trim(),
      url: url.trim(),
      published: published?.trim() ?? new Date().toISOString(),
      summary: stripHtml(summary ?? '').slice(0, 2000).trim()
    });
  }
  return items.slice(0, 10);
}

function extractTag(t: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
  const m = re.exec(t);
  return m ? (m[1] ?? m[2] ?? '').trim() : '';
}
function extractAttr(t: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["'][^>]*\/?>`, 'i');
  const m = re.exec(t);
  return m ? m[1] : '';
}
function stripHtml(h: string): string {
  return h.replace(/<[^>]+>/g,' ').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&#\d+;/g,'').replace(/\s+/g,' ').trim();
}

async function fetchFeed(url: string): Promise<string> {
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'CityAge-Magazine/4.0 (+https://cityage.com)',
      'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
    },
    signal: AbortSignal.timeout(FEED_TIMEOUT_MS)
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.text();
}

async function fetchFullArticle(url: string): Promise<string | null> {
  try {
    if (!url.startsWith('http')) return null;
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CityAge-Magazine/4.0; +https://cityage.com)',
        'Accept': 'text/html,application/xhtml+xml,*/*'
      },
      signal: AbortSignal.timeout(ARTICLE_TIMEOUT_MS)
    });
    if (!resp.ok) return null;
    const html = await resp.text();
    const paywallHits = ['subscribe to read','subscription required','sign in to read','create a free account','paywall','premium content','subscribers only','unlock this article']
      .filter(s => html.toLowerCase().includes(s)).length;
    if (paywallHits >= 2) return null;
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi,' ')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi,' ')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi,' ')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi,' ')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi,' ')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi,' ')
      .replace(/<!--[\s\S]*?-->/g,' ')
      .replace(/<[^>]+>/g,' ')
      .replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&#\d+;/g,'')
      .replace(/\s+/g,' ').trim();
    return text.length < 200 ? null : text.slice(0, 4000);
  } catch {
    return null;
  }
}

const HAIKU_SCORING_PROMPT = `You are the intelligence desk at CityAge — a global magazine for the leaders who build, finance, govern, and defend the world's cities.

THE CITYAGE RELEVANCE TEST:
Does this story matter to the factors that determine how people live, invest, work, and play in the 3% of the world's surface where 70% of people live, and 75% of global GDP and innovation are created?

SCORING CRITERIA:

9-10: MUST COVER. Global significance. Names, numbers, consequences.

7-8: STRONG. Any of these qualifiers earns a 7+:
  - Shows meaningful INNOVATION
  - Has a POSITIVE IMPACT on the urban planet
  - MEANINGFULLY IMPROVES HUMAN LIFE
  - Has NEVER BEEN WIDELY REPORTED and fits our criteria
  - Directly involves INFRASTRUCTURE, INVESTMENT, DEFENCE, ENERGY, SPACE, or CITIES
  - Major ENTERTAINMENT, GAMING, FASHION, or FOOD trend that shapes urban culture

5-6: POTENTIALLY RELEVANT. Needs a strong editorial angle.

3-4: WEAK CONNECTION. Tangentially related.

1-2: NOT RELEVANT. Celebrity gossip, sports scores, purely local crime, weather.

VERTICAL: {{vertical}} | CATEGORY: {{category}}
SOURCE: {{source_name}}
TITLE: {{title}}
CONTENT: {{content}}
{{dedup_context}}

Respond with ONLY valid JSON, no other text:
{"relevance":7,"duplicate":false,"notes":"one sentence editorial note"}`;

async function scoreArticle(
  title: string, content: string, sourceName: string, vertical: string, category: string,
  apiKey: string, recentTitles: string[]
): Promise<{relevance: number, duplicate: boolean, notes: string}> {
  if (!apiKey) return { relevance: 5, duplicate: false, notes: 'no_api_key' };
  try {
    const dedupeContext = recentTitles.length > 0
      ? `\nALREADY COVERED RECENTLY:\n${recentTitles.slice(0, 20).map((t, i) => `${i+1}. ${t}`).join('\n')}\nMark duplicate:true if this covers the same specific event.`
      : '';
    const prompt = HAIKU_SCORING_PROMPT
      .replace('{{vertical}}', vertical).replace('{{category}}', category)
      .replace('{{source_name}}', sourceName).replace('{{title}}', title)
      .replace('{{content}}', content.slice(0, 1200)).replace('{{dedup_context}}', dedupeContext);

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 120, messages: [{ role: 'user', content: prompt }] }),
      signal: AbortSignal.timeout(HAIKU_TIMEOUT_MS)
    });
    if (!resp.ok) { const e = await resp.text().catch(() => ''); return { relevance: 5, duplicate: false, notes: `haiku_http_${resp.status}: ${e.slice(0,100)}` }; }
    const data = await resp.json();
    const rawText = data.content?.[0]?.text ?? '';
    if (!rawText) return { relevance: 5, duplicate: false, notes: 'haiku_empty' };
    const jsonMatch = rawText.match(/\{[^{}]*"relevance"[^{}]*\}/);
    if (jsonMatch) {
      const p = JSON.parse(jsonMatch[0]);
      return { relevance: typeof p.relevance === 'number' ? p.relevance : 5, duplicate: p.duplicate === true, notes: (p.notes ?? '').slice(0, 200) };
    }
    try {
      const p = JSON.parse(rawText.replace(/```json|```/g, '').trim());
      return { relevance: typeof p.relevance === 'number' ? p.relevance : 5, duplicate: p.duplicate === true, notes: (p.notes ?? '').slice(0, 200) };
    } catch { return { relevance: 5, duplicate: false, notes: `haiku_parse_fail: ${rawText.slice(0, 80)}` }; }
  } catch (err) { return { relevance: 5, duplicate: false, notes: `haiku_error: ${(err as Error).message.slice(0, 80)}` }; }
}

async function embedText(text: string, apiKey: string): Promise<number[] | null> {
  if (!apiKey || !text) return null;
  try {
    const resp = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: text.slice(0, 8000) }),
      signal: AbortSignal.timeout(EMBED_TIMEOUT_MS)
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    return data.data?.[0]?.embedding ?? null;
  } catch { return null; }
}

Deno.serve(async (req: Request) => {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 4, function: FUNCTION_VERSION }), { headers: { 'Content-Type': 'application/json' } });

  let body: any = {};
  try { body = await req.json(); } catch {}

  const batchNum: number = body.batch ?? 0;
  const specialReport: string | null = body.special_report ?? null;
  const skipScoring: boolean = body.skip_scoring ?? false;
  const skipEmbedding: boolean = body.skip_embedding ?? true;

  const startTime = Date.now();
  const freshnessCutoff = new Date(Date.now() - MAX_AGE_HOURS * 60 * 60 * 1000);
  const stats = {
    sources: 0, fetched: 0, inserted: 0, skipped: 0, stale_skipped: 0,
    ft_ok: 0, ft_fail: 0, scored: 0, duplicates_blocked: 0,
    embedded: 0, embed_fail: 0,
    score_distribution: {} as Record<number, number>,
    errors: [] as string[]
  };

  try {
    console.log(`[${FUNCTION_VERSION}] Starting | batch:${batchNum} | freshness: ${MAX_AGE_HOURS}h`);

    let query = supabase.from('magazine_sources')
      .select('id, name, feed_url, magazine_vertical, category, special_report')
      .eq('is_active', true).eq('source_type', 'rss');

    if (specialReport) { query = query.eq('special_report', specialReport); }
    else if (batchNum === 0) { query = query.eq('tier', 1); }
    else { query = query.eq('fetch_batch', batchNum); }

    const { data: sources, error: srcErr } = await query.order('id');
    if (srcErr) throw new Error(`magazine_sources: ${srcErr.message}`);
    if (!sources?.length) return new Response(JSON.stringify({ success: true, message: `No sources for batch ${batchNum}`, stats }), { headers: { 'Content-Type': 'application/json' } });
    stats.sources = sources.length;

    const since48h = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const { data: recentArticles } = await supabase.from('magazine_articles').select('title').eq('is_scored', true).gte('created_at', since48h);
    const recentTitles: string[] = (recentArticles ?? []).map((a: any) => a.title);

    for (const source of sources) {
      try {
        const xml = await fetchFeed(source.feed_url);
        const items = parseRSSItems(xml);
        stats.fetched += items.length;

        for (const item of items) {
          const pubDate = new Date(item.published);
          const validDate = isNaN(pubDate.getTime()) ? new Date() : pubDate;

          if (validDate < freshnessCutoff) {
            stats.stale_skipped++;
            continue;
          }

          const fullText = await fetchFullArticle(item.url);
          fullText ? stats.ft_ok++ : stats.ft_fail++;

          const { error: insertErr } = await supabase.from('magazine_articles').insert({
            source_id: source.id, source_name: source.name,
            magazine_vertical: source.magazine_vertical, category: source.category ?? null,
            title: item.title, url: item.url, published_at: validDate.toISOString(),
            raw_summary: item.summary, full_text: fullText,
            special_report: source.special_report ?? null,
            is_scored: false, is_embedded: false
          });
          if (insertErr) { insertErr.code === '23505' ? stats.skipped++ : stats.errors.push(`${source.name}: ${insertErr.message}`); }
          else { stats.inserted++; }
        }
        await new Promise(r => setTimeout(r, 150));
      } catch (err) { stats.errors.push(`FEED [${source.name}]: ${(err as Error).message}`); }
    }

    const sourceIds = sources.map(s => s.id);
    await supabase.from('magazine_sources').update({ last_fetched_at: new Date().toISOString() }).in('id', sourceIds);
    console.log(`[${FUNCTION_VERSION}] Phase 1 | fetched:${stats.fetched} new:${stats.inserted} stale_skipped:${stats.stale_skipped} dup_skipped:${stats.skipped}`);

    if (!skipScoring) {
      let scoringRound = 0;
      while (true) {
        const { data: unscored } = await supabase.from('magazine_articles')
          .select('id, title, raw_summary, full_text, source_name, magazine_vertical, category')
          .eq('is_scored', false).order('created_at', { ascending: false }).limit(20);
        if (!unscored?.length) break;
        scoringRound++;
        for (const a of unscored) {
          const content = a.full_text ?? a.raw_summary ?? a.title;
          const { relevance, duplicate, notes } = await scoreArticle(a.title, content, a.source_name, a.magazine_vertical, a.category ?? '', ANTHROPIC_API_KEY, recentTitles);
          stats.score_distribution[relevance] = (stats.score_distribution[relevance] || 0) + 1;
          if (duplicate) {
            await supabase.from('magazine_articles').update({ is_scored: true, is_relevant: false, is_duplicate: true, relevance_score: 1, haiku_notes: `[DUP] ${notes}` }).eq('id', a.id);
            stats.duplicates_blocked++;
          } else {
            await supabase.from('magazine_articles').update({ is_scored: true, is_relevant: relevance >= 6, relevance_score: relevance, haiku_notes: notes || null }).eq('id', a.id);
            if (relevance >= 6) recentTitles.push(a.title);
          }
          stats.scored++;
          await new Promise(r => setTimeout(r, 120));
        }
        if (scoringRound >= 15) break;
      }
      console.log(`[${FUNCTION_VERSION}] Phase 2 | scored:${stats.scored} dist:${JSON.stringify(stats.score_distribution)}`);
    }

    if (!skipEmbedding && OPENAI_API_KEY) {
      let embedRound = 0;
      while (true) {
        const { data: unembedded } = await supabase.from('magazine_articles')
          .select('id, title, raw_summary, full_text, source_name, magazine_vertical')
          .eq('is_scored', true).eq('is_embedded', false)
          .order('relevance_score', { ascending: false }).limit(25);
        if (!unembedded?.length) break;
        embedRound++;
        for (const a of unembedded) {
          const textToEmbed = `${a.title}\n\n${a.source_name} | ${a.magazine_vertical}\n\n${(a.full_text || a.raw_summary || '').slice(0, 6000)}`;
          const embedding = await embedText(textToEmbed, OPENAI_API_KEY);
          if (embedding) { await supabase.from('magazine_articles').update({ embedding: JSON.stringify(embedding), is_embedded: true }).eq('id', a.id); stats.embedded++; }
          else { stats.embed_fail++; }
          await new Promise(r => setTimeout(r, 50));
        }
        if (embedRound >= 10) break;
      }
      console.log(`[${FUNCTION_VERSION}] Phase 3 | embedded:${stats.embedded} fail:${stats.embed_fail}`);
    }

    const duration = Math.round((Date.now() - startTime) / 1000);
    console.log(`[${FUNCTION_VERSION}] Complete | ${duration}s`);
    return new Response(JSON.stringify({ success: true, version: 4, batch: batchNum, stats, duration_seconds: duration }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(`[${FUNCTION_VERSION}] Error:`, err);
    return new Response(JSON.stringify({ success: false, error: String(err), stats }), { status: 500 });
  }
});
