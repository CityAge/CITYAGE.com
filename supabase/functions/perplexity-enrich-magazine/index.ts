import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// perplexity-enrich-magazine v1
// Sits between triage (Sonnet) and writing (Opus).
// Takes the 3 stories Sonnet selected and deeply researches each one
// via Perplexity Sonar, adding facts, quotes, context, and source URLs
// that the RSS feed didn't have. Opus then writes from enriched data.
//
// Flow: rss-fetch-magazine → write-magazine-triage → THIS → write-magazine-opus
//
// Usage: curl -X POST .../perplexity-enrich-magazine -d '{}'
// It auto-finds the latest magazine_ready draft and enriches it.

const FUNCTION_VERSION = 'perplexity-enrich-magazine-v1';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const PERPLEXITY_API_KEY = Deno.env.get('PERPLEXITY_API_KEY') || Deno.env.get('PPLX_API_KEY') || '';
const PERPLEXITY_TIMEOUT_MS = 30_000;

async function perplexitySearch(query: string): Promise<{text: string, sources: Array<{title: string, url: string}>}> {
  if (!PERPLEXITY_API_KEY) return { text: '', sources: [] };
  try {
    const resp = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant for CityAge, a global intelligence magazine covering cities, infrastructure, defence, energy, space, and urban leadership. Provide factual, specific, well-sourced research. Include exact numbers, dates, dollar amounts, names with full titles, and direct quotes where available. Focus on facts that connect to how cities work — infrastructure, investment, governance, innovation.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 1500,
        return_citations: true
      }),
      signal: AbortSignal.timeout(PERPLEXITY_TIMEOUT_MS)
    });

    if (!resp.ok) {
      const errText = await resp.text().catch(() => 'unknown');
      console.error(`[${FUNCTION_VERSION}] Perplexity ${resp.status}: ${errText.slice(0, 200)}`);
      return { text: '', sources: [] };
    }

    const data = await resp.json();
    const text = data.choices?.[0]?.message?.content || '';
    
    // Extract citations if available
    const citations = data.citations || [];
    const sources = citations.map((c: any) => ({
      title: c.title || c.url || '',
      url: c.url || ''
    })).filter((s: any) => s.url && !s.url.includes('perplexity'));

    return { text, sources };
  } catch (err) {
    console.error(`[${FUNCTION_VERSION}] Perplexity error:`, (err as Error).message);
    return { text: '', sources: [] };
  }
}

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    console.log(`[${FUNCTION_VERSION}] Starting`);

    // Find the latest magazine_ready draft
    const { data: draft, error: draftErr } = await supabase
      .from('brief_drafts')
      .select('*')
      .eq('vertical', 'CityAge Magazine')
      .eq('status', 'magazine_ready')
      .order('created_at', { ascending: false })
      .limit(1).single();

    if (draftErr || !draft) {
      return new Response(JSON.stringify({
        success: false, error: 'No magazine_ready draft found. Run write-magazine-triage first.'
      }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    console.log(`[${FUNCTION_VERSION}] Enriching draft: ${draft.id}`);

    const triageData = draft.editorial_json as any;
    const articles = triageData?.articles || [];

    if (articles.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'No articles in triage' }), { status: 404 });
    }

    const enriched: any[] = [];

    for (const article of articles) {
      console.log(`[${FUNCTION_VERSION}] Researching: ${article.headline}`);

      // Build a research query from the triage data
      const factsContext = (article.key_facts || []).join('. ');
      const peopleContext = (article.key_people || []).join(', ');
      
      const researchQuery = `Research this story for a global intelligence magazine focused on cities and infrastructure:\n\nHEADLINE: ${article.headline}\nDECK: ${article.deck || ''}\nWHAT HAPPENED: ${article.what_happened || ''}\nKEY FACTS SO FAR: ${factsContext}\nKEY PEOPLE: ${peopleContext}\n\nI need:\n1. Additional specific facts, numbers, dates, and dollar amounts not in the above\n2. Direct quotes from named officials, executives, or experts\n3. Historical context — what led to this, what happened before\n4. The urban/city angle — how does this affect infrastructure, investment, housing, transport, energy in cities\n5. What other cities or countries are doing about this\n6. Forward-looking implications — what happens next\n\nBe specific. Use full names and titles. Include exact figures. Do not generalize.`;

      const { text: researchText, sources: researchSources } = await perplexitySearch(researchQuery);

      // Merge Perplexity research into the article plan
      const enrichedArticle = {
        ...article,
        perplexity_research: researchText || null,
        perplexity_sources: researchSources || [],
        // Merge new sources with existing ones (deduped by URL)
        sources: [
          ...(article.sources || []),
          ...researchSources.filter((ps: any) => 
            !(article.sources || []).some((es: any) => es.url === ps.url)
          )
        ]
      };

      enriched.push(enrichedArticle);
      console.log(`[${FUNCTION_VERSION}] Enriched: ${article.headline} (+${researchText.length} chars, +${researchSources.length} sources)`);

      // Polite pause between queries
      await new Promise(r => setTimeout(r, 500));
    }

    // Update the draft with enriched data
    const enrichedJson = {
      ...triageData,
      articles: enriched,
      enrichment: {
        function: FUNCTION_VERSION,
        enriched_at: new Date().toISOString(),
        articles_enriched: enriched.length
      }
    };

    const { error: updateErr } = await supabase
      .from('brief_drafts')
      .update({ editorial_json: enrichedJson })
      .eq('id', draft.id);

    if (updateErr) throw new Error(`Update draft: ${updateErr.message}`);

    console.log(`[${FUNCTION_VERSION}] Done — ${enriched.length} articles enriched`);

    return new Response(JSON.stringify({
      success: true,
      draft_id: draft.id,
      articles_enriched: enriched.length,
      research_added: enriched.map(a => ({
        headline: a.headline,
        perplexity_chars: a.perplexity_research?.length || 0,
        new_sources: a.perplexity_sources?.length || 0
      })),
      function_version: FUNCTION_VERSION
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error(`[${FUNCTION_VERSION}] Error:`, err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
