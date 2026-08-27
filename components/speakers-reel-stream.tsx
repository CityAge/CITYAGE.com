'use client'

import { useEffect, useState } from 'react'
import { ReelStrip } from '@/components/speakers-reel-strip'
import {
  type SpeakerFace,
  FIRST_WINDOW,
  REEL_WINDOW,
  fetchSpeakerWindow,
  uniqueHeadshots,
} from '@/lib/speakers'

export function SpeakersReelStream({ seed }: { seed: SpeakerFace[] }) {
  const [desktopRow, setDesktopRow] = useState<SpeakerFace[] | null>(null)

  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)')
    if (!wide.matches) return

    let alive = true
    const start = window.setTimeout(async () => {
      const { faces } = await fetchSpeakerWindow(FIRST_WINDOW, REEL_WINDOW)
      if (!alive) return
      const next = uniqueHeadshots(faces).slice(0, REEL_WINDOW)
      setDesktopRow(next.length > 0 ? next : seed)
    }, 1600)

    return () => {
      alive = false
      window.clearTimeout(start)
    }
  }, [seed])

  if (!desktopRow || desktopRow.length === 0) return null

  return (
    <div className="speakers-reel-desktop-only">
      <ReelStrip faces={desktopRow} direction="right" />
    </div>
  )
}
