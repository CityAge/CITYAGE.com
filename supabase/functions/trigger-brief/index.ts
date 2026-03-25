import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const body = await req.json().catch(() => ({}));
  const target = body.function || "write-brief-gmwv";
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const syncKey = Deno.env.get("SYNC_API_KEY") || "cecMay26";

  fetch(`${supabaseUrl}/functions/v1/${target}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${serviceKey}`,
      "x-sync-key": syncKey
    },
    body: JSON.stringify(body.payload || {})
  }).catch(e => console.error("trigger error:", e));

  return new Response(JSON.stringify({ fired: true, function: target }), {
    headers: { "Content-Type": "application/json" }
  });
});
