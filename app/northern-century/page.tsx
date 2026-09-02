import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { DoorSpeakersStrip } from '@/components/door-speakers-strip'
import { fetchNorthernCenturyFaces } from '@/lib/speakers'

export const revalidate = 3600

/** Replace with the Beehiiv publication link when the newsletter exists. */
const SUBSCRIBE_HREF = '/subscribe'

const THESIS = [
  'Laurier said the twentieth century would belong to Canada. He was early. The twenty-first belongs to the North — the countries that share the pole, the North Atlantic, the minerals, the shipping lanes and the satellites, and the same adversaries across the ice.',
  'The Northern Century is a network of the leaders shaping it, the intelligence they need, and the rooms where they meet. Ottawa first. Then Washington.',
] as const

const ROOMS = [
  { city: 'Ottawa', when: 'Spring 2027', note: 'Invitation only', href: '/northern-century' },
  { city: 'Washington', when: 'To follow', note: null, href: '/northern-century' },
] as const

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'The Northern Century — CityAge',
    description: THESIS[0].split('. ')[0] + '.',
  }
}

function Band({
  title,
  children,
  className = '',
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`border-t border-black/10 py-16 md:py-24 ${className}`}>
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <h2 className="font-serif font-normal text-[1.65rem] md:text-[2rem] leading-tight tracking-tight text-black mb-8 md:mb-10">
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

export default async function NorthernCenturyPage() {
  const members = await fetchNorthernCenturyFaces()
  const mid = Math.ceil(members.length / 2)

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow">
        {/* 1. PLATE — full bleed, the Earth fills it, copy sits bottom-left */}
        <section
          className="ca-photo relative w-full h-[80vh] min-h-[480px] overflow-hidden bg-black"
          style={{ position: 'relative', overflow: 'hidden' }}
        >
          <Image
            src="/northern-century-earth.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/15" />
          <div className="absolute inset-0 flex items-end">
            <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 pb-10 md:pb-16">
              <span className="font-mono text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] block mb-3 md:mb-4">
                A CityAge campaign
              </span>
              <h1 className="font-serif font-normal text-[2.4rem] md:text-[4.2rem] leading-[1.02] tracking-tight text-white m-0">
                The Northern Century.
              </h1>
              <p className="font-serif italic text-[17px] md:text-[21px] leading-snug text-white/85 mt-3 md:mt-4 m-0">
                The twenty-first century belongs to the North.
              </p>
            </div>
          </div>
        </section>

        {/* 2. THESIS — black band, cream text, gold rule under the h1 above */}
        <section className="bg-black text-[#F9F9F7] py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto px-6 md:px-12">
            <div className="max-w-[760px]">
              <div className="w-12 h-[2px] bg-[#C5A059] mb-10 md:mb-12" aria-hidden="true" />
              <p className="font-serif text-[1.25rem] md:text-[1.5rem] leading-[1.45] text-[#F9F9F7] mb-8">
                {THESIS[0]}
              </p>
              <p className="font-serif text-[18px] md:text-[21px] leading-[1.6] text-[#F9F9F7]/75">
                {THESIS[1]}
              </p>
            </div>
          </div>
        </section>

        {/* 3. MAP */}
        <Band title="The North, from above.">
          <div className="min-h-[480px] bg-[#F9F9F7] border border-black/15 flex items-center justify-center">
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-black/40">
              Circumpolar map — coming.
            </span>
          </div>
        </Band>

        {/* 4. MEMBERS */}
        <section className="border-t border-black/10 py-16 md:py-24">
          <div className="max-w-[1100px] mx-auto px-6 md:px-12">
            <h2 className="font-serif font-normal text-[1.65rem] md:text-[2rem] leading-tight tracking-tight text-black mb-8 md:mb-10">
              The people shaping the North.
            </h2>
          </div>
          <div style={{ minHeight: 136, background: '#120f0b' }}>
            <DoorSpeakersStrip top={members.slice(0, mid)} bottom={members.slice(mid)} />
          </div>
          <div className="max-w-[1100px] mx-auto px-6 md:px-12">
            <p className="font-serif italic text-[17px] md:text-[19px] leading-[1.6] text-black/75 mt-8">
              A network of five hundred. Founding members first.
            </p>
          </div>
        </section>

        {/* 5. THE BRIEF */}
        <Band title="Intelligence that matters, north of sixty.">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-center">
            <p className="font-serif text-[18px] md:text-[21px] leading-[1.6] text-black max-w-[640px]">
              Stories, reports and calls, from the magazine and from the network. A newsletter of
              its own is coming.
            </p>
            <Link
              href={SUBSCRIBE_HREF}
              className="inline-block bg-[#C5A059] text-black px-8 py-2.5 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] transition-colors justify-self-start md:justify-self-end"
            >
              Subscribe
            </Link>
          </div>
        </Band>

        {/* 6. THE CALLS */}
        <Band title="Calls we're making.">
          <p className="font-serif italic text-[17px] md:text-[19px] leading-[1.6] text-black/75 mb-8">
            Falsifiable, dated, kept score. First calls this autumn.
          </p>
          <ol aria-label="Calls" className="border-t border-black/15 min-h-[120px]" />
        </Band>

        {/* 7. THE ROOMS */}
        <Band title="The rooms.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {ROOMS.map((room) => (
              <Link key={room.city} href={room.href} className="block group border-t border-black/10 pt-6">
                <span className="font-mono text-[12px] font-bold tracking-[0.2em] uppercase text-[#C5A059]">
                  {room.when}
                </span>
                <h3 className="font-serif font-normal text-[20px] md:text-[22px] leading-[1.28] tracking-normal mt-2 group-hover:text-[#1A365D] transition-colors">
                  {room.city}
                </h3>
                <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-black/40 mt-4">
                  {[room.city, room.when, room.note].filter(Boolean).join(' · ')}
                </div>
              </Link>
            ))}
          </div>
        </Band>

        {/* 8. CONVENERS */}
        <Band title="Conveners." className="pb-24 md:pb-36">
          <div
            aria-label="Conveners"
            className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3 min-h-[132px]"
          />
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-black/40 mt-6">
            Announced this autumn.
          </p>
        </Band>
      </main>

      <MagazineFooter />
    </div>
  )
}
