// invoke-test v1
// Calls write-brief-gmwv with test_mode:true and returns the brief body directly

Deno.serve(async (req: Request) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const SYNC_KEY = Deno.env.get('SYNC_API_KEY') || 'cecMay26';
  const body = await req.json().catch(() => ({}));

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/write-brief-gmwv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-sync-key': SYNC_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` },
      body: JSON.stringify({ test_mode: true, editor_note: body.editor_note || null })
    });
    const result = await res.json();
    if (!result.success) return new Response(JSON.stringify({ error: result.error }), { status: 500 });

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const { data: brief } = await supabase.from('brief_tests').select('id, title, body, opus_tokens, bullets_selected, rss_articles, perplexity_items, created_at').eq('id', result.brief_id).single();

    return new Response(JSON.stringify({ success: true, brief_id: result.brief_id, opus_tokens: result.opus_tokens, stats: result.stats, brief }, null, 2), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) { return new Response(JSON.stringify({ error: String(err) }), { status: 500 }); }
});
