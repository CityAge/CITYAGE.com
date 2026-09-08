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
            <span className="type-kicker block mb-6">
              PURPOSE
            </span>
            <h1 className="type-title tracking-tight text-black mb-8">
              The Urban Planet.
            </h1>
            <p className="type-body text-black">
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
            <p className="purpose-map-graf type-body text-black mb-10">
              Look at the map above closely and you&apos;ll see the web of lights has no
              centre. A port at the edge of the ice. A valley of engineers. A capital on a
              river. Each a point of light, each wired to the others by money, technology and
              the aspirations of people who build.
            </p>

            <p className="font-serif italic text-[1.35rem] md:text-[1.7rem] leading-[1.4] text-black mb-14 md:mb-16">
              Iqaluit can be as consequential as New York.
            </p>

            <h2 className="type-section tracking-tight text-black mb-6">
              What we do.
            </h2>
            <p className="type-body text-black mb-6">
              CityAge.com is an open platform for ideas and stories about the people shaping
              the Urban Planet. We welcome contributors who help us understand what is
              happening—and what comes next.
            </p>
            <p className="type-body text-black mb-6">
              Our focus is the two per cent of the Earth where most of us live. Where human
              and financial capital converge, decisions are made and innovation takes shape.
            </p>
            <p className="type-body text-black mb-6">
              Through our publication, events, films and campaigns, we bring people and
              ideas together.
            </p>
            <p className="type-body text-black mb-14 md:mb-16">
              CityAge is non-partisan. We believe in a vigorous marketplace of ideas and
              welcome informed debate, fresh perspectives and strong disagreement. We have
              no interest in diatribes, conspiracy theories or polarization for its own sake.
            </p>

            <p className="font-serif italic text-[1.15rem] md:text-[1.3rem] leading-snug text-black border-t border-[#C5A059] pt-6 mb-8">
              A small room of enormous influence.
            </p>

            <h2 className="type-section tracking-tight text-black mb-6">
              Why we do it.
            </h2>
            <p className="type-body text-black mb-6">
              CityAge puts ideas in motion.
            </p>
            <p className="type-body text-black mb-6">
              We help leaders turn ideas into action. We work with business and political
              leaders, researchers, innovators, philanthropists and others who build the
              Urban Planet.
            </p>
            <p className="type-body text-black mb-6">
              We amplify promising public policy ideas and bring people together to help
              shape and implement them. We help build brands, raise awareness, attract
              capital and form partnerships.
            </p>
            <p className="type-body text-black">
              Through our publication, events, films and campaigns, we connect ideas with
              the people who can make them happen.
            </p>

            <p className="font-serif text-[1.85rem] md:text-[2.6rem] leading-[1.2] tracking-tight text-black mt-20 md:mt-28 mb-8">
              What ideas do you want to put in motion?
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <a
                href="/contact?subject=contribute"
                className="inline-block bg-[#C5A059] text-black px-8 py-3 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] transition-colors"
              >
                Contribute a story or idea
              </a>
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
