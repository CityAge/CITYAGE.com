import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// write-brief-boutique v2
// Boutique Hotel Intelligence — The Influence Letter
// Dateline: Holbox Island | Voice: Graydon Carter meets Bill Ackman
// Weekly cadence (Sunday) | Sonnet analysis + Opus 4.6
// Signature elements: "The Opportunity" + "The Move"

const VERTICAL = 'Boutique Hotel Intelligence';
const JOB_NAME = 'write-brief-boutique';

Deno.serve(async (req: Request) => {
  const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const apiKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && apiKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  if (!ANTHROPIC_API_KEY) return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }), { status: 500 });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 2, vertical: VERTICAL, cadence: 'weekly-sunday' }), { headers: { 'Content-Type': 'application/json' } });

  const holboxTime = new Date().toLocaleString('en-CA', { timeZone: 'America/Cancun', hour: '2-digit', minute: '2-digit', hour12: true }).replace(/\./g, '').toUpperCase();
  const dateline = `${holboxTime} Holbox Island`;
  const today = new Date().toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Toronto' });
  const todayDate = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: articles } = await supabase.from('rss_articles')
    .select('title, notes, raw_summary, source_name, url, relevance_score, published_at, category')
    .gte('published_at', cutoff).eq('is_relevant', true).eq('vertical', VERTICAL)
    .neq('source_name', 'Perplexity Boutique Search')
    .order('relevance_score', { ascending: false }).limit(40);

  const { data: perplexityResults } = await supabase.from('rss_articles')
    .select('title, notes, url, published_at, category')
    .eq('source_name', 'Perplexity Boutique Search').eq('vertical', VERTICAL)
    .gte('published_at', cutoff).order('published_at', { ascending: false }).limit(20);

  if (!articles?.length && !perplexityResults?.length) {
    return new Response(JSON.stringify({ error: 'No articles in last 7 days' }), { status: 404 });
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Toronto' });
  }

  const articleContext = (articles ?? []).map((a, i) => `[${i+1}] "${a.title}"\n  Published: ${formatDate(a.published_at)}\n  Source: ${a.source_name} (${a.category})\n  URL: ${a.url ?? 'N/A'}\n  Relevance: ${a.relevance_score}/10\n  Summary: ${a.notes ?? a.raw_summary ?? 'No summary'}`).join('\n\n');
  const perplexityContext = (perplexityResults ?? []).map((p, i) => `[P${i+1}] "${p.title}"\n  Published: ${formatDate(p.published_at)}\n  URL: ${p.url ?? 'N/A'}\n  Intelligence: ${p.notes ?? ''}`).join('\n\n');

  const editorialThesis = `THE PUBLICATION THESIS:\nBoutique Hotel Intelligence is for investors and family offices who see luxury hospitality as both an asset class and a statement of values. Focus: trends and investments in boutique hotels globally, sharp lens on Mexico's high-end real estate.\n\nFive beats:\n1. HOLBOX & YUCATAN: Development, environmental permits, land rights, infrastructure, Quintana Roo/Yum Balam reserve\n2. BOUTIQUE HOSPITALITY: Global deals, acquisitions, brand launches, Mexico high-end real estate\n3. FAMILY OFFICE CAPITAL: India, Middle East, Europe, Americas deploying capital in hospitality\n4. IMPACT & CONSERVATION: Ecotourism, whale sharks, turtle nesting, mangroves, carbon credits, biodiversity finance\n5. MENA & INDIA CAPITAL: Gulf sovereign wealth, UAE/Saudi hotel groups, Indian HNW families expanding into LatAm/Caribbean\n\nEvery story must pass TWO filters:\nFILTER 1 — Does this matter to an investor considering boutique hospitality or high-end Mexican real estate?\nFILTER 2 — Does this name a person, company, dollar amount, or regulatory shift?`;

  const sonnetPrompt = `You are the senior editor of Boutique Hotel Intelligence. Today is ${today}. WEEKLY edition — synthesize 7 days.\n\n${editorialThesis}\n\nFor each story passing both filters:\nHEADLINE | BEAT | WHAT | THE OPPORTUNITY | THE MOVE | SOURCES\nAlso: THE THREAD connecting stories. Max 6 stories. Holbox leads when present.\n\nRSS ARTICLES:\n${articleContext}\n\nPERPLEXITY:\n${perplexityContext}`;

  const sonnetResp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-sonnet-4-5', max_tokens: 2000, messages: [{ role: 'user', content: sonnetPrompt }] })
  });
  if (!sonnetResp.ok) return new Response(JSON.stringify({ error: `Sonnet error: ${await sonnetResp.text()}` }), { status: 500 });
  const editorialNote = (await sonnetResp.json()).content?.[0]?.text ?? '';

  const opusPrompt = `You are the writer of Boutique Hotel Intelligence — an Influence Letter publication. Today is ${today}. Weekly edition.\n\n${editorialThesis}\n\nVOICE: Graydon Carter meets Bill Ackman. Cultural sophistication of Vanity Fair's golden era + analytical edge of an activist investor. Confident, cultured, precise. Opinionated. Dollar amounts, cap rates, timelines, names. Mexico is a market you understand deeply.\n\nBANNED: major, significant, key, robust, comprehensive, cutting-edge, groundbreaking, leverage, stakeholders, "it is worth noting", "nestled", "tucked away", "hidden gem"\n\nSTRUCTURE:\n# Boutique Hotel Intelligence\n## The Influence Letter\n${dateline} · ${today}\n*[One-line tagline]*\n\n---\nTHE WEEK [3-4 sentences]\n---\n### [Headline] [2-3 sentences] **The Opportunity:** **The Move:** [Sources]\n---\n[4-6 stories]\n---\n### Worth Watching [2-3 sentences]\n---\n*Boutique Hotel Intelligence — The Influence Letter. Hospitality. Capital. Conservation. Impact. Weekly from Holbox Island.*\n\nTARGET: 1,000-1,500 words. Every story needs The Opportunity + The Move. Hyperlink sources.\n\nEDITORIAL NOTE:\n${editorialNote}\n\nWrite the weekly brief now.`;

  const opusResp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: 'claude-opus-4-6', max_tokens: 3500, messages: [{ role: 'user', content: opusPrompt }] })
  });
  if (!opusResp.ok) return new Response(JSON.stringify({ error: `Opus error: ${await opusResp.text()}` }), { status: 500 });
  const brief = (await opusResp.json()).content?.[0]?.text ?? '';

  const { data: savedBrief, error: saveErr } = await supabase.from('briefs')
    .insert({ vertical: VERTICAL, title: `Boutique Hotel Intelligence — Weekly — ${today}`, body: brief, model_used: 'claude-opus-4-6', status: 'draft', published_at: new Date().toISOString() })
    .select('id').single();

  await supabase.from('pipeline_runs').insert({ job_name: JOB_NAME, stage: 'write_brief', run_date: todayDate, status: saveErr ? 'warn' : 'success', articles_fetched: (articles?.length ?? 0) + (perplexityResults?.length ?? 0), notes: `v2 Boutique Weekly. Articles: ${articles?.length ?? 0}, Perplexity: ${perplexityResults?.length ?? 0}`, started_at: new Date().toISOString(), completed_at: new Date().toISOString() });

  return new Response(JSON.stringify({ success: true, vertical: VERTICAL, brief_id: savedBrief?.id, brief, version: 'v2', articles_used: (articles?.length ?? 0) + (perplexityResults?.length ?? 0) }), { headers: { 'Content-Type': 'application/json' } });
});
