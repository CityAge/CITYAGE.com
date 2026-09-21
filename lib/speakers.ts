import { supabaseEnv } from '@/lib/supabase/env'

export type SpeakerFace = {
  id: string
  name: string
  title: string | null
  organisation: string | null
  headshot_url: string | null
  linkedin_url: string | null
}

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

/** One card per name. */
export function uniqueByName(faces: SpeakerFace[]): SpeakerFace[] {
  const seen = new Set<string>()
  return faces.filter((s) => {
    if (!s.name || seen.has(s.name)) return false
    seen.add(s.name)
    return true
  })
}

/** Fixed seeded shuffle: varied presentation, identical on every render/reload. */
export function stableSpeakerShuffle(items: SpeakerFace[]): SpeakerFace[] {
  const rank = (speaker: SpeakerFace) => {
    let hash = 2166136261
    for (const char of `cityage-stage-v1:${speaker.id}:${speaker.name}`) {
      hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
    }
    return hash >>> 0
  }
  return [...items].sort((a, b) =>
    rank(a) - rank(b) || a.id.localeCompare(b.id, 'en'),
  )
}

export function hasSpeakerShot(url: string | null | undefined): url is string {
  if (!url) return false
  const trimmed = url.trim()
  return trimmed.startsWith('http://') || trimmed.startsWith('https://')
}

/** 48×58 door tiles. Do not bake; transform at the edge. */
export function speakerThumbUrl(
  url: string | null,
  width = 96,
  height = 116,
): string | null {
  if (!hasSpeakerShot(url)) return null
  let parsed: URL
  try { parsed = new URL(url) } catch { return null }
  if (!parsed.hostname.endsWith('.supabase.co')) return url
  parsed.pathname = parsed.pathname.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')
  if (!parsed.pathname.startsWith('/storage/v1/render/image/public/')) return url
  parsed.searchParams.set('width', String(width))
  parsed.searchParams.set('height', String(height))
  parsed.searchParams.set('resize', 'cover')
  parsed.searchParams.set('quality', '55')
  return parsed.toString()
}

/** Door only: one small page of faces with shots. Not the full catalog. */
export async function fetchDoorSpeakerFaces(limit = 80): Promise<SpeakerFace[]> {
  const env = supabaseEnv()
  if (!env) return []
  const { url, key } = env
  const res = await fetch(
    `${url}/rest/v1/speakers?select=id,name,headshot_url&headshot_url=not.is.null&order=name.asc,id.asc&limit=${limit}`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      next: { revalidate: 3600 },
    },
  )
  if (!res.ok) return []
  const batch = (await res.json()) as SpeakerRow[]
  if (!Array.isArray(batch)) return []
  return stableSpeakerShuffle(uniqueByName(batch.map(toFace)))
    .map((face) => ({
      ...face,
      headshot_url: speakerThumbUrl(face.headshot_url),
    }))
    .filter((face) => hasSpeakerShot(face.headshot_url))
}

/**
 * Northern Century members: speakers with the boolean `northern_century` column
 * set. Until that column exists in Supabase the request fails; render an empty
 * strip and say so in the server log rather than failing the build.
 */
export async function fetchNorthernCenturyFaces(): Promise<SpeakerFace[]> {
  const env = supabaseEnv()
  if (!env) return []
  const { url, key } = env
  try {
    const res = await fetch(
      `${url}/rest/v1/speakers?select=id,name,headshot_url&northern_century=is.true&headshot_url=not.is.null&order=id&limit=200`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        next: { revalidate: 3600 },
      },
    )
    if (!res.ok) {
      console.warn(
        `[northern-century] speakers.northern_century not queryable yet (HTTP ${res.status}); rendering an empty strip`,
      )
      return []
    }
    const batch = (await res.json()) as SpeakerRow[]
    if (!Array.isArray(batch)) return []
    return stableSpeakerShuffle(uniqueByName(batch.map(toFace)))
      .map((face) => ({
        ...face,
        headshot_url: speakerThumbUrl(face.headshot_url),
      }))
      .filter((face) => hasSpeakerShot(face.headshot_url))
  } catch (err) {
    console.warn('[northern-century] speakers fetch failed; rendering an empty strip', err)
    return []
  }
}

export async function fetchSpeakerFaces(): Promise<SpeakerFace[]> {
  const env = supabaseEnv()
  if (!env) return []
  const { url, key } = env
  const page = 1000
  let from = 0
  const rows: SpeakerRow[] = []

  while (true) {
    const res = await fetch(
      `${url}/rest/v1/speakers?select=id,name,title,organisation,headshot_url,linkedin_url&order=id`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Range: `${from}-${from + page - 1}`,
          Prefer: 'count=exact',
        },
        next: { revalidate: 3600 },
      },
    )
    if (!res.ok) break
    const batch = (await res.json()) as SpeakerRow[]
    if (!Array.isArray(batch) || batch.length === 0) break
    rows.push(...batch)
    if (batch.length < page) break
    from += page
  }

  return stableSpeakerShuffle(uniqueByName(rows.map(toFace)))
}

/** Full network for /people. Render thumbs only — never the original portraits. */
export async function fetchPeopleWallFaces(): Promise<SpeakerFace[]> {
  const faces = await fetchSpeakerFaces()
  return faces.map((face) => ({
    ...face,
    headshot_url: speakerThumbUrl(face.headshot_url, 220, 264),
  }))
}
