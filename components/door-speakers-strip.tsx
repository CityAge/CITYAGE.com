'use client'

import { useEffect, useRef, useState } from 'react'
import { fetchDoorSpeakerFaces, shuffle, type SpeakerFace } from '@/lib/speakers'
import './door-speakers-strip.css'

const FACE_W = 51
const PX_PER_SEC = 18
const DOOR_LIMIT = 48

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
  const facesRef = useRef(faces)
  const [slotCount, setSlotCount] = useState(0)

  useEffect(() => {
    facesRef.current = faces
  }, [faces])

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
    let cursor = 0
    const nodes = Array.from(track.children) as HTMLElement[]

    const faceAt = (index: number) => {
      const list = facesRef.current
      if (list.length === 0) return null
      return list[((index % list.length) + list.length) % list.length]
    }

    const paint = (node: HTMLElement, index: number) => {
      const speaker = faceAt(index)
      const img = node.querySelector('img')
      if (!speaker || !img) return
      const next = speaker.headshot_url || ''
      if (img.dataset.src !== next) {
        img.dataset.src = next
        img.src = next
      }
    }

    nodes.forEach((node, i) => paint(node, i))

    const tick = (now: number) => {
      const dt = Math.min(48, now - last)
      last = now
      if (!hoverRef.current && document.visibilityState === 'visible') {
        shift += PX_PER_SEC * (dt / 1000)
        while (shift >= FACE_W) {
          shift -= FACE_W
          if (reverse) {
            cursor = (cursor - 1 + facesRef.current.length) % facesRef.current.length
            const lastNode = nodes.pop()
            if (lastNode) {
              nodes.unshift(lastNode)
              track.insertBefore(lastNode, track.firstChild)
              paint(lastNode, cursor)
            }
          } else {
            cursor = (cursor + 1) % facesRef.current.length
            const first = nodes.shift()
            if (first) {
              nodes.push(first)
              track.appendChild(first)
              paint(first, cursor + nodes.length - 1)
            }
          }
        }
        const x = reverse ? shift - FACE_W : -shift
        track.style.transform = `translate3d(${x}px,0,0)`
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [faces.length, reverse, slotCount])

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
            const speaker = faces[i % faces.length]
            return (
              <a key={i} className="speakers-reel-face" href={href}>
                {speaker?.headshot_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={speaker.headshot_url}
                    alt=""
                    width={48}
                    height={58}
                    decoding="async"
                    loading="lazy"
                    draggable={false}
                    data-src={speaker.headshot_url}
                  />
                ) : (
                  <span />
                )}
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
      fetchDoorSpeakerFaces(DOOR_LIMIT)
        .then((all) => {
          if (cancelled) return
          const ready = shuffle(all.filter((s) => s.headshot_url))
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
