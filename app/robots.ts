import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// The address comes from lib/site.ts, which follows the production domain,
// so robots.txt and the sitemap switch to cityage.com when the domain does.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/northern-century', '/northern-century/*',
        '/dispatches', '/dispatches/*',
        '/pulse', '/pulse/*',
        '/next-vancouver', '/next-vancouver.html',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
