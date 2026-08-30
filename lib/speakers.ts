export type SpeakerFace = {
  id: string
  name: string
  title: string | null
  organisation: string | null
  headshot_url: string | null
  linkedin_url: string | null
}

/** urban-planet-brain — same project as public/people.html */
export const SPEAKERS_SUPABASE_URL = 'https://rniqmxpmtqmnwqtawlnz.supabase.co'

// Public anon key already shipped in public/people.html. Not a service_role key.
const PEOPLE_HTML_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaXFteHBtdHFtbndxdGF3bG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMTAyMzEsImV4cCI6MjA4NTU4NjIzMX0.m3jrPO52RU7SW3h8ypSIUyhI17sF0RVufaO7mlex6EQ'

type SpeakerRow = {
  id?: string | number
  name: string
  title: string | null
  organisation: string | null
  headshot_url: string | null
  linkedin_url: string | null
}

function toFace(row: SpeakerRow, index: number): SpeakerFace {
  return {
    id: row.id != null ? String(row.id) : `${row.name}-${index}`,
    name: row.name,
    title: row.title,
    organisation: row.organisation,
    headshot_url: row.headshot_url,
    linkedin_url: row.linkedin_url,
  }
}

/** Same as people.html: one card per name. */
export function uniqueByName(faces: SpeakerFace[]): SpeakerFace[] {
  const seen = new Set<string>()
  return faces.filter((s) => {
    if (!s.name || seen.has(s.name)) return false
    seen.add(s.name)
    return true
  })
}

export function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export async function fetchSpeakerFaces(): Promise<SpeakerFace[]> {
  const key = PEOPLE_HTML_ANON_KEY
  const page = 1000
  let from = 0
  const rows: SpeakerRow[] = []

  while (true) {
    const res = await fetch(
      `${SPEAKERS_SUPABASE_URL}/rest/v1/speakers?select=id,name,title,organisation,headshot_url,linkedin_url&order=id`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Range: `${from}-${from + page - 1}`,
          Prefer: 'count=exact',
        },
      },
    )
    if (!res.ok) break
    const batch = (await res.json()) as SpeakerRow[]
    if (!Array.isArray(batch) || batch.length === 0) break
    rows.push(...batch)
    if (batch.length < page) break
    from += page
  }

  return uniqueByName(rows.map(toFace))
}
