'use client'

import { useEffect, useState } from 'react'
import { ReelStrip } from '@/components/speakers-reel-strip'
import { fetchSpeakerFaces, shuffle, type SpeakerFace } from '@/lib/speakers'
import './door-speakers-strip.css'

const DOOR_WINDOW = 72

export function DoorSpeakersStrip() {
  const [faces, setFaces] = useState<SpeakerFace[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchSpeakerFaces()
      .then((all) => {
        if (cancelled) return
        const withShots = all.filter((s) => s.headshot_url)
        setTotal(all.length)
        setFaces(shuffle(withShots).slice(0, DOOR_WINDOW))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (faces.length === 0) return null

  return (
    <section className="door-speakers-reel" aria-label="The CityAge Contributors">
      <div className="speakers-reel-rule">
        <a href="/people" className="speakers-reel-kicker">
          The CityAge Contributors
        </a>
        <span className="speakers-reel-count">
          {total > 0 ? `${total.toLocaleString()} faces` : 'The reel'}
        </span>
      </div>
      <ReelStrip faces={faces} direction="left" duration="95s" eagerCount={8} faceHref="/people" />
    </section>
  )
}
