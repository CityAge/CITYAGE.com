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
  /** ceil(words / 220) from the body, min 1 */
  readMin: number
}

type StoryRow = {
  id: string
  headline: string
  deck: string | null
  vertical: string
  image_url: string | null
  published_at: string | null
  body: string | null
}

const STORY_SELECT = 'id,headline,deck,vertical,image_url,published_at,body'
const WORDS_PER_MINUTE = 220

export function readMinutes(body: string | null | undefined): number {
  const words = (body || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

function toStory(row: StoryRow): SectionStory {
  return {
    id: row.id,
    headline: row.headline,
    deck: row.deck,
    vertical: row.vertical,
    image_url: row.image_url,
    published_at: row.published_at,
    readMin: readMinutes(row.body),
  }
}

async function fetchStories(query: string): Promise<SectionStory[]> {
  const env = supabaseEnv()
  if (!env) return []
  const { url, key } = env

  try {
    const res = await fetch(`${url}/rest/v1/magazine?select=${STORY_SELECT}&status=eq.published&${query}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const rows = (await res.json()) as StoryRow[]
    if (!Array.isArray(rows)) return []
    return rows.filter((row) => row.id && row.headline && row.vertical).map(toStory)
  } catch {
    return []
  }
}

/** Homepage well: featured first, then newest. Nine beside the lead. */
export function fetchWellStories(limit = 9): Promise<SectionStory[]> {
  return fetchStories(`order=featured.desc,published_at.desc&limit=${limit}`)
}

/** Published stories for one section from the `magazine` table, newest first. */
export function fetchSectionStories(vertical: SectionName): Promise<SectionStory[]> {
  return fetchStories(`vertical=eq.${encodeURIComponent(vertical)}&order=published_at.desc&limit=60`)
}
