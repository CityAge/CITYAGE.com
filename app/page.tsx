import Image from 'next/image'
import Link from 'next/link'
import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'
import { SubscribeDoor } from '@/components/subscribe-door'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <CampaignBanner />
      <MagazineHeader />

      <div className="border-b border-black/10 px-6 md:px-12">
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
        {/* One lead — the photograph, then the story in type */}
        <article className="max-w-[1400px] mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-4">
          <Link href="/northern-century" className="group block">
            <figure className="relative w-full overflow-hidden bg-black/5 aspect-[16/9] md:aspect-[2.2/1]">
              <Image
                src="/northern-century-hero.png"
                alt="The Arctic from orbit — the next geography of power"
                fill
                priority
                className="object-cover object-[center_22%] group-hover:scale-[1.015] transition-transform duration-700"
              />
            </figure>
            <div className="max-w-[40rem] mt-12 md:mt-16">
              <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
                Frontiers
              </p>
              <h2 className="font-serif font-black text-[2.6rem] md:text-[4.5rem] lg:text-[5.25rem] leading-[0.94] tracking-tight mt-3 group-hover:opacity-70 transition-opacity">
                The Northern Century
              </h2>
              <p className="font-serif italic text-[20px] md:text-[23px] text-black/55 leading-[1.4] mt-6">
                Ideas and investments in the new geography of power.
              </p>
              <p className="font-serif text-[17px] md:text-[18px] text-black/60 leading-[1.7] mt-5">
                The Arctic is not the edge of the map. It is the next frontier — where capital, sovereignty, and infrastructure converge.
              </p>
            </div>
          </Link>
        </article>

        {/* Then a grid — not twins. One city story, one letter. Air between. */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 mt-20 md:mt-28 pt-16 md:pt-20 border-t border-black/12 pb-24 md:pb-32">
          <div className="grid md:grid-cols-12 gap-x-14 lg:gap-x-20 gap-y-20 items-start">
            <article className="md:col-span-7">
              <Link href="/next-vancouver" className="group block">
                <figure className="relative w-full overflow-hidden bg-black/5 aspect-[16/10] mb-8">
                  <Image
                    src="/vancouver-banner.jpg"
                    alt="Lions Gate and the harbour — The Next Metro Vancouver"
                    fill
                    className="object-cover object-[center_35%] group-hover:scale-[1.015] transition-transform duration-700"
                  />
                </figure>
                <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
                  Cities
                </p>
                <h3 className="font-serif font-black text-[2rem] md:text-[2.55rem] leading-[1.06] tracking-tight mt-3 group-hover:opacity-70 transition-opacity">
                  The Next Metro Vancouver
                </h3>
                <p className="font-serif italic text-[17px] md:text-[18px] text-black/50 leading-[1.5] mt-4 max-w-[28em]">
                  The A.I. Edition — where can this region actually win?
                </p>
              </Link>
            </article>

            <article id="letter" className="md:col-span-5">
              <Link href="/influence/canada-europe-connects" className="group block">
                <figure className="relative w-full overflow-hidden bg-black/5 aspect-[5/4] mb-8">
                  <Image
                    src="/parliament-sunset.jpg"
                    alt="Parliament Hill at sundown — The Influence Letter"
                    fill
                    className="object-cover object-[center_40%] group-hover:scale-[1.015] transition-transform duration-700"
                  />
                </figure>
                <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
                  Power
                </p>
                <h3 className="font-serif font-black text-[1.65rem] md:text-[1.9rem] leading-[1.1] tracking-tight mt-3 group-hover:opacity-70 transition-opacity">
                  The Influence Letter
                </h3>
                <p className="font-serif italic text-[15px] md:text-[16px] text-black/50 leading-[1.5] mt-3">
                  Canada–Europe Connects. Defence procurement, dual-use technology, and trans-Atlantic trade corridors.
                </p>
              </Link>

              <div id="subscribe" className="mt-12 pt-8 border-t border-black/10">
                <SubscribeDoor />
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="border-t border-black px-6 md:px-12 py-12 md:py-16 bg-[#F9F9F7]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="font-serif font-black uppercase tracking-[0.06em] text-2xl">CITYAGE</p>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-black/40 mt-3">
              everything happens on earth&rsquo;s 2%.
            </p>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-black/40 mt-2">
              Publisher · Miro Cernetig · Vancouver
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.16em] uppercase text-black/45">
            <a href="/purpose" className="hover:text-black transition-colors">Purpose</a>
            <a href="/influence/canada-europe-connects" className="hover:text-black transition-colors">The Letter</a>
            <a href="/northern-century" className="hover:text-black transition-colors">Northern Century</a>
            <a href="/next-vancouver" className="hover:text-black transition-colors">Next Vancouver</a>
            <a href="/privacy" className="hover:text-black transition-colors">Privacy</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
