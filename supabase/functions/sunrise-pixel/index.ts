import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// sunrise-pixel v1 — Dynamic SVG sunrise banner for email
// Returns an SVG image showing time since/until sunrise
// No-cache headers — every open gets fresh render

const VERTICAL_CONFIG: Record<string, { label: string; timezone: string }> = {
  'gmwv': { label: 'West Vancouver', timezone: 'America/Vancouver' },
  'beverly-hills': { label: 'Beverly Hills', timezone: 'America/Los_Angeles' }
};

function formatElapsed(m: number): string { if (m < 1) return 'less than a minute'; if (m < 60) return `${Math.round(m)} minute${Math.round(m)===1?'':'s'}`; const h = Math.floor(m/60); const mn = Math.round(m%60); if (mn===0) return `${h} hour${h===1?'':'s'}`; return `${h} hour${h===1?'':'s'} and ${mn} minute${mn===1?'':'s'}`; }
function formatLocalTime(date: Date, tz: string): string { return date.toLocaleTimeString('en-CA', { timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true }); }

function renderSVG(line1: string, line2: string): string {
  const e1 = line1.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const e2 = line2.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="72" viewBox="0 0 600 72"><rect width="600" height="72" fill="#FDF6EC" rx="4"/><text x="300" y="28" font-family="Georgia,serif" font-size="15" font-weight="bold" fill="#1a1a1a" text-anchor="middle">${e1}</text><text x="300" y="52" font-family="Georgia,serif" font-size="13" fill="#555" text-anchor="middle">${e2}</text><line x1="40" y1="65" x2="560" y2="65" stroke="#E8D5B7" stroke-width="1"/></svg>`;
}

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const vertical = url.searchParams.get('vertical') || 'gmwv';
  const config = VERTICAL_CONFIG[vertical] || VERTICAL_CONFIG['gmwv'];
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const now = new Date();
    const localDateStr = now.toLocaleDateString('en-CA', { timeZone: config.timezone, year: 'numeric', month: '2-digit', day: '2-digit' });
    const { data, error } = await supabase.from('sunrise_times').select('sunrise_utc, sunset_utc').eq('vertical', vertical).eq('date', localDateStr).single();
    let line1: string, line2: string;
    if (error || !data) { line1 = `☀️ Good morning, ${config.label}.`; line2 = `Daybreaker — intelligence at sunrise.`; }
    else {
      const sunriseUtc = new Date(data.sunrise_utc);
      const minutesDiff = (now.getTime() - sunriseUtc.getTime()) / 60000;
      const sunriseLocal = formatLocalTime(sunriseUtc, config.timezone);
      if (minutesDiff < -60) { line1 = `☀️ Sunrise arrives in ${formatElapsed(Math.abs(minutesDiff))}.`; line2 = `Good morning, ${config.label}. Your Daybreaker dispatch is ready.`; }
      else if (minutesDiff < 0) { line1 = `☀️ Sunrise in ${formatElapsed(Math.abs(minutesDiff))}. Good morning, ${config.label}.`; line2 = `Your Daybreaker dispatch is ready.`; }
      else if (minutesDiff < 720) { line1 = `☀️ Sunrise was ${formatElapsed(minutesDiff)} ago. Good morning, ${config.label}.`; line2 = `Daybreaker — intelligence at ${sunriseLocal}.`; }
      else { line1 = `☀️ Sunrise was at ${sunriseLocal} this morning.`; line2 = `Tomorrow's Daybreaker dispatch arrives at dawn.`; }
    }
    return new Response(renderSVG(line1, line2), { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0', 'Access-Control-Allow-Origin': '*' } });
  } catch {
    return new Response(renderSVG(`☀️ Good morning, ${config.label}.`, `Daybreaker — intelligence at sunrise.`), { headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*' } });
  }
});
