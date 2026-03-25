import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// v5 — OpenAI embeddings (text-embedding-3-small, 1536 dims)
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

  const keyStatus = { openai_key_set: OPENAI_API_KEY.length > 0, sync_key_set: SYNC_API_KEY.length > 0 };
  const contentType = req.headers.get('content-type') ?? '';

  // PATH 1: Audio — transcribe via Whisper
  if (contentType.includes('multipart/form-data')) {
    if (!OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set', key_status: keyStatus }), { status: 500 });
    }
    const form = await req.formData();
    const audioFile = form.get('audio') as File | null;
    const title = (form.get('title') as string) ?? 'Voice memo';
    const vertical = (form.get('vertical') as string) ?? 'Canada Europe Connects';
    const contentTypeDoc = (form.get('content_type') as string) ?? 'research_note';
    const isProprietary = ((form.get('is_proprietary') as string) ?? 'true') === 'true';

    if (!audioFile) {
      return new Response(JSON.stringify({ error: 'No audio file. Use field name: audio' }), { status: 400 });
    }

    const whisperForm = new FormData();
    whisperForm.append('file', audioFile);
    whisperForm.append('model', 'whisper-1');
    whisperForm.append('language', 'en');
    whisperForm.append('response_format', 'verbose_json');

    const whisperResp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` },
      body: whisperForm
    });

    if (!whisperResp.ok) {
      const err = await whisperResp.text();
      return new Response(JSON.stringify({ error: `Whisper error: ${err}` }), { status: 500 });
    }

    const whisperData = await whisperResp.json();
    const transcript = whisperData.text ?? '';
    const duration = whisperData.duration ?? 0;
    const chunks = chunkText(transcript, 500);
    const results: any = { transcribed: true, duration_seconds: duration, chunks: chunks.length, embedded: 0, errors: [] };

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkTitle = chunks.length > 1 ? `${title} (part ${i+1} of ${chunks.length})` : title;
      const embedding = await generateEmbedding(chunk, OPENAI_API_KEY);
      const { error } = await supabase.from('documents').insert({
        content_type: contentTypeDoc, vertical, title: chunkTitle,
        body: chunk, summary: chunk.slice(0, 300),
        source_name: 'Voice/Audio Ingest', is_proprietary: isProprietary,
        embedding, embedded_at: embedding ? new Date().toISOString() : null,
        published_at: new Date().toISOString()
      });
      if (error) results.errors.push(`Chunk ${i+1}: ${error.message}`);
      else results.embedded++;
      await new Promise(r => setTimeout(r, 100));
    }

    return new Response(JSON.stringify({
      success: true, transcript_preview: transcript.slice(0, 500), results, key_status: keyStatus
    }), { headers: { 'Content-Type': 'application/json' } });
  }

  // PATH 2: Text/JSON — ingest notes directly
  if (contentType.includes('application/json')) {
    const body = await req.json();
    const text = body.text ?? body.transcript ?? '';
    const title = body.title ?? 'Field note';
    const vertical = body.vertical ?? 'Canada Europe Connects';
    const contentTypeDoc = body.content_type ?? 'research_note';
    const isProprietary = body.is_proprietary ?? true;
    const sourceName = body.source_name ?? 'Manual Ingest';

    if (!text) {
      return new Response(JSON.stringify({ error: 'No text. Send: { text: "...", title: "..." }' }), { status: 400 });
    }

    const chunks = chunkText(text, 500);
    const results: any = { chunks: chunks.length, embedded: 0, errors: [] };

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const chunkTitle = chunks.length > 1 ? `${title} (part ${i+1} of ${chunks.length})` : title;
      const embedding = await generateEmbedding(chunk, OPENAI_API_KEY);
      const { error } = await supabase.from('documents').insert({
        content_type: contentTypeDoc, vertical, title: chunkTitle,
        body: chunk, summary: chunk.slice(0, 300),
        source_name: sourceName, is_proprietary: isProprietary,
        embedding, embedded_at: embedding ? new Date().toISOString() : null,
        published_at: new Date().toISOString()
      });
      if (error) results.errors.push(`Chunk ${i+1}: ${error.message}`);
      else results.embedded++;
      await new Promise(r => setTimeout(r, 100));
    }

    return new Response(JSON.stringify({ success: true, results, key_status: keyStatus }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    status: 'ingest ready', version: '5', model: 'text-embedding-3-small', key_status: keyStatus
  }), { headers: { 'Content-Type': 'application/json' } });
});

function chunkText(text: string, wordsPerChunk: number): string[] {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const chunks: string[] = [];
  const overlap = 50;
  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + wordsPerChunk).join(' ');
    if (chunk.trim()) chunks.push(chunk);
    i += wordsPerChunk - overlap;
  }
  return chunks;
}

async function generateEmbedding(text: string, apiKey: string): Promise<number[] | null> {
  if (!apiKey) return null;
  try {
    const resp = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: text.slice(0, 8000) })
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const values = data?.data?.[0]?.embedding;
    return Array.isArray(values) && values.length === 1536 ? values : null;
  } catch { return null; }
}
