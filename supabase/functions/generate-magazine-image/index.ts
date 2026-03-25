import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// generate-magazine-image v3
// Now with smarter cartoon/line_drawing triggers.
// Cartoons for: Culture, irony, commentary, lighter stories.
// Line drawings for: technical, infrastructure, engineering stories.

const FUNCTION_VERSION = 'generate-magazine-image-v3';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const DALLE_MODEL = 'dall-e-3';
const IMAGE_SIZE = '1792x1024';
const IMAGE_QUALITY = 'hd';
const STORAGE_BUCKET = 'magazine-images';

const STYLE_LIBRARY: Record<string, string> = {
  'photojournalism': `Shot on Canon EOS R5, 24-70mm f/2.8 lens. Photojournalistic editorial photograph. Raw, real, unposed. Dramatic natural lighting — golden hour, overcast sky, or harsh midday shadows. Strong foreground subject with contextual background. Shallow depth of field on key element. Grain visible. The kind of image that wins a World Press Photo award. Colour grading: muted warm tones with deep shadows.`,

  'aerial': `Aerial drone photograph, shot at 400 feet altitude. DJI Mavic 3 Pro quality. Looking straight down or at 45-degree angle. Sharp detail across the entire frame. Shows the geometry and pattern of urban infrastructure — roads, ports, terminals, construction sites, city grids. Golden hour or blue hour lighting casting long shadows. The kind of image National Geographic would use for a cities feature. Rich saturated colour.`,

  'architectural': `Architectural photography, shot on Hasselblad medium format. Precise geometry, converging lines, dramatic perspective. Interior or exterior of a significant building or urban space. Natural light streaming through glass, concrete, steel. Think Iwan Baan or Hélène Binet. Monocle magazine aesthetic — clean, modern, warm. People as distant anonymous figures giving scale, never identifiable.`,

  'industrial': `Industrial editorial photograph. Shot on Sony A7R V, 35mm prime lens. A factory floor, an energy plant, a shipyard, a military facility, a data centre. Dramatic scale — huge machinery, long corridors, massive structures with a single human figure for scale (silhouetted, anonymous). Strong directional lighting creating geometric shadows. Teal and orange colour palette. Think Bloomberg Businessweek cover photography.`,

  'landscape': `National Geographic-quality landscape photograph. Shot on Phase One IQ4 150MP, 80mm lens. Epic scale — a coastline, a glacier, a desert city, a mountain range with infrastructure. Dramatic sky occupying the top third. Perfect golden hour or storm light. Hyper-detailed. Colour palette: earth tones with one accent colour from the sky. Ansel Adams meets Steve McCurry.`,

  'street': `Street photography, shot on Leica Q3, 28mm fixed lens. A real moment on a real street in a real city. Market stalls, café terraces, transit stations, bicycle lanes, food vendors. Warm natural light. People appear naturally but are never identifiable — shot from behind, in silhouette, blurred in motion, or at distance. Vivid colours. Henri Cartier-Bresson decisive moment aesthetic. Think Monocle travel feature.`,

  'satellite': `Satellite or space station photograph of Earth. NASA/ESA quality. Shows city lights at night, or a coastal megacity from orbit, or cloud patterns over infrastructure. Deep blacks of space contrasting with the thin blue atmosphere line. Hyper-real detail. No text or labels. The overview effect — seeing Earth's cities as luminous circuits on a dark planet.`,

  'cartoon': `New Yorker magazine style editorial cartoon illustration. Clean ink line drawing with watercolour wash. Witty, observational, slightly satirical. One clear visual gag or commentary on the headline topic. Minimal background — just enough context. Characters are generic/anonymous types (a businessperson, a mayor, an engineer) never depicting real identifiable people. Sophisticated humour. Signed with a small illegible squiggle in the corner. Muted colour palette — cream, grey, one accent colour. Think Roz Chast or David Sipress. The drawing should feel hand-drawn on paper, not digital.`,

  'line_drawing': `Elegant technical line drawing illustration. Fine black ink on white/cream paper. Architectural rendering or engineering diagram style. Cross-sections, cutaways, exploded views, or bird's-eye axonometric projections of infrastructure, buildings, or technology. Think the technical illustrations in The Economist or Scientific American. Precise, informative, beautiful. No colour — pure black line work with occasional grey hatching for shadow. The kind of drawing an architect would frame.`,

  'cinematic': `Cinematic widescreen photograph, 2.39:1 aspect feel. Shot on ARRI Alexa sensor quality. Dramatic colour grading — teal shadows, warm highlights. A single powerful composition: a city skyline at dusk, a container port at dawn, an airport terminal at night, a bridge under construction. Lens flare from a low sun. Anamorphic bokeh in the background. The kind of image you'd see as an establishing shot in a Nolan film.`
};

function pickStyle(vertical: string, subVertical: string, headline: string): string {
  const h = headline.toLowerCase();
  const sub = (subVertical || '').toLowerCase();

  const cartoonWords = ['nobody is talking', 'quietly', 'irony', 'absurd', 'bizarre', 'weird', 
    'surprising', 'unexpected', 'renaissance', 'tiny', 'secret', 'hidden', 'bet ',
    'race to', 'scramble', 'rush to', 'obsess', 'craze', 'trend', 'fad'];
  if (cartoonWords.some(w => h.includes(w))) {
    return Math.random() < 0.6 ? 'cartoon' : 'street';
  }

  const lineDrawWords = ['how ', 'built like', 'blueprint', 'engineering', 'underground',
    'cross-section', 'anatomy', 'pipeline', 'network', 'grid', 'system'];
  if (lineDrawWords.some(w => h.includes(w))) {
    return Math.random() < 0.5 ? 'line_drawing' : 'architectural';
  }

  if (h.includes('space') || h.includes('satellite') || h.includes('orbital') || h.includes('nasa') || h.includes('rocket')) return 'satellite';
  if (h.includes('factory') || h.includes('manufactur') || h.includes('3d-print') || h.includes('missile') || h.includes('defence') || h.includes('defense')) return 'industrial';
  if (h.includes('aerial') || h.includes('port') || h.includes('terminal') || h.includes('airport') || h.includes('highway')) return 'aerial';
  if (h.includes('climate') || h.includes('ocean') || h.includes('glacier') || h.includes('coast') || h.includes('flood')) return 'landscape';
  if (h.includes('restaurant') || h.includes('food') || h.includes('chef') || h.includes('fashion') || h.includes('design') || h.includes('market')) return 'street';

  const rand = Math.random();
  switch (vertical) {
    case 'Power':
      return rand < 0.4 ? 'photojournalism' : rand < 0.7 ? 'cinematic' : rand < 0.85 ? 'aerial' : 'cartoon';
    case 'Money':
      return rand < 0.3 ? 'aerial' : rand < 0.55 ? 'architectural' : rand < 0.75 ? 'cinematic' : rand < 0.9 ? 'line_drawing' : 'cartoon';
    case 'Cities':
      return rand < 0.25 ? 'architectural' : rand < 0.45 ? 'street' : rand < 0.6 ? 'aerial' : rand < 0.75 ? 'cinematic' : rand < 0.9 ? 'line_drawing' : 'cartoon';
    case 'Frontiers':
      return rand < 0.3 ? 'industrial' : rand < 0.55 ? 'satellite' : rand < 0.7 ? 'cinematic' : rand < 0.85 ? 'line_drawing' : 'cartoon';
    case 'Culture':
      return rand < 0.3 ? 'street' : rand < 0.5 ? 'cartoon' : rand < 0.7 ? 'architectural' : rand < 0.85 ? 'line_drawing' : 'cinematic';
    default:
      return 'cinematic';
  }
}

function buildDallePrompt(headline: string, deck: string, vertical: string, subVertical: string, style: string): string {
  const styleGuide = STYLE_LIBRARY[style] || STYLE_LIBRARY['cinematic'];

  return `${styleGuide}\n\nSUBJECT: Create an image for this magazine article:\nHEADLINE: ${headline}\nCONTEXT: ${deck}\nSECTION: ${vertical} / ${subVertical || 'General'}\n\nCRITICAL RULES:\n- Do NOT include any text, words, letters, numbers, watermarks, logos, or captions anywhere in the image\n- Do NOT depict any real, named, or identifiable people, politicians, or public figures\n- No readable text on signs, buildings, vehicles, or clothing\n- The image must work as a full-bleed magazine header\n- Professional quality suitable for a premium global intelligence magazine\n- MAKE IT VISUALLY DISTINCTIVE — not generic stock photography`;
}

serve(async (req) => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  try {
    const reqBody = await req.json().catch(() => ({}));
    const articleId = reqBody.article_id || null;
    const forceStyle = reqBody.style || null;
    const limit = reqBody.limit || 3;
    const regenerate = reqBody.regenerate || false;

    console.log(`[${FUNCTION_VERSION}] Starting | article_id: ${articleId || 'auto'} | style: ${forceStyle || 'auto'} | limit: ${limit}`);

    let query = supabase.from('magazine')
      .select('id, headline, deck, vertical, sub_vertical, tags')
      .in('status', ['published', 'draft', 'review']);

    if (!regenerate) {
      query = query.is('image_url', null);
    }
    if (articleId) {
      query = query.eq('id', articleId);
    }

    const { data: articles, error: artErr } = await query
      .order('published_at', { ascending: false })
      .limit(limit);

    if (artErr) throw new Error(`Query: ${artErr.message}`);
    if (!articles?.length) {
      return new Response(JSON.stringify({ success: true, message: 'No articles need images' }),
        { headers: { 'Content-Type': 'application/json' } });
    }

    console.log(`[${FUNCTION_VERSION}] Generating ${articles.length} images`);
    const results: any[] = [];

    for (const article of articles) {
      try {
        const style = forceStyle || pickStyle(article.vertical, article.sub_vertical || '', article.headline);
        console.log(`[${FUNCTION_VERSION}] ${article.headline} -> style: ${style}`);

        const dallePrompt = buildDallePrompt(
          article.headline, article.deck || '', article.vertical, article.sub_vertical || '', style
        );

        const dalleRes = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
          body: JSON.stringify({ model: DALLE_MODEL, prompt: dallePrompt, n: 1, size: IMAGE_SIZE, quality: IMAGE_QUALITY, response_format: 'b64_json' })
        });

        if (!dalleRes.ok) {
          const errText = await dalleRes.text();
          console.error(`[${FUNCTION_VERSION}] DALL-E ${dalleRes.status}: ${errText.slice(0, 200)}`);
          results.push({ id: article.id, headline: article.headline, style, error: `DALL-E ${dalleRes.status}` });
          continue;
        }

        const dalleData = await dalleRes.json();
        const b64Image = dalleData.data?.[0]?.b64_json;
        const revisedPrompt = dalleData.data?.[0]?.revised_prompt || '';
        if (!b64Image) { results.push({ id: article.id, error: 'No image data' }); continue; }

        const binaryStr = atob(b64Image);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

        const fileName = `${article.id}_${style}.png`;
        const { error: uploadErr } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(fileName, bytes, { contentType: 'image/png', upsert: true });

        if (uploadErr) { results.push({ id: article.id, error: `Upload: ${uploadErr.message}` }); continue; }

        const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(fileName);
        const imageUrl = urlData.publicUrl;

        await supabase.from('magazine').update({ image_url: imageUrl }).eq('id', article.id);

        results.push({
          id: article.id, headline: article.headline, vertical: article.vertical,
          style, image_url: imageUrl, revised_prompt: revisedPrompt.slice(0, 200)
        });

        console.log(`[${FUNCTION_VERSION}] Done: ${article.headline} [${style}] -> ${imageUrl}`);
        await new Promise(r => setTimeout(r, 1500));

      } catch (e) {
        console.error(`[${FUNCTION_VERSION}] Error:`, e);
        results.push({ id: article.id, headline: article.headline, error: String(e) });
      }
    }

    return new Response(JSON.stringify({
      success: true, images_generated: results.filter(r => r.image_url).length,
      results, available_styles: Object.keys(STYLE_LIBRARY), function_version: FUNCTION_VERSION
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error(`[${FUNCTION_VERSION}] Error:`, err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
