'use client'

import { useEffect, useRef, useState } from 'react'
import {
  type SpeakerFace,
  FIRST_WINDOW,
  STREAM_PAGE,
  fetchSpeakerWindow,
  uniqueHeadshots,
} from '@/lib/speakers'

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function Face({ speaker }: { speaker: SpeakerFace }) {
  const [broken, setBroken] = useState(false)
  const showPhoto = Boolean(speaker.headshot_url) && !broken

  useEffect(() => {
    setBroken(false)
  }, [speaker.id, speaker.headshot_url])

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
          decoding="async"
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
}: {
  speakers: SpeakerFace[]
  direction: 'left' | 'right'
}) {
  const outerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const originRef = useRef(0)
  const phaseRef = useRef(0)
  const [origin, setOrigin] = useState(0)
  const [viewW, setViewW] = useState(0)
  const [slot, setSlot] = useState(76)

  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const measure = () => {
      setViewW(el.clientWidth)
      setSlot(window.matchMedia('(max-width: 767px)').matches ? 60 : 76)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track || speakers.length === 0 || viewW === 0) return

    let raf = 0
    let last = performance.now()
    const sign = direction === 'left' ? 1 : -1

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      const styles = getComputedStyle(track.closest('.speakers-reel') || track)
      const speed = Number(styles.getPropertyValue('--reel-px-per-sec')) || 48
      phaseRef.current += sign * speed * dt
      let stepped = false
      while (phaseRef.current >= slot) {
        phaseRef.current -= slot
        originRef.current += 1
        stepped = true
      }
      while (phaseRef.current < 0) {
        phaseRef.current += slot
        originRef.current -= 1
        stepped = true
      }
      track.style.transform = `translate3d(${-phaseRef.current}px,0,0)`
      if (stepped) setOrigin(originRef.current)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [direction, speakers.length, slot, viewW])

  if (speakers.length === 0) return null

  const n = speakers.length
  const visibleCount = Math.max(8, Math.ceil(viewW / slot) + 8)

  return (
    <div className={`speakers-reel-section speakers-reel-${direction}`}>
      <div ref={outerRef} className="speakers-reel-outer">
        <div className="speakers-reel-fade-left" />
        <div className="speakers-reel-fade-right" />
        <div ref={trackRef} className="speakers-reel-virtual">
          {Array.from({ length: visibleCount }, (_, i) => {
            const speaker = speakers[(((origin + i) % n) + n) % n]
            return (
              <div key={`${speaker.id}-${i}`} className="speakers-reel-slot" style={{ left: i * slot }}>
                <Face speaker={speaker} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

async function streamRemaining(seed: SpeakerFace[]): Promise<SpeakerFace[]> {
  const faces = [...seed]
  for (let from = FIRST_WINDOW; ; from += STREAM_PAGE) {
    const chunk = await fetchSpeakerWindow(from, STREAM_PAGE)
    if (chunk.length === 0) break
    faces.push(...chunk)
    if (chunk.length < STREAM_PAGE) break
  }
  return uniqueHeadshots(faces)
}

export function SpeakersReel({ initialFaces }: { initialFaces: SpeakerFace[] }) {
  const [speakers, setSpeakers] = useState<SpeakerFace[]>(initialFaces)

  useEffect(() => {
    let alive = true
    streamRemaining(initialFaces)
      .then((faces) => {
        if (alive && faces.length > initialFaces.length) setSpeakers(faces)
      })
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [initialFaces])

  const mid = Math.ceil(speakers.length / 2)
  const rowA = speakers.slice(0, Math.max(mid, 1))
  const rowB = speakers.slice(mid)

  return (
    <section className="speakers-reel" aria-label="The CityAge Contributors">
      <div className="speakers-reel-rule">
        <a href="/people.html" className="speakers-reel-kicker">
          The CityAge Contributors
        </a>
        <span className="speakers-reel-count">
          {speakers.length > 3 ? `${speakers.length.toLocaleString()} faces` : 'The reel'}
        </span>
      </div>
      <div className="speakers-reel-stack">
        <ReelRow speakers={rowA} direction="left" />
        {rowB.length > 0 && <ReelRow speakers={rowB} direction="right" />}
      </div>
    </section>
  )
}
