import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Tests multiple Gemini embedding models to find what works
Deno.serve(async (req: Request) => {
  const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY') || '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';

  const apiKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && apiKey !== SYNC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const testText = 'Canada Europe defence procurement';

  const models = [
    { name: 'embedding-001', url: `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GOOGLE_API_KEY}` },
    { name: 'text-embedding-004', url: `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${GOOGLE_API_KEY}` },
    { name: 'gemini-embedding-exp-03-07', url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-exp-03-07:embedContent?key=${GOOGLE_API_KEY}` },
  ];

  const results: any[] = [];

  for (const model of models) {
    try {
      const resp = await fetch(model.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: `models/${model.name}`,
          content: { parts: [{ text: testText }] }
        })
      });
      const text = await resp.text();
      let parsed: any = {};
      try { parsed = JSON.parse(text); } catch {}
      const dims = parsed?.embedding?.values?.length ?? 0;
      results.push({
        model: model.name,
        status: resp.status,
        ok: resp.ok,
        dimensions: dims,
        works: dims > 0,
        error: parsed?.error?.message ?? null
      });
    } catch (e) {
      results.push({ model: model.name, error: String(e), works: false });
    }
  }

  const working = results.filter(r => r.works);

  return new Response(JSON.stringify({
    google_key_length: GOOGLE_API_KEY.length,
    working_models: working,
    all_results: results
  }), { headers: { 'Content-Type': 'application/json' } });
});
