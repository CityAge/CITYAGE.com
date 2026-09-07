/**
 * The site's own public address, used for share links and Open Graph URLs.
 * Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every deployment (the
 * project's production domain, custom domain once attached), so links the
 * site hands out always point at wherever it is actually being served.
 */
const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
export const SITE_URL = (fromEnv || 'https://cityage.com').replace(/\/$/, '')
