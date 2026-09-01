'use client'

import { useEffect, useRef, useState } from 'react'
import { hasSpeakerShot, type SpeakerFace } from '@/lib/speakers'
import './door-speakers-strip.css'

const FACE_W = 51
const PX_PER_SEC = 18
const SSR_SLOT_COUNT = 28

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
  const [slotCount, setSlotCount] = useState(SSR_SLOT_COUNT)
  const [origin, setOrigin] = useState(0)

  const starters = faces.filter((face) => hasSpeakerShot(face.headshot_url))

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth || window.innerWidth
      setSlotCount(Math.max(12, Math.ceil(w / FACE_W) + 3))
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

  if (starters.length === 0) {
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={speaker.headshot_url}
                  alt=""
                  width={48}
                  height={58}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function DoorSpeakersStrip({
  top,
  bottom,
}: {
  top: SpeakerFace[]
  bottom: SpeakerFace[]
}) {
  return (
    <section className="door-speakers-reel" aria-label="Speakers">
      {top.length > 0 ? <VirtualDoorRow faces={top} reverse={false} href="/people" /> : null}
      {bottom.length > 0 ? <VirtualDoorRow faces={bottom} reverse href="/people" /> : null}
    </section>
  )
}
