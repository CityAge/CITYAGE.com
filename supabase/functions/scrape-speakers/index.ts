import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// All known CityAge event URLs with metadata
const EVENT_PAGES = [
  { url: 'https://cityage.com/past-events/cityage-new-york-the-new-infrastructure/', city: 'New York', year: 2022 },
  { url: 'https://cityage.com/events/estonia-a-blueprint-for-the-digital-future-part-2/', city: 'Digital', year: 2025 },
  { url: 'https://cityage.com/events/estonia-a-blueprint-for-the-digital-future/', city: 'Digital', year: 2024 },
  { url: 'https://cityage.com/events/the-next-vancouver/', city: 'Vancouver', year: 2024 },
  { url: 'https://cityage.com/events/securing-canadas-ai-future/', city: 'Vancouver', year: 2024 },
  { url: 'https://cityage.com/events/the-data-effect-vancouver/', city: 'Vancouver', year: 2024 },
  { url: 'https://cityage.com/past-events/decarbonizing-americas-urban-hubs/', city: 'Digital', year: 2024 },
  { url: 'https://cityage.com/past-events/fast-track-cities-building-sustainable-supply-chains-2/', city: 'Digital', year: 2024 },
  { url: 'https://cityage.com/past-events/launchpad/', city: 'Vancouver', year: 2020 },
  { url: 'https://cityage.com/past-events/future-of-cities-connecting-canadian-municipalities-with-canadian-innovation/', city: 'Digital', year: 2022 },
  { url: 'https://cityage.com/campaigns/cityage/', city: 'Vancouver', year: 2019 },
]

interface Speaker {
  name: string
  title: string
  organisation: string
  photo_url: string
  event_name: string
  event_url: string
  city: string
  year: number
}

function extractEventName(html: string, fallback: string): string {
  const h1 = html.match(/<h1[^>]*>([^<]{4,100})<\/h1>/)
  if (h1) return h1[1].trim()
  const title = html.match(/<title>([^<|–-]{4,80})/)
  if (title) return title[1].trim()
  return fallback
}

function extractSpeakers(html: string, eventName: string, eventUrl: string, city: string, year: number): Speaker[] {
  const speakers: Speaker[] = []

  // Find all elementor thumb images
  const imgMatches = [...html.matchAll(/src="(https:\/\/cityage\.com\/wp-content\/uploads\/elementor\/thumbs\/[^"]+)"/g)]

  if (imgMatches.length === 0) return speakers

  // For each image, find the nearest h3 (name) and h4 (title) after it
  for (const imgMatch of imgMatches) {
    const photoUrl = imgMatch[1]
    const imgPos = imgMatch.index!

    // Look in the next 800 chars for name and title
    const chunk = html.slice(imgPos, imgPos + 800)

    const nameMatch = chunk.match(/<h3[^>]*>\s*([A-Z][^<]{2,60}?)\s*<\/h3>/)
    if (!nameMatch) continue

    const name = nameMatch[1].trim()
    if (name.length < 3 || name.length > 80) continue

    // Skip if it looks like a section header not a person name
    if (/^(SPEAKERS|GUESTS|PROGRAM|AGENDA|WHAT TO EXPECT)/i.test(name)) continue

    const titleMatch = chunk.match(/<h4[^>]*>\s*([^<]{5,200}?)\s*<\/h4>/)
    let title = ''
    let organisation = ''

    if (titleMatch) {
      const raw = titleMatch[1].trim()
      // Split on comma - first part is title, rest is org
      const commaIdx = raw.indexOf(',')
      if (commaIdx > 0) {
        title = raw.slice(0, commaIdx).trim()
        organisation = raw.slice(commaIdx + 1).trim()
      } else {
        title = raw
      }
    }

    speakers.push({
      name,
      title,
      organisation,
      photo_url: photoUrl,
      event_name: eventName,
      event_url: eventUrl,
      city,
      year,
    })
  }

  return speakers
}

Deno.serve(async (req) => {
  // Allow GET or POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  const results = {
    processed: 0,
    inserted: 0,
    skipped: 0,
    errors: [] as string[],
  }

  for (const event of EVENT_PAGES) {
    try {
      console.log(`Fetching: ${event.url}`)

      const res = await fetch(event.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
        },
      })

      if (!res.ok) {
        results.errors.push(`${event.url}: HTTP ${res.status}`)
        continue
      }

      const html = await res.text()
      const eventName = extractEventName(html, event.url)
      const speakers = extractSpeakers(html, eventName, event.url, event.city, event.year)

      results.processed++
      console.log(`Found ${speakers.length} speakers for: ${eventName}`)

      if (speakers.length === 0) continue

      // Upsert — skip duplicates by name + event
      for (const speaker of speakers) {
        // Check if already exists
        const { data: existing } = await supabase
          .from('speakers')
          .select('id')
          .eq('name', speaker.name)
          .eq('event_name', speaker.event_name)
          .single()

        if (existing) {
          results.skipped++
          continue
        }

        const { error } = await supabase.from('speakers').insert(speaker)
        if (error) {
          results.errors.push(`${speaker.name}: ${error.message}`)
        } else {
          results.inserted++
        }
      }

      // Polite delay between requests
      await new Promise(r => setTimeout(r, 1500))

    } catch (e) {
      results.errors.push(`${event.url}: ${e}`)
    }
  }

  return new Response(JSON.stringify(results, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  })
})
