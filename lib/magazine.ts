import { supabaseEnv } from '@/lib/supabase/env'

/** Locked section names and order. See DECISIONS.md. */
export const SECTIONS = [
  { slug: 'power', name: 'Power' },
  { slug: 'money', name: 'Money' },
  { slug: 'cities', name: 'Cities' },
  { slug: 'frontiers', name: 'Frontiers' },
  { slug: 'culture', name: 'Culture' },
] as const

export type SectionName = (typeof SECTIONS)[number]['name']

export type SectionStory = {
  id: string
  headline: string
  deck: string | null
  vertical: string
  image_url: string | null
  published_at: string | null
  read_time: number | null
}

/** Published stories for one section from the `magazine` table, newest first. */
export async function fetchSectionStories(vertical: SectionName): Promise<SectionStory[]> {
  const env = supabaseEnv()
  if (!env) return []
  const { url, key } = env

  try {
    const res = await fetch(
      `${url}/rest/v1/magazine?select=id,headline,deck,vertical,image_url,published_at,read_time&status=eq.published&vertical=eq.${encodeURIComponent(vertical)}&order=published_at.desc&limit=60`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        next: { revalidate: 60 },
      },
    )
    if (!res.ok) return []
    const rows = (await res.json()) as SectionStory[]
    if (!Array.isArray(rows)) return []
    return rows.filter((row) => row.id && row.headline)
  } catch {
    return []
  }
}
