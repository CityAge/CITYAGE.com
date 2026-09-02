import { SPEAKERS_SUPABASE_URL } from '@/lib/speakers'

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

// Same public anon key already shipped for / and /people. Not a service_role key.
const PUBLIC_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaXFteHBtdHFtbndxdGF3bG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMTAyMzEsImV4cCI6MjA4NTU4NjIzMX0.m3jrPO52RU7SW3h8ypSIUyhI17sF0RVufaO7mlex6EQ'

/** Published stories for one section from the `magazine` table, newest first. */
export async function fetchSectionStories(vertical: SectionName): Promise<SectionStory[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || SPEAKERS_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PUBLIC_ANON_KEY

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
