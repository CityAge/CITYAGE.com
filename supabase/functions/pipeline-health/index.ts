import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

// pipeline-health v2
// Self-healing: auto-closes stuck runs, re-triggers missing briefs

const SUPABASE_FUNCTIONS_URL_BASE = 'https://rniqmxpmtqmnwqtawlnz.supabase.co/functions/v1';
const STUCK_THRESHOLD_MINUTES = 20;

Deno.serve(async (req: Request) => {
  const SYNC_API_KEY = Deno.env.get('SYNC_API_KEY') ?? '';
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  const apiKey = req.headers.get('x-sync-key') ?? '';
  if (SYNC_API_KEY && apiKey !== SYNC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const since = new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString();
  const stuckCutoff = new Date(Date.now() - STUCK_THRESHOLD_MINUTES * 60 * 1000).toISOString();
  const recoveryActions: string[] = [];
  const issues: string[] = [];

  // Close stuck runs
  const { data: stuckRuns } = await supabase
    .from('pipeline_runs').select('id, job_name, started_at')
    .eq('status', 'running').lt('started_at', stuckCutoff);

  if (stuckRuns && stuckRuns.length > 0) {
    const stuckIds = stuckRuns.map((r: any) => r.id);
    const stuckNames = stuckRuns.map((r: any) => r.job_name).join(', ');
    await supabase.from('pipeline_runs').update({
      status: 'failed', completed_at: new Date().toISOString(),
      error_message: `Auto-closed by pipeline-health v2 — stuck >${STUCK_THRESHOLD_MINUTES} minutes`
    }).in('id', stuckIds);
    issues.push(`FIXED: ${stuckRuns.length} stuck run(s) auto-closed: ${stuckNames}`);
    recoveryActions.push(`closed-stuck:${stuckNames}`);
  }

  // Check GMWV brief
  const { data: gmwvBrief } = await supabase.from('briefs')
    .select('id, title, status, created_at').eq('vertical', 'West Van Daybreaker')
    .gte('created_at', since).order('created_at', { ascending: false }).limit(1);
  const gmwvBriefExists = gmwvBrief && gmwvBrief.length > 0;

  if (!gmwvBriefExists) {
    issues.push('MISSING: No West Van Daybreaker brief today — re-triggering pipeline');
    const syncKey = SYNC_API_KEY || 'cecMay26';
    fetch(`${SUPABASE_FUNCTIONS_URL_BASE}/rss-fetch-gmwv`, {
      method: 'POST', headers: { 'x-sync-key': syncKey, 'Content-Type': 'application/json' }, body: JSON.stringify({})
    }).catch(() => {});
    fetch(`${SUPABASE_FUNCTIONS_URL_BASE}/write-brief`, {
      method: 'POST', headers: { 'x-sync-key': syncKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ vertical: 'Good Morning West Vancouver' })
    }).catch(() => {});
    recoveryActions.push('retriggered:rss-fetch-gmwv,write-brief-gmwv');
  }

  // Check CEC brief
  const { data: cecBrief } = await supabase.from('briefs')
    .select('id, title, status, created_at').eq('vertical', 'Canada Europe Connects')
    .gte('created_at', since).order('created_at', { ascending: false }).limit(1);
  const cecBriefPublished = cecBrief && cecBrief.length > 0 && (cecBrief[0].status === 'published' || cecBrief[0].status === 'draft');

  if (!cecBriefPublished) {
    issues.push('MISSING: No Canada Europe Connects brief today — re-triggering write-brief');
    const syncKey = SYNC_API_KEY || 'cecMay26';
    fetch(`${SUPABASE_FUNCTIONS_URL_BASE}/write-brief`, {
      method: 'POST', headers: { 'x-sync-key': syncKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ vertical: 'Canada Europe Connects' })
    }).catch(() => {});
    recoveryActions.push('retriggered:write-brief-cec');
  }

  // Article counts
  const { data: gmwvArticles } = await supabase.from('rss_articles')
    .select('id', { count: 'exact' }).eq('vertical', 'West Van Daybreaker').gte('created_at', since);
  const { data: cecArticles } = await supabase.from('rss_articles')
    .select('id', { count: 'exact' }).eq('vertical', 'Canada Europe Connects').gte('created_at', since);

  const gmwvCount = (gmwvArticles as any)?.length ?? 0;
  const cecCount = (cecArticles as any)?.length ?? 0;
  if (gmwvCount < 5) issues.push(`WARN: Only ${gmwvCount} GMWV articles in last 12h`);
  if (cecCount < 5) issues.push(`WARN: Only ${cecCount} CEC articles in last 12h`);

  // Apify errors
  const { data: apifyErrors } = await supabase.from('pipeline_runs')
    .select('job_name, error_message, started_at').eq('job_name', 'apify-scrape-gmwv')
    .gte('started_at', since).not('error_message', 'is', null);
  if (apifyErrors && apifyErrors.length > 0) {
    issues.push(`WARN: Apify actor errors detected`);
  }

  const healthy = issues.filter(i => i.startsWith('MISSING') || i.startsWith('WARN')).length === 0;
  const hadRecovery = recoveryActions.length > 0;

  await supabase.from('pipeline_runs').insert({
    job_name: 'pipeline-health',
    status: healthy ? 'success' : hadRecovery ? 'recovered' : 'warn',
    articles_fetched: gmwvCount + cecCount,
    notes: issues.length > 0
      ? `Issues: ${issues.join(' | ')} | Recovery: ${recoveryActions.join(', ') || 'none'}`
      : `All systems healthy. GMWV: ${gmwvCount}, CEC: ${cecCount}.`,
    started_at: new Date().toISOString(), completed_at: new Date().toISOString()
  });

  return new Response(JSON.stringify({
    healthy, had_recovery: hadRecovery, issues, recovery_actions: recoveryActions,
    stats: { stuck_runs_closed: stuckRuns?.length ?? 0, gmwv_brief_exists: gmwvBriefExists,
      cec_brief_exists: cecBriefPublished, gmwv_articles_12h: gmwvCount, cec_articles_12h: cecCount }
  }), { headers: { 'Content-Type': 'application/json' } });
});
