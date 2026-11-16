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
  /** Readable address part, set from the headline by the database. */
  slug: string | null
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
  slug: string | null
  headline: string
  deck: string | null
  vertical: string
  image_url: string | null
  published_at: string | null
  body: string | null
}

const STORY_SELECT = 'id,slug,headline,deck,vertical,image_url,published_at,body'
const WORDS_PER_MINUTE = 220

/** A story's address: the readable slug when it has one, else the row id. */
export function storyHref(story: { id: string; slug?: string | null }): string {
  return `/magazine/${story.slug || story.id}`
}

export function readMinutes(body: string | null | undefined): number {
  const words = (body || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

function toStory(row: StoryRow): SectionStory {
  return {
    id: row.id,
    slug: row.slug,
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

/** A full story row, as the article page needs it. */
export type StoryRecord = {
  id: string
  slug: string | null
  headline: string
  deck: string | null
  body: string | null
  vertical: string
  sub_vertical: string | null
  author: string | null
  image_url: string | null
  image_credit: string | null
  image_credit_url: string | null
  published_at: string | null
  updated_at: string | null
}

export type RelatedStory = Pick<StoryRecord, 'id' | 'slug' | 'headline' | 'image_url' | 'body'>

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Thrown when the database cannot be reached, so the page shows "try again", never a false 404. */
export class StoryUnavailableError extends Error {}

async function readRows<T>(query: string): Promise<T[]> {
  const env = supabaseEnv()
  if (!env) throw new StoryUnavailableError('Supabase environment not configured')
  let res: Response
  try {
    res = await fetch(`${env.url}/rest/v1/magazine?${query}`, {
      headers: { apikey: env.key, Authorization: `Bearer ${env.key}` },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(10000),
    })
  } catch (err) {
    throw new StoryUnavailableError(`magazine query failed: ${String(err)}`)
  }
  if (!res.ok) throw new StoryUnavailableError(`magazine query returned ${res.status}`)
  const rows = (await res.json()) as unknown
  if (!Array.isArray(rows)) throw new StoryUnavailableError('magazine query returned a non-list')
  return rows as T[]
}

/**
 * One published story by uuid or slug. Returns null only when the query worked
 * and found nothing; throws StoryUnavailableError when the database could not answer.
 */
export async function fetchStory(param: string): Promise<StoryRecord | null> {
  const column = UUID_RE.test(param) ? 'id' : 'slug'
  const select = 'id,slug,headline,deck,body,vertical,sub_vertical,author,image_url,image_credit,image_credit_url,published_at,updated_at'
  const rows = await readRows<StoryRecord>(
    `select=${select}&${column}=eq.${encodeURIComponent(param)}&status=eq.published&limit=1`,
  )
  return rows[0]?.headline ? rows[0] : null
}

/** Up to `limit` other published stories in the same section, newest first. Never throws. */
export async function fetchRelated(vertical: string, excludeId: string, limit = 3): Promise<RelatedStory[]> {
  try {
    return await readRows<RelatedStory>(
      `select=id,slug,headline,image_url,body&status=eq.published&vertical=eq.${encodeURIComponent(vertical)}` +
        `&id=neq.${encodeURIComponent(excludeId)}&order=published_at.desc&limit=${limit}`,
    )
  } catch {
    return []
  }
}
