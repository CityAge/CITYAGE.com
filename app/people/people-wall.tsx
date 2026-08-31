'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { hasSpeakerShot, shuffle, type SpeakerFace } from '@/lib/speakers'
import './people.css'

const FACE_W = 116
const SPEEDS = [48, 40, 44, 36] as const
const REVERSE = [false, true, false, true] as const

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function VirtualPeopleRow({
  faces,
  reverse,
  pxPerSec,
  paused,
}: {
  faces: SpeakerFace[]
  reverse: boolean
  pxPerSec: number
  paused: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef(false)
  const originRef = useRef(0)
  const [slotCount, setSlotCount] = useState(0)
  const [origin, setOrigin] = useState(0)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth || window.innerWidth
      setSlotCount(Math.max(8, Math.ceil(w / FACE_W) + 3))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track || slotCount === 0 || faces.length === 0) return

    let raf = 0
    let last = performance.now()
    let shift = 0

    const tick = (now: number) => {
      const dt = Math.min(48, now - last)
      last = now
      if (!hoverRef.current && !paused && document.visibilityState === 'visible') {
        shift += pxPerSec * (dt / 1000)
        while (shift >= FACE_W) {
          shift -= FACE_W
          originRef.current = reverse
            ? (originRef.current - 1 + faces.length) % faces.length
            : (originRef.current + 1) % faces.length
          setOrigin(originRef.current)
        }
        const x = reverse ? shift - FACE_W : -shift
        track.style.transform = `translate3d(${x}px,0,0)`
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [faces.length, paused, pxPerSec, reverse, slotCount])

  if (faces.length === 0 || slotCount === 0) {
    return <div ref={wrapRef} className="speakers-reel-section" />
  }

  return (
    <div
      ref={wrapRef}
      className={`speakers-reel-section speakers-reel-${reverse ? 'right' : 'left'}`}
      onMouseEnter={() => {
        hoverRef.current = true
      }}
      onMouseLeave={() => {
        hoverRef.current = false
      }}
    >
      <div className="speakers-reel-outer">
        <div className="speakers-reel-fade-left" />
        <div className="speakers-reel-fade-right" />
        <div ref={trackRef} className="speakers-reel-track people-virtual-track">
          {Array.from({ length: slotCount }, (_, i) => {
            const speaker = faces[(origin + i) % faces.length]
            if (!speaker) return null
            const dest = speaker.linkedin_url || undefined
            const inner = (
              <>
                {hasSpeakerShot(speaker.headshot_url) ? (
                  <Image
                    src={speaker.headshot_url}
                    alt=""
                    fill
                    sizes="110px"
                    loading="lazy"
                    draggable={false}
                    onError={(event) => {
                      event.currentTarget.closest('.speakers-reel-face')?.remove()
                    }}
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
              </>
            )
            if (dest) {
              return (
                <a
                  key={`${speaker.id}-${i}`}
                  className="speakers-reel-face"
                  href={dest}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {inner}
                </a>
              )
            }
            return (
              <div key={`${speaker.id}-${i}`} className="speakers-reel-face">
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function PeopleWall() {
  const [speakers, setSpeakers] = useState<SpeakerFace[]>([])
  const [rows, setRows] = useState<SpeakerFace[][]>([[], [], [], []])
  const [query, setQuery] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/people-faces')
      .then((res) => (res.ok ? res.json() : []))
      .then((all: SpeakerFace[]) => {
        if (cancelled || !Array.isArray(all)) return
        setSpeakers(all)
        const shuffled = shuffle(all)
        const chunk = Math.ceil(shuffled.length / 4) || 1
        setRows([
          shuffled.slice(0, chunk),
          shuffled.slice(chunk, chunk * 2),
          shuffled.slice(chunk * 2, chunk * 3),
          shuffled.slice(chunk * 3),
        ])
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return speakers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.title || '').toLowerCase().includes(q) ||
        (s.organisation || '').toLowerCase().includes(q),
    )
  }, [query, speakers])

  const searching = query.trim().length > 0

  return (
    <div id="people-wall" className={searching ? 'is-searching' : undefined}>
      <div className="reel-stack" aria-label="The CityAge Contributors">
        {failed ? (
          <div className="people-loading">Unable to load speakers</div>
        ) : speakers.length === 0 ? (
          <div className="people-loading">Loading</div>
        ) : (
          rows.map((faces, i) => (
            <div key={i} className={`reel-section reel-${i + 1}`}>
              <VirtualPeopleRow
                faces={faces}
                reverse={REVERSE[i]}
                pxPerSec={SPEEDS[i]}
                paused={searching}
              />
            </div>
          ))
        )}
      </div>

      <section className="people-search">
        <span className="people-search-label">Search the network.</span>
        <div className="people-search-wrap">
          <input
            className="people-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, title, or organisation…"
            autoComplete="off"
          />
          {searching && (
            <button type="button" className="people-search-clear" onClick={() => setQuery('')}>
              Clear ×
            </button>
          )}
        </div>
      </section>

      {searching && (
        <section className="people-results">
          <div className="people-results-count">
            <span>{matches.length}</span> result{matches.length === 1 ? '' : 's'} for “{query.trim()}”
          </div>
          {matches.length === 0 ? (
            <div className="people-empty">No matches found.</div>
          ) : (
            <div className="people-results-grid">
              {matches.map((s) => (
                <a
                  key={s.id}
                  className="people-result"
                  href={s.linkedin_url || undefined}
                  target={s.linkedin_url ? '_blank' : undefined}
                  rel={s.linkedin_url ? 'noopener noreferrer' : undefined}
                >
                  <div className="people-result-thumb">
                    {hasSpeakerShot(s.headshot_url) ? (
                      <Image
                        src={s.headshot_url}
                        alt=""
                        fill
                        sizes="44px"
                        loading="lazy"
                      />
                    ) : (
                      <span className="people-result-initials">{initials(s.name)}</span>
                    )}
                  </div>
                  <div>
                    <div className="people-result-name">{s.name}</div>
                    {s.title && <div className="people-result-title">{s.title}</div>}
                    {s.organisation && <div className="people-result-org">{s.organisation}</div>}
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
