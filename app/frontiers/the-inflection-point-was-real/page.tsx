import { Metadata } from 'next'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'

export const metadata: Metadata = {
  title: 'The inflection point was real — CityAge',
  description:
    'Charles Miller, who spoke at CityAge Orbit in Washington, on the commercialization of space.',
}

const EXCHANGES = [
  {
    q: 'You’ve been working in commercial space for a long time. How has the perception of the industry changed?',
    a: 'Commercial space, once viewed negatively, is now mainstream. I’ve been involved in turning the “ship of state” toward commercialization for 40 years. Earlier space entrepreneurs failed because NASA had a monopoly and investors were reluctant to compete against the government. It took several decades to reach the “new space age,” an era I was critically involved in, which is now characterized by significant money, innovation, and change.',
  },
  {
    q: 'I see parallels between the current developments in space and the discovery of the “new world” — that state-sponsored exploration eventually leads to capitalist involvement, such as the East India Company and the Hudson’s Bay Company, which establish trade routes and exploit resources. Are we seeing that same transition now?',
    a: 'We are. That’s exactly the transition we’ve been working on for 40 years — moving from government monopoly to commercial involvement.',
  },
  {
    q: 'Our upcoming space event stems from encounters like one with Space Tango. This isn’t just an event but the beginning of a campaign to bring leaders together in a multi-disciplinary setting. At CityAge, we’re trying to link looking up at space opportunities with looking down at opportunities on Earth.',
    a: 'That’s important work. These connections are crucial to understanding the full scope of what’s happening.',
  },
] as const

export default function MillerInterviewPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <article className="flex-grow bg-[#F9F9F7]">
        <div className="max-w-[720px] mx-auto px-6 md:px-12 pt-14 md:pt-20 pb-24 md:pb-32">
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] block mb-5">
            Two Per Cent
          </span>

          <h1 className="font-serif font-normal text-[1.85rem] md:text-[2.75rem] leading-[1.12] tracking-tight text-black mb-5">
            The inflection point was real
          </h1>

          <p className="font-serif text-[17px] md:text-[19px] leading-[1.65] text-black mb-5">
            Charles Miller, who spoke at CityAge Orbit in Washington, on the commercialization of space.
          </p>

          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-black/45 mb-10">
            Washington, 9 February 2026. As spoken.
          </p>

          <blockquote className="border-t border-[#C5A059] border-b py-6 mb-12">
            <p className="font-serif italic text-[1.15rem] md:text-[1.3rem] leading-[1.45] text-black">
              Commercial space, once viewed negatively, is now mainstream.
            </p>
          </blockquote>

          <div className="space-y-8">
            {EXCHANGES.map((turn) => (
              <div key={turn.q}>
                <p className="font-serif italic text-[17px] md:text-[18px] leading-[1.7] text-black mb-4">
                  {turn.q}
                </p>
                <p className="font-serif text-[17px] md:text-[18px] leading-[1.7] text-black">
                  {turn.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>

      <MagazineFooter />
    </div>
  )
}
