'use client'

import Image from 'next/image'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { hasSpeakerShot, shuffle, type SpeakerFace } from '@/lib/speakers'
import './people.css'

const FACE_W = 116
const SPEEDS = [48, 40, 44, 36] as const
const REVERSE = [false, true, false, true] as const
const PREFETCH_AHEAD = 12
const heldThumbs = new Set<string>()

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function optimizerThumb(src: string, width = 128) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`
}

function holdThumb(src: string | null | undefined) {
  if (!src || heldThumbs.has(src) || typeof window === 'undefined') return
  heldThumbs.add(src)
  const img = new window.Image()
  img.decoding = 'async'
  img.src = optimizerThumb(src)
}

function HeldThumb({ src }: { src: string }) {
  const [shown, setShown] = useState(src)
  const [pending, setPending] = useState<string | null>(null)

  useEffect(() => {
    holdThumb(src)
    if (src === shown) {
      setPending(null)
      return
    }
    setPending(src)
  }, [src, shown])

  return (
    <>
      <Image
        src={shown}
        alt=""
        fill
        sizes="110px"
        loading="eager"
        draggable={false}
      />
      {pending && pending !== shown ? (
        <Image
          src={pending}
          alt=""
          fill
          sizes="110px"
          loading="eager"
          draggable={false}
          className="people-thumb-pending"
          onLoad={() => setShown(pending)}
        />
      ) : null}
    </>
  )
}

function FaceTile({ speaker }: { speaker: SpeakerFace }) {
  const dest = speaker.linkedin_url || undefined
  const inner = (
    <>
      {hasSpeakerShot(speaker.headshot_url) ? (
        <HeldThumb src={speaker.headshot_url} />
      ) : (
        <div className="speakers-reel-placeholder">
          <span>{initials(speaker.name)}</span>
        </div>
      )}
      <div className="speakers-reel-overlay">
        <div className="speakers-reel-name">{speaker.name}</div>
        {speaker.organisation && <div className="speakers-reel-org">{speaker.organisation}</div>}
      </div>
    </>
  )

  if (dest) {
    return (
      <a className="speakers-reel-face" href={dest} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    )
  }
  return <div className="speakers-reel-face">{inner}</div>
}

type Slot = { id: number; index: number }

function VirtualPeopleRow({
  faces,
  reverse,
  pxPerSec,
  paused,
  startOffset,
}: {
  faces: SpeakerFace[]
  reverse: boolean
  pxPerSec: number
  paused: boolean
  startOffset: number
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef(false)
  const pausedRef = useRef(paused)
  const facesRef = useRef(faces)
  const reverseRef = useRef(reverse)
  const slotsRef = useRef<Slot[]>([])
  const shiftRef = useRef(0)
  const skipTransformRef = useRef(false)
  const [slotCount, setSlotCount] = useState(0)
  const [slots, setSlots] = useState<Slot[]>([])

  pausedRef.current = paused
  facesRef.current = faces
  reverseRef.current = reverse
  slotsRef.current = slots

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth || window.innerWidth
      setSlotCount(Math.max(10, Math.ceil(w / FACE_W) + 5))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (slotCount === 0 || faces.length === 0) return
    const origin = ((startOffset % faces.length) + faces.length) % faces.length
    const next = Array.from({ length: slotCount }, (_, i) => ({
      id: i,
      index: (origin + i) % faces.length,
    }))
    slotsRef.current = next
    setSlots(next)
    for (const slot of next) holdThumb(faces[slot.index]?.headshot_url)
    for (let n = 1; n <= PREFETCH_AHEAD; n++) {
      holdThumb(faces[(origin + slotCount + n - 1) % faces.length]?.headshot_url)
    }
  }, [faces, slotCount, startOffset])

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track || slots.length === 0) return
    const shift = shiftRef.current
    const x = reverseRef.current ? shift - FACE_W : -shift
    track.style.transform = `translate3d(${x}px,0,0)`
    skipTransformRef.current = false
  }, [slots])

  useEffect(() => {
    const track = trackRef.current
    if (!track || slotCount === 0 || faces.length === 0) return

    let raf = 0
    let last = performance.now()

    const recycle = () => {
      const pool = facesRef.current
      const goingRight = reverseRef.current
      const current = slotsRef.current
      if (current.length === 0 || pool.length === 0) return

      const next = [...current]
      if (goingRight) {
        const recycled = { ...next.pop()! }
        const first = next[0]
        recycled.index = (first.index - 1 + pool.length) % pool.length
        next.unshift(recycled)
        holdThumb(pool[recycled.index]?.headshot_url)
        for (let n = 1; n <= PREFETCH_AHEAD; n++) {
          holdThumb(pool[(recycled.index - n + pool.length) % pool.length]?.headshot_url)
        }
      } else {
        const recycled = { ...next.shift()! }
        const lastSlot = next[next.length - 1]
        recycled.index = (lastSlot.index + 1) % pool.length
        next.push(recycled)
        holdThumb(pool[recycled.index]?.headshot_url)
        for (let n = 1; n <= PREFETCH_AHEAD; n++) {
          holdThumb(pool[(recycled.index + n) % pool.length]?.headshot_url)
        }
      }
      skipTransformRef.current = true
      slotsRef.current = next
      setSlots(next)
    }

    const tick = (now: number) => {
      const dt = Math.min(48, now - last)
      last = now
      if (!hoverRef.current && !pausedRef.current && document.visibilityState === 'visible') {
        shiftRef.current += pxPerSec * (dt / 1000)
        while (shiftRef.current >= FACE_W) {
          shiftRef.current -= FACE_W
          recycle()
        }
        if (!skipTransformRef.current) {
          const x = reverseRef.current ? shiftRef.current - FACE_W : -shiftRef.current
          track.style.transform = `translate3d(${x}px,0,0)`
        }
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [faces.length, pxPerSec, slotCount, slots.length])

  return (
    <div
      ref={wrapRef}
      className={`speakers-reel-section speakers-reel-${reverse ? 'right' : 'left'}`}
      data-pool-size={faces.length}
      data-dom-tiles={slots.length}
      data-start-offset={startOffset}
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
          {slots.map((slot) => {
            const speaker = faces[slot.index]
            if (!speaker) return null
            return (
              <div key={slot.id} className="people-slot">
                <FaceTile speaker={speaker} />
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
  const [query, setQuery] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/people-faces')
      .then((res) => (res.ok ? res.json() : []))
      .then((all: SpeakerFace[]) => {
        if (cancelled || !Array.isArray(all)) return
        // One shuffle, four windows. Each strip walks the whole catalog, then loops.
        setSpeakers(shuffle(all))
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
    <div
      id="people-wall"
      className={searching ? 'is-searching' : undefined}
      data-catalog-size={speakers.length}
    >
      <div className="reel-stack" aria-label="The CityAge Contributors">
        {failed ? (
          <div className="people-loading">Unable to load speakers</div>
        ) : speakers.length === 0 ? (
          <div className="people-loading">Loading</div>
        ) : (
          REVERSE.map((_, i) => (
            <div key={i} className={`reel-section reel-${i + 1}`}>
              <VirtualPeopleRow
                faces={speakers}
                startOffset={Math.floor((speakers.length * i) / 4)}
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

      <section className="people-results" hidden={!searching} aria-hidden={!searching}>
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
                    <Image src={s.headshot_url} alt="" fill sizes="44px" loading="lazy" />
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
    </div>
  )
}
