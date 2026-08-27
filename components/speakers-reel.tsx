import { ReelStrip } from '@/components/speakers-reel-strip'
import { REEL_WINDOW, type SpeakerFace } from '@/lib/speakers'

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

  const row1 = initialFaces.slice(0, REEL_WINDOW)
  const row2 = initialFaces.slice(REEL_WINDOW, REEL_WINDOW * 2)
  const desktopRow = row2.length >= 8 ? row2 : row1

  return (
    <section className="speakers-reel" aria-label="The CityAge Contributors">
      <div className="speakers-reel-rule">
        <a href="/people.html" className="speakers-reel-kicker">
          The CityAge Contributors
        </a>
        <span className="speakers-reel-count">{countLabel}</span>
      </div>
      <div className="speakers-reel-stack">
        <ReelStrip faces={row1} direction="left" eagerCount={8} />
        {desktopRow.length > 0 && (
          <div className="speakers-reel-desktop-only">
            <ReelStrip faces={desktopRow} direction="right" />
          </div>
        )}
      </div>
    </section>
  )
}
