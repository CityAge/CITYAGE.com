import { ReelStrip } from '@/components/speakers-reel-strip'
import { SpeakersReelStream } from '@/components/speakers-reel-stream'
import type { SpeakerFace } from '@/lib/speakers'

export function SpeakersReel({
  initialFaces,
  total,
}: {
  initialFaces: SpeakerFace[]
  total: number | null
}) {
  const countLabel =
    total && total > initialFaces.length
      ? `${total.toLocaleString()} faces`
      : initialFaces.length > 3
        ? `${initialFaces.length.toLocaleString()} faces`
        : 'The reel'

  return (
    <section className="speakers-reel" aria-label="The CityAge Contributors">
      <div className="speakers-reel-rule">
        <a href="/people.html" className="speakers-reel-kicker">
          The CityAge Contributors
        </a>
        <span className="speakers-reel-count">{countLabel}</span>
      </div>
      <div className="speakers-reel-stack">
        <ReelStrip faces={initialFaces} direction="left" eagerCount={6} />
        <SpeakersReelStream seed={initialFaces} />
      </div>
    </section>
  )
}
