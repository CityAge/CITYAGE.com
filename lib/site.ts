/**
 * The site's own public address, used for share links and Open Graph URLs.
 * Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every deployment (the
 * project's production domain, custom domain once attached), so links the
 * site hands out always point at wherever it is actually being served.
 */
const fromEnv = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
export const SITE_URL = (fromEnv || 'https://cityage.com').replace(/\/$/, '')

/**
 * The Northern Century page is private for now (see PRIVATE in proxy.ts), so
 * the public pages do not link to it. Flip to true when it opens, together
 * with removing it from PRIVATE in proxy.ts and from robots.ts.
 */
export const NORTHERN_CENTURY_OPEN = false
