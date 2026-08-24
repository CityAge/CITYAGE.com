import Image from 'next/image'
import Link from 'next/link'
import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <CampaignBanner />
      <MagazineHeader />

      <div className="border-b border-black/10 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto py-7 md:py-9 text-center">
          <p className="font-serif text-[16px] md:text-[19px] text-black/70 leading-[1.55]">
            We live on the urban planet. Two percent of Earth. Everything happens here.
          </p>
          <p className="font-serif italic text-[14px] md:text-[16px] text-black/45 mt-3">
            CityAge is the small rooms, drawn from 20,000 leaders. Come do the work.
          </p>
        </div>
      </div>

      <main className="flex-grow w-full bg-[#F9F9F7]">
        {/* One lead — photography first, then the story */}
        <article className="max-w-[1400px] mx-auto px-6 md:px-12 pt-10 md:pt-14 pb-6">
          <Link href="/northern-century" className="group block">
            <figure className="relative w-full overflow-hidden bg-black/5 aspect-[16/10] md:aspect-[2/1]">
              <Image
                src="/northern-century-hero.png"
                alt="The Northern Century — the Arctic as the next geography of power"
                fill
                priority
                className="object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </figure>
            <div className="max-w-[780px] mt-10 md:mt-14">
              <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
                Frontiers
              </p>
              <h2 className="font-serif font-black text-[2.75rem] md:text-[4.25rem] lg:text-[5rem] leading-[0.96] tracking-tight mt-3 group-hover:text-[#1A365D] transition-colors">
                The Northern Century
              </h2>
              <p className="font-serif italic text-[19px] md:text-[22px] text-black/55 leading-[1.45] mt-6">
                Ideas and investments in the new geography of power.
              </p>
              <p className="font-serif text-[17px] md:text-[18px] text-black/60 leading-[1.7] mt-5 max-w-[36em]">
                The Arctic is not the edge of the map. It is the next frontier — where capital, sovereignty, and infrastructure converge.
              </p>
            </div>
          </Link>
        </article>

        {/* Then a grid — two stories, lots of air, not equal tiles shouting */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 mt-16 md:mt-24 pt-16 md:pt-20 border-t border-black/15 pb-24 md:pb-32">
          <div className="grid md:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-20">
            <article>
              <Link href="/next-vancouver" className="group block">
                <figure className="relative w-full overflow-hidden bg-black/5 aspect-[16/10] mb-7">
                  <Image
                    src="/vancouver-banner.jpg"
                    alt="The Next Metro Vancouver — The A.I. Edition"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </figure>
                <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
                  Cities
                </p>
                <h3 className="font-serif font-black text-[1.85rem] md:text-[2.15rem] leading-[1.08] tracking-tight mt-3 group-hover:text-[#1A365D] transition-colors">
                  The Next Metro Vancouver
                </h3>
                <p className="font-serif italic text-[16px] md:text-[17px] text-black/50 leading-[1.5] mt-3">
                  The A.I. Edition — where can this region actually win?
                </p>
              </Link>
            </article>

            <article id="letter">
              <Link href="/influence/canada-europe-connects" className="group block">
                <figure className="relative w-full overflow-hidden bg-black/5 aspect-[16/10] mb-7">
                  <Image
                    src="/parliament-sunset.jpg"
                    alt="The Influence Letter — Canada–Europe Connects"
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </figure>
                <p className="font-mono text-[11px] font-bold tracking-[0.22em] uppercase text-black/40">
                  Power
                </p>
                <h3 className="font-serif font-black text-[1.85rem] md:text-[2.15rem] leading-[1.08] tracking-tight mt-3 group-hover:text-[#1A365D] transition-colors">
                  The Influence Letter
                </h3>
                <p className="font-serif italic text-[16px] md:text-[17px] text-black/50 leading-[1.5] mt-3">
                  Canada–Europe Connects. Defence procurement, dual-use technology, and trans-Atlantic trade corridors.
                </p>
              </Link>

              <div id="subscribe" className="mt-10 pt-8 border-t border-black/10">
                <p className="font-serif text-[15px] text-black/55 leading-[1.65] max-w-[28em]">
                  Intelligence on infrastructure, defence, space, energy, and food systems. Delivered before markets open.
                </p>
                <form className="mt-5 flex flex-col sm:flex-row gap-2 max-w-[420px]">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 bg-transparent border border-black/20 px-4 py-2.5 font-mono text-[11px] tracking-wider text-black placeholder-black/30 uppercase outline-none focus:border-black transition-colors"
                  />
                  <button
                    type="button"
                    className="bg-black text-[#F9F9F7] px-6 py-2.5 font-mono text-[10px] font-black tracking-[0.2em] uppercase hover:bg-[#C5A059] hover:text-black transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
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
