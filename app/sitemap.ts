import type { MetadataRoute } from 'next'
import { SITE_BASE_URL } from './robots'
import routes from '@/lib/sitemap-routes.generated.json'
import { SECTIONS } from '@/lib/magazine'
import { supabaseEnv } from '@/lib/supabase/env'

// Read published articles on every request, including articles added after deployment.
export const dynamic = 'force-dynamic'

type Article = { id: string; slug: string | null; published_at: string | null; updated_at: string | null }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const env = supabaseEnv()
  if (!env) throw new Error('Supabase is required to generate the complete sitemap')
  const sections = new Set(SECTIONS.map(section => `/${section.slug}`))
  const utilities = new Set(['/contact', '/privacy', '/subscribe', '/search', '/ai-policy'])
  const result: MetadataRoute.Sitemap = routes.map(path => ({
    url: `${SITE_BASE_URL}${path === '/' ? '' : path}`,
    priority: path === '/' ? 1 : sections.has(path) ? 0.8 : utilities.has(path) ? 0.3 : path.startsWith('/frontiers/') ? 0.6 : 0.5,
  }))

  // Keyset pagination avoids Supabase's row cap and does not skip rows when
  // an earlier article is removed between requests.
  let cursor: string | undefined
  while (true) {
    const params = new URLSearchParams({
      select: 'id,slug,published_at,updated_at',
      status: 'eq.published',
      order: 'id.asc',
      limit: '1000',
    })
    if (cursor) params.set('id', `gt.${cursor}`)
    const response = await fetch(`${env.url}/rest/v1/magazine?${params}`, {
      headers: { apikey: env.key, Authorization: `Bearer ${env.key}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    })
    // Never serve a successful but incomplete sitemap on a data-source failure.
    if (!response.ok) throw new Error(`Sitemap article query failed: ${response.status}`)
    const articles: Article[] = await response.json()
    if (!articles.length) break
    for (const article of articles) {
      const dates = [article.updated_at, article.published_at]
        .filter((date): date is string => Boolean(date))
        .map(date => new Date(date).getTime()).filter(Number.isFinite)
      result.push({
        url: `${SITE_BASE_URL}/magazine/${encodeURIComponent(article.slug || article.id)}`,
        ...(dates.length ? { lastModified: new Date(Math.max(...dates)) } : {}),
        priority: 0.6,
      })
    }
    cursor = articles[articles.length - 1].id
  }
  return result
}
