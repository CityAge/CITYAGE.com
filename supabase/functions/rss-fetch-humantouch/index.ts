import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// rss-fetch-humantouch v1 — The Human Touch AI
// Architecture: same as rss-fetch-gmwv v5 (parallel fetch + parallel score)
// Three beats: Technology (what's being built), Adoption (how people use it), Protection (how people defend against it)

const VERTICAL = 'The Human Touch';
const JOB_NAME = 'rss-fetch-humantouch';
const FEED_TIMEOUT_MS = 10_000;
const ARTICLE_FETCH_TIMEOUT_MS = 8_000;
const HAIKU_TIMEOUT_MS = 10_000;
const FEED_BATCH_SIZE = 8;
const SCORE_BATCH_SIZE = 8;
const MAX_ITEMS_PER_FEED = 8;
const HARD_TIMEOUT_MS = 110_000;

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
      title: stripHtml(title).trim(), url: url.trim(),
      published: published?.trim() ?? new Date().toISOString(),
      summary: stripHtml(summary ?? '').slice(0, 2000).trim()
    });
  }
  return items.slice(0, MAX_ITEMS_PER_FEED);
}

function extractTag(t: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, 'i');
  const m = re.exec(t); return m ? (m[1] ?? m[2] ?? '').trim() : '';
}
function extractAttr(t: string, tag: string, attr: string): string {
  const re = new RegExp(`<${tag}[^>]*${attr}=["']([^"']+)["'][^>]*\/?>`, 'i');
  const m = re.exec(t); return m ? m[1] : '';
}
function stripHtml(h: string): string {
  return h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').replace(/\s+/g, ' ').trim();
}

async function fetchFeed(url: string): Promise<string> {
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'TheHumanTouch/1.0 RSS Reader', 'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' },
    signal: AbortSignal.timeout(FEED_TIMEOUT_MS)
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return await resp.text();
}

async function fetchFullArticle(url: string): Promise<string | null> {
  try {
    if (!url.startsWith('http')) return null;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TheHumanTouch/1.0)', 'Accept': 'text/html,*/*' },
      signal: AbortSignal.timeout(ARTICLE_FETCH_TIMEOUT_MS)
    });
    if (!resp.ok) return null;
    const html = await resp.text();
    const paywallSignals = ['subscribe to read', 'subscription required', 'sign in to read', 'paywall', 'subscribers only'];
    if (paywallSignals.filter(s => html.toLowerCase().includes(s)).length >= 2) return null;
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, ' ')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, ' ')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, ' ')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, ' ')
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '')
      .replace(/\s+/g, ' ').trim();
    return text.length < 200 ? null : text.slice(0, 5000);
  } catch { return null; }
}

async function scoreArticle(
  id: string, title: string, content: string, sourceName: string,
  apiKey: string, recentTitles: string[]
): Promise<{id: string, relevance: number, duplicate: boolean}> {
  if (!apiKey) return { id, relevance: 5, duplicate: false };
  const dedupeContext = recentTitles.length > 0
    ? `\nALREADY COVERED:\n${recentTitles.slice(0, 20).map((t, i) => `${i+1}. ${t}`).join('\n')}\nMark duplicate:true if same event.`
    : '';
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', max_tokens: 60,
        messages: [{ role: 'user', content: `Rate relevance (1-10) for The Human Touch AI — a daily AI publication covering three beats:\n\n1. THE TECHNOLOGY: What's being built. New models, breakthroughs, capabilities, benchmarks, releases.\n2. THE ADOPTION: How people use it. Workflows, industries transformed, education, creative tools, business deployment.\n3. THE PROTECTION: How people defend against it. Safety, regulation, rights, deepfakes, labor displacement, surveillance, ethics.\n\nSource: ${sourceName}\nTitle: ${title}\nText: ${content.slice(0, 600)}\n${dedupeContext}\n\n8-10: Major AI development, significant to a general intelligent audience\n5-7: Relevant AI story, useful context\n3-4: Tangential tech story with some AI angle\n1-2: Not AI-relevant\n\nJSON only: {"relevance":7,"duplicate":false}` }]
      }),
      signal: AbortSignal.timeout(HAIKU_TIMEOUT_MS)
    });
    if (!resp.ok) return { id, relevance: 5, duplicate: false };
    const data = await resp.json();
    const text = data.content?.[0]?.text ?? '{}';
    try {
      const p = JSON.parse(text.replace(/```json|```/g, '').trim());
      return { id, relevance: p.relevance ?? 5, duplicate: p.duplicate ?? false };
    } catch { return { id, relevance: 5, duplicate: false }; }
  } catch { return { id, relevance: 5, duplicate: false }; }
}

Deno.serve(async (req: Request) => {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
  const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 1, vertical: VERTICAL }), { headers: { 'Content-Type': 'application/json' } });
  const hdrKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && hdrKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  const startTime = Date.now();
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
  const results = { fetched: 0, inserted: 0, full_text: 0, ft_fail: 0, scored: 0, skipped: 0, duplicates: 0, embedded: 0, feed_errors: 0, errors: [] as string[] };
  let finalStatus = 'success';
  let finalError: string | null = null;
  let timedOut = false;

  const { data: runRow } = await supabase.from('pipeline_runs')
    .insert({ job_name: JOB_NAME, stage: 'rss_fetch', run_date: todayDate, status: 'running', started_at: new Date().toISOString() })
    .select('id').single();
  const runId = runRow?.id ?? null;

  try {
    const since36h = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
    const { data: recent } = await supabase.from('rss_articles').select('title')
      .gte('created_at', since36h).eq('is_synopsized', true).eq('vertical', VERTICAL);
    const recentTitles: string[] = (recent ?? []).map((a: any) => a.title);

    const { data: sources, error: srcErr } = await supabase.from('rss_sources')
      .select('id, name, feed_url, category').eq('vertical', VERTICAL).eq('is_active', true);
    if (srcErr) throw srcErr;
    if (!sources?.length) throw new Error(`No active RSS sources for ${VERTICAL}`);

    for (let i = 0; i < sources.length; i += FEED_BATCH_SIZE) {
      if (Date.now() - startTime > HARD_TIMEOUT_MS) { timedOut = true; break; }
      const batch = sources.slice(i, i + FEED_BATCH_SIZE);

      const feedResults = await Promise.allSettled(batch.map(async (source) => {
        try {
          const xml = await fetchFeed(source.feed_url);
          const items = parseRSSItems(xml);
          const fullTexts = await Promise.all(items.map(item => fetchFullArticle(item.url)));
          let batchInserted = 0;
          for (let j = 0; j < items.length; j++) {
            const item = items[j];
            const fullText = fullTexts[j];
            if (fullText) results.full_text++; else results.ft_fail++;
            const pubDate = new Date(item.published);
            const validDate = isNaN(pubDate.getTime()) ? new Date() : pubDate;
            const { error: insertErr } = await supabase.from('rss_articles').insert({
              source_id: source.id, source_name: source.name, vertical: VERTICAL,
              category: source.category, title: item.title, url: item.url,
              published_at: validDate.toISOString(), raw_summary: item.summary,
              full_text: fullText, is_synopsized: false
            });
            if (insertErr) {
              if (insertErr.code === '23505') results.skipped++;
            } else { batchInserted++; }
          }
          return { fetched: items.length, inserted: batchInserted };
        } catch (err) {
          results.feed_errors++;
          results.errors.push(`FEED [${source.name}]: ${(err as Error).message}`);
          return { fetched: 0, inserted: 0 };
        }
      }));

      for (const r of feedResults) {
        if (r.status === 'fulfilled') {
          results.fetched += r.value.fetched;
          results.inserted += r.value.inserted;
        }
      }
      if (i + FEED_BATCH_SIZE < sources.length) await new Promise(r => setTimeout(r, 200));
    }

    if (!timedOut) {
      const { data: unscored } = await supabase.from('rss_articles')
        .select('id, title, raw_summary, full_text, source_name, category')
        .eq('is_synopsized', false).eq('vertical', VERTICAL)
        .order('published_at', { ascending: false }).limit(200);

      const articles = unscored ?? [];
      for (let i = 0; i < articles.length; i += SCORE_BATCH_SIZE) {
        if (Date.now() - startTime > HARD_TIMEOUT_MS) { timedOut = true; break; }
        const batch = articles.slice(i, i + SCORE_BATCH_SIZE);
        const scores = await Promise.all(
          batch.map(a => scoreArticle(a.id, a.title, a.full_text ?? a.raw_summary ?? a.title, a.source_name, ANTHROPIC_API_KEY, recentTitles))
        );
        await Promise.all(scores.map(async ({ id, relevance, duplicate }) => {
          if (duplicate) {
            await supabase.from('rss_articles').update({ is_synopsized: true, is_relevant: false, relevance_score: 1, notes: '[DUP]' }).eq('id', id);
            results.duplicates++;
          } else {
            await supabase.from('rss_articles').update({ is_synopsized: true, is_relevant: relevance >= 5, relevance_score: relevance }).eq('id', id);
            const art = batch.find(a => a.id === id);
            if (art && relevance >= 5) recentTitles.push(art.title);
          }
          results.scored++;
        }));
        if (i + SCORE_BATCH_SIZE < articles.length) await new Promise(r => setTimeout(r, 200));
      }
    }

    if (!timedOut && OPENAI_KEY) {
      const { data: unembedded } = await supabase.from('rss_articles')
        .select('id, title, full_text, raw_summary')
        .eq('vertical', VERTICAL).eq('is_synopsized', true).is('embedding', null)
        .not('full_text', 'is', null)
        .limit(50);

      if (unembedded && unembedded.length > 0) {
        const texts = unembedded.map(a => `${a.title}\n${(a.full_text || a.raw_summary || '').slice(0, 4000)}`);
        try {
          const embResp = await fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
            body: JSON.stringify({ model: 'text-embedding-3-small', input: texts })
          });
          if (embResp.ok) {
            const embData = await embResp.json();
            const embeddings = embData?.data ?? [];
            for (let i = 0; i < embeddings.length; i++) {
              if (embeddings[i]?.embedding) {
                await supabase.from('rss_articles').update({ embedding: embeddings[i].embedding }).eq('id', unembedded[i].id);
                results.embedded++;
              }
            }
          }
        } catch (embErr) {
          results.errors.push(`EMBED: ${(embErr as Error).message}`);
        }
      }
    }

    await supabase.from('rss_sources').update({ last_scraped_at: new Date().toISOString() })
      .eq('vertical', VERTICAL).eq('is_active', true);

    finalStatus = timedOut ? 'warn' : (results.feed_errors > 10 ? 'warn' : 'success');

  } catch (err) {
    finalStatus = 'failed';
    finalError = (err as Error).message;
  } finally {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const notes = `v1. Feeds:${results.fetched} New:${results.inserted} Skip:${results.skipped} FT:${results.full_text} FT-fail:${results.ft_fail} Scored:${results.scored} Dup:${results.duplicates} Embedded:${results.embedded} FeedErr:${results.feed_errors} Time:${duration}s${timedOut ? ' TIMEOUT-PARTIAL' : ''}`;
    const closePayload: any = {
      status: finalStatus, articles_fetched: results.fetched, articles_inserted: results.inserted,
      articles_skipped: results.skipped, articles_synopsized: results.scored, articles_embedded: results.embedded,
      notes, completed_at: new Date().toISOString(), duration_seconds: duration
    };
    if (finalError) closePayload.error_message = finalError;
    if (runId) await supabase.from('pipeline_runs').update(closePayload).eq('id', runId);
    else await supabase.from('pipeline_runs').insert({ job_name: JOB_NAME, stage: 'rss_fetch', run_date: todayDate, started_at: new Date(startTime).toISOString(), ...closePayload });
  }

  return new Response(JSON.stringify({ success: finalStatus !== 'failed', version: 1, vertical: VERTICAL, timed_out: timedOut, results }), { headers: { 'Content-Type': 'application/json' } });
});
