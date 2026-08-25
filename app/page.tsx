import Image from 'next/image'
import Link from 'next/link'
import { MagazineHeader } from '@/components/magazine-header'
import { IssueFooter } from '@/components/issue-footer'
import { SubscribeDoor } from '@/components/subscribe-door'
import { lauraStory, nextVancouver, northernCentury, partnerStory } from '@/lib/issue'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader issue />

      <div id="lockup" className="border-b border-black/10 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto py-8 md:py-10 text-center">
          <p className="font-serif text-[16px] md:text-[19px] text-black/70 leading-[1.55]">
            We live on the urban planet. Two percent of Earth. Everything happens here.
          </p>
          <p className="font-serif italic text-[14px] md:text-[16px] text-black/45 mt-3">
            CityAge is the small rooms, drawn from 20,000 leaders. Come do the work.
          </p>
        </div>
      </div>

      <main className="flex-grow w-full bg-[#F9F9F7]">
        <article id="cover" className="pt-0 md:pt-12">
          <div className="md:max-w-[1400px] md:mx-auto md:px-12">
            <figure className="relative w-full overflow-hidden bg-black/5 aspect-[4/5] md:aspect-[16/9]">
              <Image
                src={northernCentury.image}
                alt={northernCentury.imageAlt}
                fill
                priority
                className="object-cover object-center"
              />
            </figure>
          </div>
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 mt-10 md:mt-14 pb-4">
            <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
              {northernCentury.kicker}
            </p>
            <h2 className="font-serif font-black text-[2.6rem] md:text-[4.5rem] lg:text-[5.25rem] leading-[0.94] tracking-tight mt-3 max-w-[18ch]">
              <Link href={northernCentury.href} className="hover:opacity-70 transition-opacity">
                {northernCentury.title}
              </Link>
            </h2>
            <p className="font-serif italic text-[20px] md:text-[23px] text-black/55 leading-[1.4] mt-6 max-w-[36em]">
              {northernCentury.dek}
            </p>
            <p className="font-serif text-[17px] md:text-[18px] text-black/65 leading-[1.7] mt-6 max-w-[36em]">
              {northernCentury.body[0]}
            </p>
          </div>
        </article>

        <section
          id="well"
          className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 md:mt-24 pt-14 md:pt-16 border-t border-black/12"
        >
          <div className="grid md:grid-cols-3 gap-x-10 lg:gap-x-14 gap-y-16 items-start">
            <article>
              <Link href={nextVancouver.href} className="group block">
                <figure className="relative w-full overflow-hidden bg-black/5 aspect-[16/10] mb-6">
                  <Image
                    src={nextVancouver.image}
                    alt={nextVancouver.imageAlt}
                    fill
                    className="object-cover object-[center_35%]"
                  />
                </figure>
                <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
                  {nextVancouver.kicker}
                </p>
                <h3 className="font-serif font-black text-[1.65rem] md:text-[1.85rem] leading-[1.1] tracking-tight mt-3 group-hover:opacity-70 transition-opacity">
                  {nextVancouver.title}
                </h3>
                <p className="font-serif italic text-[16px] text-black/50 leading-[1.45] mt-3">
                  {nextVancouver.dek}
                </p>
              </Link>
            </article>

            <article>
              <Link href={lauraStory.href} className="group block">
                <figure className="relative w-full overflow-hidden bg-black/5 aspect-[16/10] mb-6">
                  <Image
                    src={lauraStory.image}
                    alt={lauraStory.imageAlt}
                    fill
                    className="object-cover object-center"
                  />
                </figure>
                <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
                  {lauraStory.kicker}
                </p>
                <h3 className="font-serif font-black text-[1.65rem] md:text-[1.85rem] leading-[1.1] tracking-tight mt-3 group-hover:opacity-70 transition-opacity">
                  {lauraStory.title}
                </h3>
                <p className="font-serif italic text-[16px] text-black/50 leading-[1.45] mt-3">
                  {lauraStory.dek}
                </p>
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-black/35 mt-4">
                  {lauraStory.byline}
                </p>
              </Link>
            </article>

            <article id="letter">
              <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
                Power
              </p>
              <h3 className="font-serif font-black text-[1.65rem] md:text-[1.85rem] leading-[1.1] tracking-tight mt-3">
                The Influence Letter
              </h3>
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-black/35 mt-4">
                Miro Cernetig · Publisher
              </p>
              <div className="font-serif text-[16px] md:text-[17px] text-black/70 leading-[1.65] mt-6 space-y-4">
                <p>We live on the urban planet. Two percent of Earth. Everything happens here.</p>
                <p>I have spent my working life in rooms that do not look like much: a table, twelve people who can move a port or a northern road.</p>
                <p>CityAge is those rooms, drawn from twenty thousand leaders who already carry the file.</p>
                <p>Halls are easy. Rooms are hard. Come do the work.</p>
                <p>I write from Vancouver, looking west and north at the same time.</p>
                <p>The Arctic is not the edge of the map.</p>
              </div>
            </article>
          </div>
        </section>

        <aside className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 md:mt-20 pt-12 border-t border-black/10">
          <Link href={partnerStory.href} className="group block max-w-[42rem]">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-black/35">
              CityAge partner
            </p>
            <h3 className="font-serif font-black text-[1.45rem] md:text-[1.7rem] leading-[1.12] tracking-tight mt-3 group-hover:opacity-70 transition-opacity">
              {partnerStory.title}
            </h3>
            <p className="font-serif italic text-[16px] text-black/50 leading-[1.45] mt-3">
              {partnerStory.dek}
            </p>
          </Link>
        </aside>

        <div id="subscribe" className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 md:mt-24 pt-12 border-t border-black/10 pb-24 md:pb-32">
          <SubscribeDoor />
        </div>
      </main>

      <IssueFooter />
    </div>
  )
}
