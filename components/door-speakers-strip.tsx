'use client'

import { useEffect, useRef, useState } from 'react'
import { fetchDoorSpeakerFaces, hasSpeakerShot, shuffle, type SpeakerFace } from '@/lib/speakers'
import './door-speakers-strip.css'

const FACE_W = 51
const PX_PER_SEC = 18
const DOOR_FETCH = 80
const DOOR_KEEP = 48

function decodeShot(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.onload = () => resolve(img.naturalWidth >= 20 && img.naturalHeight >= 20)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

async function onlyLoadedFaces(faces: SpeakerFace[]): Promise<SpeakerFace[]> {
  const checked = await Promise.all(
    faces.map(async (face) => {
      if (!hasSpeakerShot(face.headshot_url)) return null
      return (await decodeShot(face.headshot_url)) ? face : null
    }),
  )
  return checked.filter((face): face is SpeakerFace => face != null)
}

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
      if (!speaker || !hasSpeakerShot(speaker.headshot_url) || !img) {
        const at = nodes.indexOf(node)
        if (at >= 0) nodes.splice(at, 1)
        node.remove()
        return
      }
      const next = speaker.headshot_url
      if (img.dataset.src !== next) {
        img.dataset.src = next
        img.src = next
      }
    }

    nodes.forEach((node, i) => paint(node, i))

    const tick = (now: number) => {
      const dt = Math.min(48, now - last)
      last = now
      if (!hoverRef.current && document.visibilityState === 'visible' && facesRef.current.length > 0) {
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

  const starters = faces.filter((face) => hasSpeakerShot(face.headshot_url))
  if (starters.length === 0) return null

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
            const speaker = starters[i % starters.length]
            if (!speaker?.headshot_url) return null
            return (
              <a key={i} className="speakers-reel-face" href={href}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={speaker.headshot_url}
                  alt=""
                  width={48}
                  height={58}
                  decoding="async"
                  draggable={false}
                  data-src={speaker.headshot_url}
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
      fetchDoorSpeakerFaces(DOOR_FETCH)
        .then((all) => onlyLoadedFaces(shuffle(all)))
        .then((ready) => {
          if (cancelled) return
          const keep = ready.slice(0, DOOR_KEEP)
          if (keep.length < 8) return
          const mid = Math.ceil(keep.length / 2)
          setTop(keep.slice(0, mid))
          setBottom(keep.slice(mid))
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
