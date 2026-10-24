import Link from 'next/link'
import { storyHref, type SectionStory } from '@/lib/magazine'

/**
 * The one story box, everywhere except the lead: image (16:10), kicker,
 * headline as a link, N MIN READ. With no image: kicker, headline, deck. Images do nothing on hover.
 */
export function StoryBox({ story }: { story: SectionStory }) {
  const href = storyHref(story)

  // No photograph: a text-only box (kicker, headline, deck), never an empty tile.
  if (!story.image_url) {
    return (
      <article className="story-box">
        <span className="type-kicker block">{story.vertical}</span>
        <h3 className="type-rail-h mt-2">
          <Link href={href} className="story-link">
            {story.headline}
          </Link>
        </h3>
        {story.deck ? <p className="type-deck text-black/60 mt-3">{story.deck}</p> : null}
        <span className="type-meta block mt-3">{story.readMin} min read</span>
      </article>
    )
  }

  return (
    <article className="story-box">
      <Link href={href} className="block" tabIndex={-1} aria-hidden="true">
        <div
          className="ca-photo relative w-full overflow-hidden bg-[#EFEDE6] aspect-[16/10]"
          style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16 / 10' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.image_url} alt="" className="object-cover" loading="lazy" decoding="async" />
        </div>
      </Link>
      <span className="type-kicker block mt-4">{story.vertical}</span>
      <h3 className="type-rail-h mt-2">
        <Link href={href} className="story-link">
          {story.headline}
        </Link>
      </h3>
      <span className="type-meta block mt-3">{story.readMin} min read</span>
    </article>
  )
}
