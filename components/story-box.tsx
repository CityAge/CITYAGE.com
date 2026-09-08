import Link from 'next/link'
import type { SectionStory } from '@/lib/magazine'

/**
 * The one story box, everywhere except the lead: image (16:10) or a flat
 * cream tile with the kicker in its corner, kicker, headline as a link,
 * N MIN READ. Images do nothing on hover.
 */
export function StoryBox({ story }: { story: SectionStory }) {
  const href = `/magazine/${story.id}`

  return (
    <article className="story-box">
      <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
        {story.image_url ? (
          <div
            className="ca-photo relative w-full overflow-hidden bg-[#EFEDE6] aspect-[16/10]"
            style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16 / 10' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={story.image_url} alt="" className="object-cover" loading="lazy" decoding="async" />
          </div>
        ) : (
          <div
            className="relative w-full bg-[#EFEDE6] aspect-[16/10]"
            style={{ aspectRatio: '16 / 10' }}
          >
            <span className="type-kicker absolute left-4 bottom-4">{story.vertical}</span>
          </div>
        )}
      </Link>
      {story.image_url ? <span className="type-kicker block mt-4">{story.vertical}</span> : null}
      <h3 className={`type-rail-h ${story.image_url ? 'mt-2' : 'mt-4'}`}>
        <Link href={href} className="story-link">
          {story.headline}
        </Link>
      </h3>
      <span className="type-meta block mt-3">{story.readMin} min read</span>
    </article>
  )
}
