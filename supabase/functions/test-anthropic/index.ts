import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req: Request) => {
  const anthropicKey = req.headers.get('x-anthropic-key') ?? '';
  if (!anthropicKey) {
    return new Response(JSON.stringify({ error: 'No key provided. Pass x-anthropic-key header.' }), { status: 400 });
  }
  const envCheck = {
    ANTHROPIC_API_KEY: Deno.env.get('ANTHROPIC_API_KEY') ? 'SET(' + (Deno.env.get('ANTHROPIC_API_KEY') ?? '').slice(0,10) + '...)' : 'MISSING',
    SYNC_API_KEY: Deno.env.get('SYNC_API_KEY') ? 'SET(' + (Deno.env.get('SYNC_API_KEY') ?? '').slice(0,6) + '...)' : 'MISSING',
    SUPABASE_URL: Deno.env.get('SUPABASE_URL') ? 'SET' : 'MISSING',
  };
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 50, messages: [{ role: 'user', content: 'Say: KEY WORKS' }] })
    });
    const data = await resp.json();
    return new Response(JSON.stringify({ api_status: resp.status, api_ok: resp.ok, response: data.content?.[0]?.text ?? data, env_vars: envCheck }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message, env_vars: envCheck }), { status: 500 });
  }
});
