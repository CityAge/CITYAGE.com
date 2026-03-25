import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// calculate-sunrise v1 — NOAA Solar Algorithm, pure TypeScript
// Accurate to within 1 minute for latitudes -72 to +72

function toJulianDate(date: Date): number { return date.getTime() / 86400000 + 2440587.5; }

function calcSunrise(year: number, month: number, day: number, lat: number, lng: number, rising: boolean): Date {
  const JD = toJulianDate(new Date(Date.UTC(year, month - 1, day, 12, 0, 0)));
  const T = (JD - 2451545.0) / 36525.0;
  const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
  const Mrad = M * Math.PI / 180;
  const C = Math.sin(Mrad) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * Mrad) * (0.019993 - 0.000101 * T) + Math.sin(3 * Mrad) * 0.000289;
  const sunLon = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = sunLon - 0.00569 - 0.00478 * Math.sin(omega * Math.PI / 180);
  const lambdaRad = lambda * Math.PI / 180;
  const eps0 = 23 + (26 + (21.448 - T * (46.8150 + T * (0.00059 - T * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * Math.PI / 180);
  const epsRad = eps * Math.PI / 180;
  const sinDec = Math.sin(epsRad) * Math.sin(lambdaRad);
  const dec = Math.asin(sinDec);
  const y = Math.tan(epsRad / 2) ** 2;
  const L0rad = L0 * Math.PI / 180;
  const eot = 4 * (180 / Math.PI) * (y * Math.sin(2 * L0rad) - 2 * 0.016708634 * Math.sin(Mrad) + 4 * 0.016708634 * y * Math.sin(Mrad) * Math.cos(2 * L0rad) - 0.5 * y * y * Math.sin(4 * L0rad) - 1.25 * 0.016708634 * 0.016708634 * Math.sin(2 * Mrad));
  const latRad = lat * Math.PI / 180;
  const cosHA = (Math.cos(90.833 * Math.PI / 180) / (Math.cos(latRad) * Math.cos(dec))) - Math.tan(latRad) * Math.tan(dec);
  if (cosHA > 1 || cosHA < -1) throw new Error('Sun does not rise/set at this location');
  const HA = Math.acos(cosHA) * 180 / Math.PI;
  const solarNoon = 720 - 4 * lng - eot;
  const eventMinutes = rising ? solarNoon - 4 * HA : solarNoon + 4 * HA;
  const eventDate = new Date(Date.UTC(year, month - 1, day));
  eventDate.setUTCMinutes(eventDate.getUTCMinutes() + Math.round(eventMinutes));
  return eventDate;
}

const VERTICALS = [
  { vertical: 'gmwv', lat: 49.3667, lng: -123.1667, timezone: 'America/Vancouver' },
  { vertical: 'beverly-hills', lat: 34.0736, lng: -118.4004, timezone: 'America/Los_Angeles' }
];

Deno.serve(async (req: Request) => {
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const url = new URL(req.url);
    const dateParam = url.searchParams.get('date');
    let targetDate: Date;
    if (dateParam) { targetDate = new Date(dateParam + 'T12:00:00Z'); } else { targetDate = new Date(); targetDate.setUTCDate(targetDate.getUTCDate() + 1); }
    const year = targetDate.getUTCFullYear(); const month = targetDate.getUTCMonth() + 1; const day = targetDate.getUTCDate();
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const results = []; const errors = [];
    for (const v of VERTICALS) {
      try {
        const sunrise = calcSunrise(year, month, day, v.lat, v.lng, true);
        const sunset = calcSunrise(year, month, day, v.lat, v.lng, false);
        await supabase.from('sunrise_times').upsert({ vertical: v.vertical, date: dateStr, sunrise_utc: sunrise.toISOString(), sunset_utc: sunset.toISOString(), lat: v.lat, lng: v.lng, timezone: v.timezone, calculated_at: new Date().toISOString() }, { onConflict: 'vertical,date' });
        results.push({ vertical: v.vertical, date: dateStr, sunrise: sunrise.toISOString(), sunset: sunset.toISOString() });
      } catch (err) { errors.push({ vertical: v.vertical, error: (err as Error).message }); }
    }
    return new Response(JSON.stringify({ success: true, date: dateStr, calculated: results, errors }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) { return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 }); }
});
