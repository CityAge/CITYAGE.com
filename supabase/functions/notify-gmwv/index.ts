import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// notify-gmwv v4 — West Van Daybreaker delivery
// Beehiiv draft + Resend editor preview
// Sunrise calculation, styled email template

const VERTICAL = 'West Van Daybreaker';
const PUBLICATION_NAME = 'West Van Daybreaker';
const WV_LAT = 49.3798; const WV_LNG = -123.1732; const WV_TZ = 'America/Vancouver';

function calculateSunrise(date: Date, lat: number, lng: number): Date {
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const declination = -23.45 * Math.cos(rad * (360 / 365) * (dayOfYear + 10));
  const cosHA = -Math.tan(lat * rad) * Math.tan(declination * rad);
  const hourAngle = Math.acos(Math.max(-1, Math.min(1, cosHA))) / rad;
  const solarNoonUTC = 12 - lng / 15;
  const sunriseUTC = solarNoonUTC - hourAngle / 15;
  const sunrise = new Date(date);
  sunrise.setUTCHours(Math.floor(sunriseUTC)); sunrise.setUTCMinutes(Math.round((sunriseUTC % 1) * 60)); sunrise.setUTCSeconds(0);
  return sunrise;
}

function formatSunriseTime(s: Date, tz: string): string { return s.toLocaleTimeString('en-CA', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true }); }

function buildSunriseLine(todayS: Date, tomorrowS: Date, now: Date, tz: string): string {
  const mins = Math.round((now.getTime() - todayS.getTime()) / 60000);
  const hr = parseInt(new Date().toLocaleString('en-CA', { timeZone: tz, hour: 'numeric', hour12: false }));
  if (hr >= 12) return `☀️ Welcome to Daybreaker. Our next sunrise dispatch arrives at ${formatSunriseTime(tomorrowS, tz)} tomorrow.`;
  if (mins <= 1) return `☀️ Sunrise was just now. Welcome to Daybreaker.`;
  if (mins < 60) return `☀️ Sunrise was ${mins} minutes ago. Welcome to Daybreaker.`;
  return `☀️ Sunrise was ${Math.floor(mins/60)}h ${mins%60}m ago. Welcome to Daybreaker.`;
}

function markdownToHtml(md: string): string {
  let h = md;
  h = h.replace(/^# West Van Daybreaker\n/m, '').replace(/^# Morning, West Van!\n/m, '');
  h = h.replace(/^\*[^\n]+5 Minute Read\*\n/m, '');
  h = h.replace(/^## (.+)$/gm, '<h2 style="font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:#999;border-top:1px solid #e8e4dc;padding-top:20px;margin-top:28px;margin-bottom:14px;font-family:Georgia,serif;">$1</h2>');
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#111;">$1</strong>');
  h = h.replace(/\*([^\n*]+?)\*/g, '<em>$1</em>');
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#1a3a5c;text-decoration:underline;">$1</a>');
  h = h.replace(/^- \*\*([^*]+)\*\* — (.+)$/gm, '<div style="margin-bottom:18px;"><div style="font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:#c8960a;font-weight:600;margin-bottom:5px;">$1</div><div style="font-size:15px;line-height:1.7;color:#2a2a2a;">$2</div></div>');
  h = h.replace(/^- (.+)$/gm, '<div style="margin-bottom:10px;padding-left:14px;font-size:15px;line-height:1.65;color:#2a2a2a;border-left:2px solid #e8e4dc;">$1</div>');
  h = h.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #e8e4dc;margin:20px 0;">');
  h = h.replace(/\n\n/g, '</p><p style="font-size:16px;line-height:1.75;margin:0 0 14px 0;color:#222;font-family:Georgia,serif;">');
  h = h.replace(/\n/g, '<br>');
  h = '<p style="font-size:16px;line-height:1.75;margin:0 0 14px 0;color:#222;font-family:Georgia,serif;">' + h + '</p>';
  h = h.replace(/<p[^>]*>\s*(<h2)/g, '$1').replace(/(<\/h2>)\s*<\/p>/g, '$1').replace(/<p[^>]*>\s*<hr/g, '<hr').replace(/<p[^>]*>\s*<\/p>/g, '');
  return h;
}

Deno.serve(async (req: Request) => {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
  const BEEHIIV_API_KEY = Deno.env.get('BEEHIIV_API_KEY') ?? '';
  const BEEHIIV_PUB_ID = Deno.env.get('BEEHIIV_PUBLICATION_ID') ?? '';
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const NOTIFY_EMAIL = Deno.env.get('NOTIFY_EMAIL') ?? 'miro@cityage.com';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const hdrKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && hdrKey !== SYNC_API_KEY) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  if (req.method === 'GET') return new Response(JSON.stringify({ status: 'ok', version: 4, beehiiv: !!BEEHIIV_API_KEY, resend: !!RESEND_API_KEY }), { headers: { 'Content-Type': 'application/json' } });
  if (!RESEND_API_KEY && !BEEHIIV_API_KEY) return new Response(JSON.stringify({ error: 'No delivery API key' }), { status: 500 });

  const { data: brief, error: briefErr } = await supabase.from('briefs').select('id, title, body, published_at').eq('vertical', VERTICAL).order('published_at', { ascending: false }).limit(1).single();
  if (briefErr || !brief) return new Response(JSON.stringify({ error: 'No brief found' }), { status: 404 });

  const now = new Date(); const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
  const todaySunrise = calculateSunrise(now, WV_LAT, WV_LNG);
  const tomorrowSunrise = calculateSunrise(tomorrow, WV_LAT, WV_LNG);
  const sunriseLine = buildSunriseLine(todaySunrise, tomorrowSunrise, now, WV_TZ);
  const dateStr = now.toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: WV_TZ });
  const subject = `${PUBLICATION_NAME} — ${dateStr}`;
  const briefHtml = markdownToHtml(brief.body);

  const emailHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#e8e6e0;font-family:Georgia,serif;"><div style="max-width:620px;margin:0 auto;"><div style="background:#0d0d0d;padding:28px 36px 0 36px;"><div style="font-size:10px;letter-spacing:3.5px;text-transform:uppercase;color:#555;margin-bottom:12px;">CityAge Media</div><div style="font-size:34px;font-weight:bold;color:#ffffff;letter-spacing:-0.5px;line-height:1.1;margin-bottom:16px;">${PUBLICATION_NAME}</div><div style="font-size:14px;font-style:italic;color:#e8b840;line-height:1.5;margin-bottom:6px;">${sunriseLine}</div><div style="font-size:11px;color:#444;margin-bottom:0;">${dateStr} &middot; Sunrise ${formatSunriseTime(todaySunrise, WV_TZ)} Pacific</div><div style="height:3px;background:linear-gradient(90deg,#e8b840 0%,#c8960a 40%,#0d0d0d 100%);margin-top:20px;"></div></div><div style="background:#ffffff;padding:28px 36px;">${briefHtml}</div><div style="background:#0d0d0d;padding:20px 36px;"><div style="font-size:12px;color:#555;">${PUBLICATION_NAME} &middot; CityAge Media</div></div></div></body></html>`;

  const results: Record<string, unknown> = { subject, sunrise_line: sunriseLine };

  if (BEEHIIV_API_KEY && BEEHIIV_PUB_ID) {
    try {
      const r = await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${BEEHIIV_API_KEY}` }, body: JSON.stringify({ subject, body_content: emailHtml, status: 'draft' }) });
      const d = await r.json();
      results.beehiiv = { ok: r.ok, post_id: d?.data?.id };
    } catch (err) { results.beehiiv = { error: (err as Error).message }; }
  }

  if (RESEND_API_KEY) {
    try {
      const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` }, body: JSON.stringify({ from: `${PUBLICATION_NAME} <onboarding@resend.dev>`, to: [NOTIFY_EMAIL], subject: `[PREVIEW] ${subject}`, html: emailHtml }) });
      const d = await r.json();
      results.resend = { ok: r.ok, email_id: d?.id };
    } catch (err) { results.resend = { error: (err as Error).message }; }
  }

  return new Response(JSON.stringify({ success: true, brief_id: brief.id, ...results }), { headers: { 'Content-Type': 'application/json' } });
});
