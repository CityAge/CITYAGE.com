export type SpeakerFace = {
  id: string
  name: string
  title: string | null
  organisation: string | null
  headshot_url: string | null
  linkedin_url: string | null
}

/** Real headshots already in this repo. Used only when Supabase is unreachable. */
export const FALLBACK_FACES: SpeakerFace[] = [
  {
    id: 'local-miro',
    name: 'Miro Cernetig',
    title: 'Editor & Publisher',
    organisation: 'CityAge',
    headshot_url: '/miro-cernetig.png',
    linkedin_url: null,
  },
  {
    id: 'local-editor',
    name: 'CityAge',
    title: null,
    organisation: 'CityAge',
    headshot_url: '/editor-portrait.jpg',
    linkedin_url: null,
  },
  {
    id: 'local-guest',
    name: 'CityAge',
    title: null,
    organisation: 'CityAge',
    headshot_url: '/guest-portrait.jpg',
    linkedin_url: null,
  },
]

export const FIRST_WINDOW = 24
export const STREAM_PAGE = 80
export const SUPABASE_PROJECT_URL = 'https://rniqmxpmtqmnwqtawlnz.supabase.co'

// Public anon key already shipped in public/people.html. Prefer env on Vercel.
// Never put a service_role key here or in any client module.
const PEOPLE_HTML_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaXFteHBtdHFtbndxdGF3bG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMTAyMzEsImV4cCI6MjA4NTU4NjIzMX0.m3jrPO52RU7SW3h8ypSIUyhI17sF0RVufaO7mlex6EQ'

export function supabasePublicConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_PROJECT_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PEOPLE_HTML_ANON_KEY,
  }
}

export function uniqueHeadshots(faces: SpeakerFace[]): SpeakerFace[] {
  const seenUrls = new Set<string>()
  const seenNames = new Set<string>()
  return faces.filter((s) => {
    if (!s.name) return false
    if (s.headshot_url) {
      if (seenUrls.has(s.headshot_url)) return false
      seenUrls.add(s.headshot_url)
      return true
    }
    if (seenNames.has(s.name)) return false
    seenNames.add(s.name)
    return true
  })
}

export function padFaces(faces: SpeakerFace[], min = 16): SpeakerFace[] {
  if (faces.length === 0 || faces.length >= min) return faces
  const out = [...faces]
  while (out.length < min) {
    const src = faces[out.length % faces.length]
    out.push({ ...src, id: `${src.id}-r${out.length}` })
  }
  return out
}

function speakersUrl(base: string) {
  return `${base}/rest/v1/speakers?select=id,name,title,organisation,headshot_url,linkedin_url&headshot_url=not.is.null&order=id`
}

export async function fetchSpeakerWindow(
  from: number,
  size: number,
  init?: RequestInit,
): Promise<SpeakerFace[]> {
  const { url, key } = supabasePublicConfig()
  if (!key) return []

  const res = await fetch(speakersUrl(url), {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Range: `${from}-${from + size - 1}`,
      Prefer: 'count=exact',
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) return []
  const chunk = (await res.json()) as SpeakerFace[]
  return Array.isArray(chunk) ? chunk : []
}

export async function getFirstPaintFaces(): Promise<SpeakerFace[]> {
  const { key } = supabasePublicConfig()
  if (key) {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 1200)
      const faces = uniqueHeadshots(
        await fetchSpeakerWindow(0, FIRST_WINDOW, {
          signal: controller.signal,
          next: { revalidate: 3600 },
        }),
      )
      clearTimeout(timer)
      if (faces.length > 0) return faces
    } catch {
      // Fall through to local portraits so the strip still moves.
    }
  }
  return padFaces(FALLBACK_FACES)
}
