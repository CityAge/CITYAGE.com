'use client'

import { useEffect, useMemo, useState } from 'react'

type SpeakerFace = {
  id: string
  name: string
  title: string | null
  organisation: string | null
  headshot_url: string | null
  linkedin_url: string | null
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rniqmxpmtqmnwqtawlnz.supabase.co'
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaXFteHBtdHFtbndxdGF3bG56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwMTAyMzEsImV4cCI6MjA4NTU4NjIzMX0.m3jrPO52RU7SW3h8ypSIUyhI17sF0RVufaO7mlex6EQ'
const PAGE = 1000

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function Face({ speaker }: { speaker: SpeakerFace }) {
  const [broken, setBroken] = useState(false)
  const showPhoto = Boolean(speaker.headshot_url) && !broken

  return (
    <a
      className="speakers-reel-face"
      href={speaker.linkedin_url || '/people.html'}
      target={speaker.linkedin_url ? '_blank' : undefined}
      rel={speaker.linkedin_url ? 'noopener noreferrer' : undefined}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={speaker.headshot_url!}
          alt={speaker.name}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className="speakers-reel-placeholder">
          <span>{initials(speaker.name)}</span>
        </div>
      )}
      <div className="speakers-reel-overlay">
        <div className="speakers-reel-name">{speaker.name}</div>
        {speaker.organisation && (
          <div className="speakers-reel-org">{speaker.organisation}</div>
        )}
      </div>
    </a>
  )
}

function ReelRow({
  speakers,
  direction,
  duration,
}: {
  speakers: SpeakerFace[]
  direction: 'left' | 'right'
  duration: number
}) {
  const doubled = useMemo(() => [...speakers, ...speakers], [speakers])
  if (speakers.length === 0) return null

  return (
    <div className={`speakers-reel-section speakers-reel-${direction}`}>
      <div className="speakers-reel-outer">
        <div className="speakers-reel-fade-left" />
        <div className="speakers-reel-fade-right" />
        <div
          className="speakers-reel-track"
          style={{ animationDuration: `${duration}s` }}
        >
          {doubled.map((s, i) => (
            <Face key={`${s.id}-${i}`} speaker={s} />
          ))}
        </div>
      </div>
    </div>
  )
}

async function fetchFaces(): Promise<SpeakerFace[]> {
  const faces: SpeakerFace[] = []
  for (let from = 0; ; from += PAGE) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/speakers?select=id,name,title,organisation,headshot_url,linkedin_url&order=id`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
          Range: `${from}-${from + PAGE - 1}`,
        },
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
}

export function SpeakersReel() {
  const [speakers, setSpeakers] = useState<SpeakerFace[]>([])

  useEffect(() => {
    let alive = true
    fetchFaces().then((faces) => {
      if (alive) setSpeakers(faces)
    }).catch(() => {})
    return () => { alive = false }
  }, [])

  const mid = Math.ceil(speakers.length / 2)
  const rowA = speakers.slice(0, mid)
  const rowB = speakers.slice(mid)

  return (
    <section className="speakers-reel" aria-label="The CityAge Contributors">
      <div className="speakers-reel-rule">
        <a href="/people.html" className="speakers-reel-kicker">
          The CityAge Contributors
        </a>
        <span className="speakers-reel-count">
          {speakers.length > 0 ? `${speakers.length.toLocaleString()} faces` : 'The reel'}
        </span>
      </div>
      <div className="speakers-reel-stack">
        {speakers.length === 0 ? (
          <div className="speakers-reel-section speakers-reel-left">
            <div className="speakers-reel-outer">
              <div className="speakers-reel-track" style={{ minHeight: 86 }} />
            </div>
          </div>
        ) : (
          <>
            <ReelRow speakers={rowA} direction="left" duration={95} />
            <ReelRow speakers={rowB} direction="right" duration={115} />
          </>
        )}
      </div>
    </section>
  )
}
