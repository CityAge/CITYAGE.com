'use client'

import { useEffect, useState } from 'react'
import { ReelStrip } from '@/components/speakers-reel-strip'
import { fetchSpeakerFaces, shuffle, type SpeakerFace } from '@/lib/speakers'
import './door-speakers-strip.css'

const DOOR_WINDOW = 96

export function DoorSpeakersStrip() {
  const [top, setTop] = useState<SpeakerFace[]>([])
  const [bottom, setBottom] = useState<SpeakerFace[]>([])

  useEffect(() => {
    let cancelled = false
    fetchSpeakerFaces()
      .then((all) => {
        if (cancelled) return
        const withShots = shuffle(all.filter((s) => s.headshot_url)).slice(0, DOOR_WINDOW)
        const mid = Math.ceil(withShots.length / 2)
        setTop(withShots.slice(0, mid))
        setBottom(withShots.slice(mid))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (top.length === 0 && bottom.length === 0) return null

  return (
    <section className="door-speakers-reel" aria-label="Speakers">
      <ReelStrip faces={top} direction="left" duration="110s" eagerCount={8} faceHref="/people" />
      <ReelStrip faces={bottom} direction="right" duration="130s" eagerCount={8} faceHref="/people" />
    </section>
  )
}
