import type { SpeakerFace } from '@/lib/speakers'

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function ReelFace({
  speaker,
  href,
  eager = false,
}: {
  speaker: SpeakerFace
  href?: string
  eager?: boolean
}) {
  const dest = href ?? speaker.linkedin_url ?? undefined

  const inner = (
    <>
      {speaker.headshot_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={speaker.headshot_url}
          alt={speaker.name}
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
        {speaker.organisation && <div className="speakers-reel-org">{speaker.organisation}</div>}
      </div>
    </>
  )

  if (dest) {
    return (
      <a
        className="speakers-reel-face"
        href={dest}
        target={dest.startsWith('http') ? '_blank' : undefined}
        rel={dest.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </a>
    )
  }

  return <div className="speakers-reel-face">{inner}</div>
}

export function ReelStrip({
  faces,
  direction,
  duration,
  eagerCount = 0,
  faceHref,
}: {
  faces: SpeakerFace[]
  direction: 'left' | 'right'
  duration: string
  eagerCount?: number
  faceHref?: string
}) {
  if (faces.length === 0) return null
  const loop = [...faces, ...faces]

  return (
    <div className={`speakers-reel-section speakers-reel-${direction}`}>
      <div className="speakers-reel-outer">
        <div className="speakers-reel-fade-left" />
        <div className="speakers-reel-fade-right" />
        <div className="speakers-reel-track" style={{ animationDuration: duration }}>
          {loop.map((speaker, i) => (
            <ReelFace
              key={`${speaker.id}-${i}`}
              speaker={speaker}
              href={faceHref}
              eager={i < eagerCount}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
