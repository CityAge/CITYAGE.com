import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { DoorSpeakersLazy } from '@/components/door-speakers-lazy'
import Link from 'next/link'

export const revalidate = 60

const MILLER_HREF = '/frontiers/the-inflection-point-was-real'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <CampaignBanner />

      <MagazineHeader />

      <main className="flex-grow w-full bg-[#F9F9F7]">
        <section
          id="frontiers"
          className="border-b border-black/10"
        >
          <Link
            href={MILLER_HREF}
            className="block max-w-[720px] mx-auto px-6 md:px-12 py-14 md:py-20 group"
          >
            <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059]">
              Frontiers
            </span>
            <h2 className="font-serif font-normal text-[1.85rem] md:text-[2.6rem] leading-[1.15] tracking-tight text-black mt-4 mb-5 group-hover:text-[#1A365D] transition-colors">
              The inflection point was real
            </h2>
            <p className="font-serif text-[17px] md:text-[19px] leading-[1.65] text-black/70">
              Charles Miller, who spoke at CityAge Orbit in Washington, on the commercialization of space.
            </p>
          </Link>
        </section>
      </main>

      <div style={{ minHeight: 136, background: '#120f0b' }}>
        <DoorSpeakersLazy />
      </div>
      <MagazineFooter />
    </div>
  )
}
