'use client'

import { useMemo, useState } from 'react'
import type { SpeakerFace } from '@/lib/speakers'

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function Face({ speaker }: { speaker: SpeakerFace }) {
  const [broken, setBroken] = useState(false)
  const showPhoto = Boolean(speaker.headshot_url) && !broken

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
          loading="lazy"
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
  duration,
}: {
  speakers: SpeakerFace[]
  direction: 'left' | 'right'
  duration: number
}) {
  const doubled = useMemo(() => [...speakers, ...speakers], [speakers])
  if (speakers.length === 0) return null

  return (
    <div className={`speakers-reel-section speakers-reel-${direction}`}>
      <div className="speakers-reel-outer">
        <div className="speakers-reel-fade-left" />
        <div className="speakers-reel-fade-right" />
        <div
          className="speakers-reel-track"
          style={{ animationDuration: `${duration}s` }}
        >
          {doubled.map((s, i) => (
            <Face key={`${s.id}-${i}`} speaker={s} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SpeakersReel({ speakers }: { speakers: SpeakerFace[] }) {
  if (speakers.length === 0) return null

  const mid = Math.ceil(speakers.length / 2)
  const rowA = speakers.slice(0, mid)
  const rowB = speakers.slice(mid)

  return (
    <section className="speakers-reel" aria-label="The CityAge Contributors">
      <div className="speakers-reel-rule">
        <a href="/people.html" className="speakers-reel-kicker">
          The CityAge Contributors
        </a>
        <span className="speakers-reel-count">
          {speakers.length.toLocaleString()} faces
        </span>
      </div>
      <div className="speakers-reel-stack">
        <ReelRow speakers={rowA} direction="left" duration={95} />
        <ReelRow speakers={rowB} direction="right" duration={115} />
      </div>
    </section>
  )
}
