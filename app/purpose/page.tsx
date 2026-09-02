import { Metadata } from 'next'
import Image from 'next/image'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import './purpose.css'

export const metadata: Metadata = {
  title: 'Purpose — CityAge',
  description:
    'Fifteen years ago, CityAge was founded on an image. The Earth at night. Two per cent of the surface, lit.',
}

export default function PurposePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow">
        <article className="pt-16 md:pt-24 pb-24 md:pb-36">
          <header className="max-w-[720px] mx-auto px-6 md:px-12">
            <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] block mb-6">
              PURPOSE
            </span>
            <h1 className="font-serif font-normal text-[2rem] md:text-[3.1rem] leading-[1.12] tracking-tight text-black mb-8">
              The Urban Planet.
            </h1>
            <p className="font-serif text-[18px] md:text-[21px] leading-[1.75] text-black">
              Fifteen years ago, CityAge was founded on an image. The Earth at night. Two per
              cent of the surface, lit. A single web of lights where nearly everything that
              matters gets connected.
            </p>
          </header>

          <figure className="mt-12 md:mt-16 w-full">
            <Image
              src="/earth-lights.jpg"
              alt="The Earth at Night · NASA"
              width={2560}
              height={1288}
              sizes="100vw"
              priority
              className="w-full h-auto block"
            />
            <figcaption className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/45 text-center mt-4 px-6">
              The Earth at Night · NASA
            </figcaption>
          </figure>

          <div className="max-w-[720px] mx-auto px-6 md:px-12 mt-12 md:mt-16">
            <blockquote className="border-l-[3px] border-[#C5A059] pl-6 md:pl-7 mb-14 md:mb-16">
              <p className="font-serif italic text-[1.05rem] md:text-[1.15rem] leading-[1.55] text-black">
                “Cities, regions, even small hamlets in the Arctic — built on two per cent of
                the planet, producing more than 80 per cent of its GDP. Every structural
                challenge of our era — climate, capital, sovereignty — gets solved or
                doesn&apos;t get solved there.”
              </p>
              <footer className="font-mono text-[10px] tracking-[0.18em] uppercase text-black/50 mt-5">
                — Miro Cernetig, Founder, CEO and Publisher
              </footer>
            </blockquote>
            <p className="purpose-map-graf font-serif text-[18px] md:text-[21px] leading-[1.75] text-black mb-10">
              Look at the map above closely and you&apos;ll see the web of lights has no
              centre. A port at the edge of the ice. A valley of engineers. A capital on a
              river. Each a point of light, each wired to the others by money, technology and
              the aspirations of people who build.
            </p>

            <p className="font-serif italic text-[1.35rem] md:text-[1.7rem] leading-[1.4] text-black mb-14 md:mb-16">
              Iqaluit is as connected to the Urban Planet as New York, Beijing or Brussels.
            </p>

            <h2 className="font-serif font-normal text-[1.65rem] md:text-[2rem] leading-tight tracking-tight text-black mb-6">
              What we do.
            </h2>
            <p className="font-serif text-[18px] md:text-[21px] leading-[1.75] text-black mb-14 md:mb-16">
              We connect the leaders who build the Urban Planet. 25,000 of them,
              across fifty cities and fifteen years — founders, government leaders, investors,
              architects, engineers, mayors, Fortune 1000 executives and more. We bring them
              together through campaigns, brands, films and curated rooms where decisions and
              investments follow.
            </p>

            <p className="font-serif italic text-[1.15rem] md:text-[1.3rem] leading-snug text-black border-t border-[#C5A059] pt-6 mb-8">
              A small room of enormous influence.
            </p>

            <h2 className="font-serif font-normal text-[1.65rem] md:text-[2rem] leading-tight tracking-tight text-black mb-6">
              Why we do it.
            </h2>
            <p className="font-serif text-[18px] md:text-[21px] leading-[1.75] text-black mb-6">
              CityAge puts ideas in motion.
            </p>
            <p className="font-serif text-[18px] md:text-[21px] leading-[1.75] text-black mb-6">
              We find the ideas worth moving. We put each one in a small room of enormous
              influence. Then we make the films, brands and campaigns that forge the
              connections to make it real.
            </p>
            <p className="font-serif text-[18px] md:text-[21px] leading-[1.75] text-black mb-6">
              Our knowledge partners have built companies, changed policy, raised capital, seen
              their valuations climb, been featured in major media — and, most important of
              all, formed friendships and partnerships that endure.
            </p>
            <p className="font-serif text-[18px] md:text-[21px] leading-[1.75] text-black">
              We don&apos;t take on every idea. Only the ones that add something to the world.
            </p>

            <p className="font-serif text-[1.85rem] md:text-[2.6rem] leading-[1.2] tracking-tight text-black mt-20 md:mt-28 mb-8">
              What ideas do you want to put in motion?
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <a
                href="mailto:info@cityage.com"
                className="font-serif text-[18px] md:text-[20px] text-black underline underline-offset-4 decoration-black/20 hover:text-[#C5A059] hover:decoration-[#C5A059] transition-colors"
              >
                info@cityage.com
              </a>
              <a
                href="/subscribe"
                className="inline-block bg-[#C5A059] text-black px-8 py-2.5 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] transition-colors"
              >
                Subscribe
              </a>
            </div>
          </div>
        </article>
      </main>

      <MagazineFooter />
    </div>
  )
}
