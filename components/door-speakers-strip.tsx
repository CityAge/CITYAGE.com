import { hasSpeakerShot, type SpeakerFace } from '@/lib/speakers'
import './door-speakers-strip.css'

/** 48px face + 3px gap: the distance the track travels per face. */
const FACE_W = 51
const PX_PER_SEC = 18
/** Widest door we expect to fill; the row is repeated until it covers this plus one loop. */
const MAX_DOOR_W = 2600

function DoorRow({
  faces,
  reverse,
  href,
}: {
  faces: SpeakerFace[]
  reverse: boolean
  href: string
}) {
  const shots = faces.filter((face) => hasSpeakerShot(face.headshot_url))
  if (shots.length === 0) return null

  // One loop = one full copy of the row. Copies beyond the first exist only so
  // the track never runs out before the loop point; the seam is invisible
  // because every copy is identical. No state changes while it moves.
  const loopWidth = shots.length * FACE_W
  const copies = Math.max(2, Math.ceil(MAX_DOOR_W / loopWidth) + 1)
  const track = Array.from({ length: copies }, () => shots).flat()

  return (
    <div className={`speakers-reel-section speakers-reel-${reverse ? 'right' : 'left'}`}>
      <div className="speakers-reel-outer">
        <div className="speakers-reel-fade-left" />
        <div className="speakers-reel-fade-right" />
        <div
          className="speakers-reel-track"
          style={
            {
              '--reel-w': `${loopWidth}px`,
              '--reel-s': `${loopWidth / PX_PER_SEC}s`,
            } as React.CSSProperties
          }
        >
          {track.map((speaker, i) => {
            const duplicate = i >= shots.length
            return (
              <a
                key={`${speaker.id}-${i}`}
                className="speakers-reel-face"
                href={href}
                aria-hidden={duplicate || undefined}
                tabIndex={duplicate ? -1 : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={speaker.headshot_url ?? undefined}
                  alt=""
                  width={48}
                  height={58}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
                {speaker.name ? <span className="speakers-reel-name">{speaker.name}</span> : null}
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
      {top.length > 0 ? <DoorRow faces={top} reverse={false} href="/people" /> : null}
      {bottom.length > 0 ? <DoorRow faces={bottom} reverse href="/people" /> : null}
    </section>
  )
}
