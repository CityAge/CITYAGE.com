import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// perplexity-search v29 — Canada Europe Connects
// FIX: Citation URLs now stored in full_text as inline markdown links
// Perplexity's [1][2] references replaced with actual [source](url) links

const VERTICAL = 'Canada Europe Connects';
const BATCH_SIZE = 8;
const BATCH_DELAY_MS = 500;

Deno.serve(async (req: Request) => {
  const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY') ?? '';
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const apiKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && apiKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 29, vertical: VERTICAL }), { headers: { 'Content-Type': 'application/json' } });
  if (!PERPLEXITY_API_KEY) return new Response(JSON.stringify({ error: 'PERPLEXITY_API_KEY not set' }), { status: 500 });

  const startTime = Date.now();
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
  const results = { queried: 0, inserted: 0, skipped: 0, errors: [] as string[], layers: { live: 0, context: 0, historical: 0, editor: 0 }, editor_queries_generated: 0 };

  const { data: dailyInstructions } = await supabase
    .from('daily_instructions').select('instruction')
    .eq('active_date', todayDate).order('created_at', { ascending: true });
  const editorQuestion = dailyInstructions?.length ? dailyInstructions.map((d: any) => d.instruction).join(' ') : null;

  const LAYER1_LIVE = [
    'Canada NATO defence announcement today',
    'European defence procurement contract news today',
    'Canada Arctic military NORAD announcement today',
    'Canada Europe hydrogen critical minerals deal news today',
    'EU carbon border adjustment Canada energy news today',
    'Canada Europe CETA trade agreement news today',
    'Canadian federal government trade policy announcement today',
    'Canada Europe AI technology partnership announcement today',
  ];

  const LAYER2_CONTEXT = [
    'Canada SAFE European Defence Fund procurement developments this week',
    'Ukraine war implications NATO Canada defence policy this week',
    'Canada critical minerals supply chain Europe developments this week',
    'Canada Europe clean energy hydrogen LNG partnership this month',
    'EU derisking supply chain diversification Canada this week',
    'Canada Europe trade investment bilateral developments this week',
    'Canada Europe dual-use technology AI governance developments this week',
    'European investment Canada infrastructure pension fund news this month',
  ];

  const LAYER3_HISTORICAL = [
    'History Canada Europe transatlantic economic relationship evolution decades',
    'Canada NATO defence spending commitments delivery gap historical pattern',
    'Canada critical minerals energy exports Europe historical trade flows',
    'CETA Canada EU trade agreement implementation history results',
  ];

  const systemPrompts: Record<string, string> = {
    live: 'You are an intelligence analyst monitoring the Canada-Europe transatlantic corridor — covering defence, energy, critical minerals, trade, technology, AI, and capital flows. Focus on breaking news and developments from the last 24 hours only. Be precise about timing, names, and dollar amounts.',
    context: 'You are an intelligence analyst monitoring the Canada-Europe transatlantic corridor — covering defence, energy, critical minerals, trade, technology, AI, and capital flows. Focus on developments from the past week. Identify what is building, shifting, or accelerating.',
    historical: 'You are an intelligence analyst monitoring the Canada-Europe transatlantic corridor. Provide historical context spanning a decade or more. What patterns, precedents, or long-term dynamics are relevant?',
    editor: 'You are an intelligence analyst monitoring the Canada-Europe transatlantic corridor. Answer with maximum precision and depth, drawing on both current news and historical context.'
  };

  const scores: Record<string, number> = { live: 9, context: 7, historical: 6, editor: 10 };
  const labels: Record<string, string> = { live: '[LIVE]', context: '[CONTEXT]', historical: '[HISTORICAL]', editor: '[EDITOR]' };

  function inlineCitations(content: string, citations: string[]): string {
    if (!citations || citations.length === 0) return content;
    let result = content;
    for (let i = 0; i < citations.length; i++) {
      const marker = `[${i + 1}]`;
      const url = citations[i];
      if (url && result.includes(marker)) {
        let replaced = false;
        result = result.replace(new RegExp(`\\[${i + 1}\\]`, 'g'), () => {
          if (!replaced) { replaced = true; return `([source](${url}))`; }
          return '';
        });
      }
    }
    result = result.replace(/\[\d+\]/g, '');
    return result.trim();
  }

  async function runQuery(queryText: string, layer: string): Promise<void> {
    try {
      const resp = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${PERPLEXITY_API_KEY}` },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'system', content: systemPrompts[layer] }, { role: 'user', content: queryText }],
          max_tokens: 600, return_citations: true
        })
      });
      if (!resp.ok) { results.errors.push(`[${layer}] "${queryText.slice(0, 40)}": HTTP ${resp.status}`); return; }
      const data = await resp.json();
      const rawContent = data.choices?.[0]?.message?.content ?? '';
      const citations: string[] = data.citations ?? [];
      if (!rawContent) return;
      results.queried++;
      (results.layers as any)[layer]++;

      const enrichedContent = inlineCitations(rawContent, citations);
      const sourcesBlock = citations.length > 0
        ? `\n\nSOURCES:\n${citations.map((url: string, i: number) => `[${i + 1}] ${url}`).join('\n')}`
        : '';
      const realUrl = citations.length > 0 ? citations[0] : `perplexity://${layer}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      const { error: insertErr } = await supabase.from('rss_articles').insert({
        source_id: null, source_name: 'Perplexity Intelligence', vertical: VERTICAL,
        category: layer, title: `${labels[layer]} ${queryText.slice(0, 100)}`,
        url: realUrl,
        published_at: new Date().toISOString(),
        raw_summary: enrichedContent,
        full_text: enrichedContent + sourcesBlock,
        is_synopsized: true, is_relevant: true, relevance_score: scores[layer],
        notes: `Query: ${queryText}\n\n${enrichedContent}${sourcesBlock}`
      });
      if (insertErr) { if (insertErr.code === '23505') results.skipped++; else results.errors.push(`Insert: ${insertErr.message}`); }
      else results.inserted++;
    } catch (err) { results.errors.push(`[${layer}] error: ${(err as Error).message}`); }
  }

  async function runBatched(queries: string[], layer: string) {
    for (let i = 0; i < queries.length; i += BATCH_SIZE) {
      const batch = queries.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(q => runQuery(q, layer)));
      if (i + BATCH_SIZE < queries.length) await new Promise(r => setTimeout(r, BATCH_DELAY_MS));
    }
  }

  let editorQueries: string[] = [];
  if (editorQuestion && ANTHROPIC_API_KEY) {
    try {
      const haikuResp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001', max_tokens: 400,
          messages: [{ role: 'user', content: `Editor question: "${editorQuestion}"\nGenerate 5 search queries for the Canada-Europe transatlantic corridor (defence, energy, trade, tech, capital). 2 live (today), 2 context (this week), 1 historical.\nJSON only: {"queries":[{"query":"...","layer":"live"},...]}` }]
        })
      });
      if (haikuResp.ok) {
        const hd = await haikuResp.json();
        const parsed = JSON.parse((hd.content?.[0]?.text ?? '{}').replace(/```json|```/g, '').trim());
        editorQueries = (parsed.queries ?? []).map((q: any) => q.query);
        results.editor_queries_generated = editorQueries.length;
      }
    } catch (_) {}
  }

  const { data: dbQueries } = await supabase.from('perplexity_queries')
    .select('id, query').eq('vertical', VERTICAL).eq('is_active', true);
  const dbQueryTexts = (dbQueries ?? []).map((q: any) => q.query);

  await runBatched(LAYER1_LIVE, 'live');
  await runBatched(LAYER2_CONTEXT, 'context');
  await runBatched(LAYER3_HISTORICAL, 'historical');
  if (dbQueryTexts.length) {
    await runBatched(dbQueryTexts, 'context');
    await Promise.all((dbQueries ?? []).map((q: any) =>
      supabase.from('perplexity_queries').update({ last_run_at: new Date().toISOString() }).eq('id', q.id)
    ));
  }
  if (editorQueries.length) await runBatched(editorQueries, 'editor');

  const duration = Math.round((Date.now() - startTime) / 1000);

  await supabase.from('pipeline_runs').insert({
    job_name: 'perplexity-search', stage: 'perplexity_search', run_date: todayDate,
    status: results.errors.length > 3 ? 'warn' : 'success',
    articles_fetched: results.queried, articles_inserted: results.inserted, articles_skipped: results.skipped,
    notes: `v29 citation-fix. Live:${results.layers.live} Context:${results.layers.context} Historical:${results.layers.historical} Editor:${results.layers.editor} Time:${duration}s Err:${results.errors.length}`,
    started_at: new Date(startTime).toISOString(), completed_at: new Date().toISOString(), duration_seconds: duration
  });

  return new Response(JSON.stringify({ success: true, version: 29, vertical: VERTICAL, duration_seconds: duration, results }), { headers: { 'Content-Type': 'application/json' } });
});
