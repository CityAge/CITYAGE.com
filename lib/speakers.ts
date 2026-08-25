export type SpeakerFace = {
  id: string
  name: string
  title: string | null
  organisation: string | null
  headshot_url: string | null
  linkedin_url: string | null
}

const PAGE = 1000

// Same public project the working reel at /people.html already uses.
const PUBLIC_SUPABASE_URL = 'https://rniqmxpmtqmnwqtawlnz.supabase.co'
const PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaXFteHBtdHFtbndxdGF3bG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMTAyMzEsImV4cCI6MjA4NTU4NjIzMX0.m3jrPO52RU7SW3h8ypSIUyhI17sF0RVufaO7mlex6EQ'

export async function loadSpeakerFaces(): Promise<SpeakerFace[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || PUBLIC_SUPABASE_ANON_KEY

  try {
    const faces: SpeakerFace[] = []

    for (let from = 0; ; from += PAGE) {
      const res = await fetch(
        `${url}/rest/v1/speakers?select=id,name,title,organisation,headshot_url,linkedin_url&order=id`,
        {
          headers: {
            apikey: key,
            Authorization: `Bearer ${key}`,
            Range: `${from}-${from + PAGE - 1}`,
          },
          next: { revalidate: 3600 },
        },
      )
      if (!res.ok) break
      const chunk = (await res.json()) as SpeakerFace[]
      if (!Array.isArray(chunk) || chunk.length === 0) break
      faces.push(...chunk)
      if (chunk.length < PAGE) break
    }

    const seen = new Set<string>()
    const unique = faces.filter((s) => {
      if (!s.name || seen.has(s.name)) return false
      seen.add(s.name)
      return true
    })

    for (let i = unique.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[unique[i], unique[j]] = [unique[j], unique[i]]
    }
    return unique
  } catch (e) {
    console.error('Speakers load error:', e)
    return []
  }
}
