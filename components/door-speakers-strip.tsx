'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { hasSpeakerShot, shuffle, type SpeakerFace } from '@/lib/speakers'
import './door-speakers-strip.css'

const FACE_W = 51
const PX_PER_SEC = 18
const DOOR_KEEP = 48

function VirtualDoorRow({
  faces,
  reverse,
  href,
}: {
  faces: SpeakerFace[]
  reverse: boolean
  href: string
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const hoverRef = useRef(false)
  const originRef = useRef(0)
  const [slotCount, setSlotCount] = useState(0)
  const [origin, setOrigin] = useState(0)

  const starters = faces.filter((face) => hasSpeakerShot(face.headshot_url))

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
    if (!track || slotCount === 0 || starters.length === 0) return

    let raf = 0
    let last = performance.now()
    let shift = 0

    const tick = (now: number) => {
      const dt = Math.min(48, now - last)
      last = now
      if (!hoverRef.current && document.visibilityState === 'visible') {
        shift += PX_PER_SEC * (dt / 1000)
        while (shift >= FACE_W) {
          shift -= FACE_W
          originRef.current = reverse
            ? (originRef.current - 1 + starters.length) % starters.length
            : (originRef.current + 1) % starters.length
          setOrigin(originRef.current)
        }
        const x = reverse ? shift - FACE_W : -shift
        track.style.transform = `translate3d(${x}px,0,0)`
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reverse, slotCount, starters.length])

  if (starters.length === 0 || slotCount === 0) {
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
        <div ref={trackRef} className="speakers-reel-track">
          {Array.from({ length: slotCount }, (_, i) => {
            const speaker = starters[(origin + i) % starters.length]
            if (!speaker?.headshot_url) return null
            return (
              <a key={i} className="speakers-reel-face" href={href}>
                <Image
                  src={speaker.headshot_url}
                  alt=""
                  fill
                  sizes="48px"
                  loading="lazy"
                  draggable={false}
                  onError={(event) => {
                    event.currentTarget.closest('a')?.remove()
                  }}
                />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function DoorSpeakersStrip() {
  const rootRef = useRef<HTMLElement>(null)
  const [top, setTop] = useState<SpeakerFace[]>([])
  const [bottom, setBottom] = useState<SpeakerFace[]>([])

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let cancelled = false
    let idleId = 0

    const load = () => {
      fetch('/api/door-faces')
        .then((res) => (res.ok ? res.json() : []))
        .then((all: SpeakerFace[]) => {
          if (cancelled || !Array.isArray(all)) return
          const ready = shuffle(all.filter((face) => hasSpeakerShot(face.headshot_url))).slice(
            0,
            DOOR_KEEP,
          )
          if (ready.length < 8) return
          const mid = Math.ceil(ready.length / 2)
          setTop(ready.slice(0, mid))
          setBottom(ready.slice(mid))
        })
        .catch(() => {})
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        const ric = window.requestIdleCallback
        if (typeof ric === 'function') {
          idleId = ric(load, { timeout: 1600 })
        } else {
          load()
        }
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(el)

    return () => {
      cancelled = true
      io.disconnect()
      if (idleId && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId)
      }
    }
  }, [])

  return (
    <section ref={rootRef} className="door-speakers-reel" aria-label="Speakers">
      {top.length > 0 ? <VirtualDoorRow faces={top} reverse={false} href="/people" /> : null}
      {bottom.length > 0 ? <VirtualDoorRow faces={bottom} reverse href="/people" /> : null}
    </section>
  )
}
