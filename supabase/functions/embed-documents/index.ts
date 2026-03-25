import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// embed-documents v32
// JOBS:
// 1. rss_articles -> embedding + mirror to documents
// 2. briefs -> embedding + mirror to documents
// 3. canada_europe_connects_intelligence -> embedding + mirror to documents
// 4. canada_signal_index -> embedding (weekly signal + rationale)
// 5. daily_capital_temperature -> embedding (daily signal + rationale)
// 6. documents backfill -> fix missing embeddings
// Rule: every data point gets vectorized. No exceptions.

const BATCH_SIZE = 20;
const ARTICLE_LIMIT = 500;
const BRIEF_LIMIT = 100;
const CEC_LIMIT = 100;
const DOC_BACKFILL_LIMIT = 500;

Deno.serve(async (req: Request) => {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const apiKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && apiKey !== SYNC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (req.method === 'GET') {
    return new Response(JSON.stringify({ status: 'ok', version: 32, model: 'text-embedding-3-small' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set' }), { status: 500 });
  }

  const startTime = Date.now();
  const results = {
    articles_embedded: 0, briefs_embedded: 0, cec_embedded: 0,
    signal_index_embedded: 0, capital_temp_embedded: 0,
    docs_backfilled: 0, docs_upserted: 0,
    errors: [] as string[]
  };

  async function embed(text: string): Promise<number[] | null> {
    try {
      const resp = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: text.slice(0, 8000) })
      });
      if (!resp.ok) { results.errors.push(`OpenAI ${resp.status}`); return null; }
      const data = await resp.json();
      const values = data?.data?.[0]?.embedding;
      return Array.isArray(values) && values.length === 1536 ? values : null;
    } catch (e) {
      results.errors.push(`Embed error: ${(e as Error).message}`);
      return null;
    }
  }

  async function upsertDocument(doc: {
    content_type: string, vertical: string, title: string,
    body: string, url: string, source_name: string,
    relevance_score: number, published_at: string, embedding: number[]
  }) {
    const { error } = await supabase.from('documents').upsert({
      content_type: doc.content_type, vertical: doc.vertical,
      title: doc.title, body: doc.body?.slice(0, 8000),
      url: doc.url, source_name: doc.source_name,
      relevance_score: doc.relevance_score, embedding: doc.embedding,
      published_at: doc.published_at, embedded_at: new Date().toISOString(),
      is_proprietary: false
    }, { onConflict: 'url', ignoreDuplicates: false });
    if (error && error.code !== '23505') results.errors.push(`Doc upsert: ${error.message}`);
    else results.docs_upserted++;
  }

  // ── PART 1: RSS ARTICLES
  const { data: articles } = await supabase
    .from('rss_articles')
    .select('id, title, notes, raw_summary, full_text, source_name, vertical, url, published_at, relevance_score')
    .is('embedding', null)
    .order('relevance_score', { ascending: false })
    .limit(ARTICLE_LIMIT);

  for (let i = 0; i < (articles ?? []).length; i += BATCH_SIZE) {
    const batch = (articles ?? []).slice(i, i + BATCH_SIZE);
    const embeddings = await Promise.all(
      batch.map(a => embed([a.title, a.raw_summary, a.full_text, a.notes].filter(Boolean).join('\n\n')))
    );
    await Promise.all(batch.map(async (a, idx) => {
      const embedding = embeddings[idx];
      if (!embedding) return;
      await supabase.from('rss_articles').update({ embedding }).eq('id', a.id);
      results.articles_embedded++;
      await upsertDocument({
        content_type: 'rss_article', vertical: a.vertical ?? 'unknown',
        title: a.title, body: a.full_text || a.raw_summary || a.notes || '',
        url: a.url, source_name: a.source_name,
        relevance_score: a.relevance_score ?? 0, published_at: a.published_at, embedding
      });
    }));
    if (i + BATCH_SIZE < (articles ?? []).length) await new Promise(r => setTimeout(r, 200));
  }

  // ── PART 2: BRIEFS
  const { data: briefs } = await supabase
    .from('briefs')
    .select('id, title, body, vertical, published_at, created_at')
    .is('embedding', null)
    .order('created_at', { ascending: false })
    .limit(BRIEF_LIMIT);

  for (let i = 0; i < (briefs ?? []).length; i += BATCH_SIZE) {
    const batch = (briefs ?? []).slice(i, i + BATCH_SIZE);
    const embeddings = await Promise.all(batch.map(b => embed(`${b.title}\n\n${b.body}`)));
    await Promise.all(batch.map(async (b, idx) => {
      const embedding = embeddings[idx];
      if (!embedding) return;
      await supabase.from('briefs').update({ embedding }).eq('id', b.id);
      results.briefs_embedded++;
      await upsertDocument({
        content_type: 'brief', vertical: b.vertical ?? 'unknown',
        title: b.title, body: b.body || '',
        url: `brief://${b.id}`, source_name: 'The Influence Letter',
        relevance_score: 10, published_at: b.published_at || b.created_at, embedding
      });
    }));
    if (i + BATCH_SIZE < (briefs ?? []).length) await new Promise(r => setTimeout(r, 200));
  }

  // ── PART 3: CEC INTELLIGENCE
  const { data: cecRows } = await supabase
    .from('canada_europe_connects_intelligence')
    .select('id, title, body, summary, vertical, topic, published_at, created_at')
    .is('embedding', null)
    .limit(CEC_LIMIT);

  for (let i = 0; i < (cecRows ?? []).length; i += BATCH_SIZE) {
    const batch = (cecRows ?? []).slice(i, i + BATCH_SIZE);
    const embeddings = await Promise.all(
      batch.map(c => embed([c.title, c.topic, c.summary, c.body].filter(Boolean).join('\n\n')))
    );
    await Promise.all(batch.map(async (c, idx) => {
      const embedding = embeddings[idx];
      if (!embedding) return;
      await supabase.from('canada_europe_connects_intelligence').update({ embedding }).eq('id', c.id);
      results.cec_embedded++;
      await upsertDocument({
        content_type: 'research_note', vertical: c.vertical ?? 'Canada Europe Connects',
        title: c.title, body: c.body || c.summary || '',
        url: `cec-intel://${c.id}`, source_name: 'CityAge Editorial',
        relevance_score: 10, published_at: c.published_at || c.created_at, embedding
      });
    }));
    if (i + BATCH_SIZE < (cecRows ?? []).length) await new Promise(r => setTimeout(r, 200));
  }

  // ── PART 4: CANADA SIGNAL INDEX
  const { data: signalRows } = await supabase
    .from('canada_signal_index')
    .select('id, week_of, weekly_signal, composite_score, overall_direction, scoring_rationale')
    .is('embedding', null)
    .limit(20);

  for (const row of (signalRows ?? [])) {
    const rationale = row.scoring_rationale
      ? Object.entries(row.scoring_rationale).map(([k, v]) => `${k}: ${v}`).join('. ')
      : '';
    const text = `Canada Signal Index week of ${row.week_of}. Composite: ${row.composite_score}/100. ${row.overall_direction}. ${row.weekly_signal}. ${rationale}`;
    const embedding = await embed(text);
    if (!embedding) continue;
    await supabase.from('canada_signal_index')
      .update({ embedding, embedded_at: new Date().toISOString() })
      .eq('id', row.id);
    results.signal_index_embedded++;
    await upsertDocument({
      content_type: 'signal_index', vertical: 'Signal Canada',
      title: `Canada Signal Index — week of ${row.week_of}`,
      body: text, url: `signal-index://${row.week_of}`,
      source_name: 'Canada Signal Index',
      relevance_score: 10, published_at: row.week_of, embedding
    });
  }

  // ── PART 5: DAILY CAPITAL TEMPERATURE
  const { data: capitalRows } = await supabase
    .from('daily_capital_temperature')
    .select('id, scored_date, washington_score, brussels_score, new_delhi_score, ottawa_score, daily_signal, scoring_rationale')
    .is('embedding', null)
    .limit(50);

  for (const row of (capitalRows ?? [])) {
    const rationale = row.scoring_rationale
      ? Object.entries(row.scoring_rationale).map(([k, v]) => `${k}: ${v}`).join('. ')
      : '';
    const text = `Daily Capital Temperature ${row.scored_date}. Washington: ${row.washington_score}. Brussels: ${row.brussels_score}. New Delhi: ${row.new_delhi_score}. Ottawa: ${row.ottawa_score}. ${row.daily_signal}. ${rationale}`;
    const embedding = await embed(text);
    if (!embedding) continue;
    await supabase.from('daily_capital_temperature')
      .update({ embedding, embedded_at: new Date().toISOString() })
      .eq('id', row.id);
    results.capital_temp_embedded++;
    await upsertDocument({
      content_type: 'capital_temperature', vertical: 'Canada Europe Connects',
      title: `Daily Capital Temperature — ${row.scored_date}`,
      body: text, url: `capital-temp://${row.scored_date}`,
      source_name: 'Daily Capital Temperature',
      relevance_score: 10, published_at: row.scored_date, embedding
    });
  }

  // ── PART 6: DOCUMENTS BACKFILL
  const { data: docsToFix } = await supabase
    .from('documents')
    .select('id, title, body')
    .is('embedding', null)
    .limit(DOC_BACKFILL_LIMIT);

  for (let i = 0; i < (docsToFix ?? []).length; i += BATCH_SIZE) {
    const batch = (docsToFix ?? []).slice(i, i + BATCH_SIZE);
    const embeddings = await Promise.all(batch.map(d => embed(`${d.title}\n\n${d.body || ''}`)));
    await Promise.all(batch.map(async (d, idx) => {
      const embedding = embeddings[idx];
      if (!embedding) return;
      const { error } = await supabase.from('documents')
        .update({ embedding, embedded_at: new Date().toISOString() })
        .eq('id', d.id);
      if (!error) results.docs_backfilled++;
    }));
    if (i + BATCH_SIZE < (docsToFix ?? []).length) await new Promise(r => setTimeout(r, 200));
  }

  const duration = Math.round((Date.now() - startTime) / 1000);
  return new Response(JSON.stringify({
    success: true, version: 32, duration_seconds: duration, results
  }), { headers: { 'Content-Type': 'application/json' } });
});
