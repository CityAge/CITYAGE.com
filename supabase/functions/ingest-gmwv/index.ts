import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// ingest-gmwv v1 — Voice-to-Brief for West Van Daybreaker
// Audio → Whisper transcribes → transcript becomes editor_guidance
// Optionally triggers write-brief-gmwv

const VERTICAL = 'Good Morning West Vancouver';

Deno.serve(async (req: Request) => {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const hdrKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && hdrKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 1, vertical: VERTICAL }), { headers: { 'Content-Type': 'application/json' } });

  const contentType = req.headers.get('content-type') ?? '';
  let transcript = ''; let triggerBrief = false; let duration = 0; let inputType = 'unknown';

  if (contentType.includes('multipart/form-data')) {
    if (!OPENAI_API_KEY) return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not set' }), { status: 500 });
    inputType = 'audio';
    const form = await req.formData();
    const audioFile = form.get('audio') as File | null;
    triggerBrief = (form.get('trigger_brief') as string ?? 'false') === 'true';
    if (!audioFile) return new Response(JSON.stringify({ error: 'No audio file' }), { status: 400 });

    const whisperForm = new FormData();
    whisperForm.append('file', audioFile);
    whisperForm.append('model', 'whisper-1');
    whisperForm.append('language', 'en');
    whisperForm.append('response_format', 'verbose_json');

    const whisperResp = await fetch('https://api.openai.com/v1/audio/transcriptions', { method: 'POST', headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }, body: whisperForm });
    if (!whisperResp.ok) return new Response(JSON.stringify({ error: `Whisper: ${await whisperResp.text()}` }), { status: 500 });
    const whisperData = await whisperResp.json();
    transcript = whisperData.text ?? ''; duration = whisperData.duration ?? 0;
  } else if (contentType.includes('application/json')) {
    inputType = 'text';
    const body = await req.json();
    transcript = body.guidance || body.text || body.editor_guidance || '';
    triggerBrief = body.trigger_brief ?? false;
    if (!transcript) return new Response(JSON.stringify({ error: 'No guidance text' }), { status: 400 });
  } else {
    return new Response(JSON.stringify({ error: 'Send audio or JSON' }), { status: 400 });
  }

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Vancouver' });
  const { error: docErr } = await supabase.from('documents').insert({ content_type: 'editor_guidance', vertical: VERTICAL, title: `Editor Guidance — ${today}`, body: transcript, summary: transcript.slice(0, 300), source_name: inputType === 'audio' ? 'Voice Memo (Whisper)' : 'Text Guidance', is_proprietary: true, published_at: new Date().toISOString() });

  let briefTriggerResult: any = null;
  if (triggerBrief) {
    try {
      const briefResp = await fetch(`${SUPABASE_URL}/functions/v1/write-brief-gmwv`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-sync-key': SYNC_API_KEY }, body: JSON.stringify({ editor_guidance: transcript }) });
      briefTriggerResult = briefResp.ok ? await briefResp.json() : { error: `${briefResp.status}` };
    } catch (err) { briefTriggerResult = { error: (err as Error).message }; }
  }

  return new Response(JSON.stringify({ success: true, version: 1, input_type: inputType, transcript, transcript_length: transcript.length, duration_seconds: duration || undefined, stored: !docErr, brief_triggered: triggerBrief, brief_result: briefTriggerResult }), { headers: { 'Content-Type': 'application/json' } });
});
