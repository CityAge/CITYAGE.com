import type { SpeakerFace } from '@/lib/speakers'
import { speakerThumbSrc } from '@/lib/speakers'

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

export function ReelFace({
  speaker,
  eager = false,
}: {
  speaker: SpeakerFace
  eager?: boolean
}) {
  const src = speakerThumbSrc(speaker.headshot_url)

  return (
    <a
      className="speakers-reel-face"
      href={speaker.linkedin_url || '/people.html'}
      target={speaker.linkedin_url ? '_blank' : undefined}
      rel={speaker.linkedin_url ? 'noopener noreferrer' : undefined}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={speaker.name}
          width={72}
          height={86}
          decoding="async"
          loading={eager ? 'eager' : 'lazy'}
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

export function ReelStrip({
  faces,
  direction,
  eagerCount = 0,
}: {
  faces: SpeakerFace[]
  direction: 'left' | 'right'
  eagerCount?: number
}) {
  if (faces.length === 0) return null
  const loop = [...faces, ...faces]

  return (
    <div className={`speakers-reel-section speakers-reel-${direction}`}>
      <div className="speakers-reel-outer">
        <div className="speakers-reel-fade-left" />
        <div className="speakers-reel-fade-right" />
        <div className="speakers-reel-track">
          {loop.map((speaker, i) => (
            <ReelFace
              key={`${speaker.id}-${i}`}
              speaker={speaker}
              eager={i < eagerCount}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
