import type { MetadataRoute } from 'next'

// SITE BASE URL: change to https://cityage.com at DNS cutover.
export const SITE_BASE_URL = 'https://cityagemag.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/northern-century', '/northern-century/*', '/dispatches', '/dispatches/*'],
    },
    sitemap: `${SITE_BASE_URL}/sitemap.xml`,
  }
}
