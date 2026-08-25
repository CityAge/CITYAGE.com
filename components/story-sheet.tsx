import Image from 'next/image'
import { IssueLeaf } from '@/components/issue-leaf'
import type { IssueStory } from '@/lib/issue'

export function StorySheet({ story }: { story: IssueStory }) {
  return (
    <IssueLeaf href={story.href}>
      <article className="w-full px-6 md:px-12 pt-8 md:pt-14 pb-20 md:pb-28">
        <div className="mx-auto w-full max-w-[68ch]">
          {story.image && (
            <figure className="relative w-full overflow-hidden bg-black/5 aspect-[3/2] mb-10">
              <Image
                src={story.image}
                alt={story.imageAlt || ''}
                fill
                priority
                sizes="(min-width: 768px) 68ch, 100vw"
                className="object-cover object-center"
              />
            </figure>
          )}
          {story.partner && (
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-black/40">
              CityAge partner
            </p>
          )}
          {story.kicker && (
            <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
              {story.kicker}
            </p>
          )}
          <h1 className="font-serif font-black text-[2.15rem] md:text-[2.85rem] leading-[1.05] tracking-tight mt-3">
            {story.title}
          </h1>
          <p className="font-serif italic text-[18px] md:text-[20px] text-black/55 leading-[1.45] mt-5">
            {story.dek}
          </p>
          {story.byline && (
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-black/35 mt-5">
              {story.byline}
            </p>
          )}
          <div className="font-serif text-[17px] md:text-[18.5px] text-black/80 leading-[1.7] mt-10 space-y-6">
            {story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>
    </IssueLeaf>
  )
}
