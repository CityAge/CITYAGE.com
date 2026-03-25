import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// generate-custom-illustration
// One-off illustration generator with a fully custom DALL-E prompt.
// Used for masthead illustrations, spot art, and brand assets.

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const STORAGE_BUCKET = 'magazine-images';

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    const { prompt, filename, size } = await req.json();
    if (!prompt || !filename) throw new Error('Need prompt and filename');

    console.log(`Generating: ${filename}`);

    const dalleRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: size || '1024x1024',
        quality: 'hd',
        response_format: 'b64_json'
      })
    });

    if (!dalleRes.ok) {
      const errText = await dalleRes.text();
      throw new Error(`DALL-E ${dalleRes.status}: ${errText.slice(0, 300)}`);
    }

    const dalleData = await dalleRes.json();
    const b64Image = dalleData.data?.[0]?.b64_json;
    const revisedPrompt = dalleData.data?.[0]?.revised_prompt || '';
    if (!b64Image) throw new Error('No image data');

    const binaryStr = atob(b64Image);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

    const { error: uploadErr } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, bytes, { contentType: 'image/png', upsert: true });

    if (uploadErr) throw new Error(`Upload: ${uploadErr.message}`);

    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);

    return new Response(JSON.stringify({
      success: true,
      image_url: urlData.publicUrl,
      revised_prompt: revisedPrompt.slice(0, 300)
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
