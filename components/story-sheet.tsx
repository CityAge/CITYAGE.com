import Image from 'next/image'
import { MagazineHeader } from '@/components/magazine-header'
import { IssueFooter } from '@/components/issue-footer'
import type { IssueStory } from '@/lib/issue'

export function StorySheet({ story }: { story: IssueStory }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader issue />

      <article className="flex-grow w-full px-6 md:px-12 pt-10 md:pt-16 pb-24 md:pb-32">
        <div className="mx-auto w-full max-w-[38rem]">
          <figure className="relative w-full overflow-hidden bg-black/5 aspect-[16/10] mb-10">
            <Image
              src={story.image}
              alt={story.imageAlt}
              fill
              priority
              className="object-cover object-center"
            />
          </figure>
          <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
            {story.kicker}
          </p>
          {story.partner && (
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-black/35 mt-3">
              CityAge partner
            </p>
          )}
          <h1 className="font-serif font-black text-[2.15rem] md:text-[3rem] leading-[1.05] tracking-tight mt-3">
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
          <div className="font-serif text-[17px] md:text-[18px] text-black/75 leading-[1.75] mt-10 space-y-6">
            {story.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </article>

      <IssueFooter />
    </div>
  )
}
