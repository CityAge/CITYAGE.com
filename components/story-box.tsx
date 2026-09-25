import Link from 'next/link'
import type { SectionStory } from '@/lib/magazine'

/**
 * The one story box, everywhere except the lead: optional image (16:10),
 * kicker, headline as a link,
 * N MIN READ. Images do nothing on hover.
 */
export function StoryBox({ story }: { story: SectionStory }) {
  const href = `/magazine/${story.id}`

  return (
    <article className="story-box">
      {story.image_url ? (
        <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
          <div
            className="ca-photo relative w-full overflow-hidden bg-[#EFEDE6] aspect-[16/10]"
            style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16 / 10' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={story.image_url} alt="" className="object-cover" loading="lazy" decoding="async" />
          </div>
        </Link>
      ) : null}
      <span className={`type-kicker block ${story.image_url ? 'mt-4' : ''}`}>{story.vertical}</span>
      <h3 className="type-rail-h mt-2">
        <Link href={href} className="story-link">
          {story.headline}
        </Link>
      </h3>
      <span className="type-meta block mt-3">{story.readMin} min read</span>
    </article>
  )
}
