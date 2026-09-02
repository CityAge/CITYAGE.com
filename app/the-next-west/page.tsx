import { Metadata } from 'next'
import Image from 'next/image'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { InviteForm } from './invite-form'

export const metadata: Metadata = {
  title: 'The Next West — CityAge',
  description: 'A CityAge room. Coming to Vancouver, Winter 2026.',
}

const ROOM = [
  'The port.',
  'The airport.',
  'The hospital.',
  'The university.',
  'The utility.',
  'The mine.',
  'The capital.',
  'The province.',
] as const

const DAY = [
  { time: '08:30', place: 'Welcome. The thesis, in ten minutes.', ask: null },
  { time: '08:45', place: 'The harbour.', ask: 'Ask: the case for the next terminal.' },
  { time: '09:30', place: 'The airport.', ask: 'Ask: what YVR becomes when it is a city.' },
  { time: '10:15', place: 'A pause.', ask: null },
  { time: '10:30', place: 'The ground.', ask: 'Ask: who finances the next mine, and how fast.' },
  { time: '11:15', place: 'The hospital and the campus.', ask: 'Ask: the talent the West needs, and where it trains.' },
  { time: '12:00', place: 'Close. The ten ideas, in one page.', ask: null },
] as const

export default function TheNextWestPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow">
        <article className="pb-24 md:pb-36">
          <figure className="w-full">
            <Image
              src="/next-west-cover.jpg"
              alt="Vancouver. The Lions Gate."
              width={1600}
              height={1399}
              sizes="100vw"
              priority
              className="w-full h-auto block"
            />
          </figure>

          <header className="max-w-[720px] mx-auto px-6 md:px-12 pt-12 md:pt-16">
            <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] block mb-6">
              A CityAge Room
            </span>
            <h1 className="font-serif font-normal text-[2.4rem] md:text-[3.6rem] leading-[1.04] tracking-tight text-black mb-5">
              The Next West.
            </h1>
            <p className="font-serif italic text-[18px] md:text-[21px] leading-[1.5] text-black">
              Vancouver · Winter 2026 · Invitation only.
            </p>
            <p className="font-serif italic text-[16px] md:text-[18px] leading-[1.5] text-black/75 mt-2">
              A half-day. 8:30 to 12:00. Four rooms in one.
            </p>
          </header>

          <div className="max-w-[720px] mx-auto px-6 md:px-12 mt-14 md:mt-20">
            <h2 className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-6">
              The Thesis
            </h2>
            <p className="font-serif text-[1.25rem] md:text-[1.5rem] leading-[1.45] text-black mb-8">
              Serious money is coming to the Canadian west. This room puts it next to the idea,
              and next to the project that can take the cheque.
            </p>
            <p className="font-serif italic text-[17px] md:text-[19px] leading-[1.6] text-black/75 mb-16 md:mb-20">
              One morning. Four places where the West is being built. In each, one idea, two or
              three people who own it, and one ask.
            </p>

            <h2 className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-6">
              The Room
            </h2>
            <p className="font-serif text-[18px] md:text-[20px] leading-[1.5] text-black mb-8">
              Eight people who make the room worth being in.
            </p>
            <ul className="grid grid-cols-2 gap-x-8 gap-y-8 mb-16 md:mb-20">
              {ROOM.map((seat) => (
                <li key={seat} className="border-t border-black/15 pt-3">
                  <span className="font-serif text-[18px] md:text-[20px] leading-snug text-black">
                    {seat}
                  </span>
                </li>
              ))}
            </ul>

            <h2 className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-8">
              The Day
            </h2>
            <ol className="mb-16 md:mb-20">
              {DAY.map((slot) => (
                <li
                  key={slot.time}
                  className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-black/15 py-3 last:border-b"
                >
                  <span className="font-mono text-[12px] tracking-[0.08em] text-black/55">
                    {slot.time}
                  </span>
                  <span className="font-serif text-[18px] md:text-[20px] text-black">
                    {slot.place}
                    {slot.ask ? (
                      <span className="block font-mono text-[12px] tracking-[0.08em] text-black/55 mt-1">
                        {slot.ask}
                      </span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ol>

            <h2 className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-6">
              After Vancouver.
            </h2>
            <p className="font-serif italic text-[17px] md:text-[19px] leading-[1.6] text-black/75 mb-16 md:mb-20">
              Calgary in the spring. Ottawa after. A campaign in the magazine, not a conference
              brand.
            </p>

            <section id="invite">
              <p className="font-serif text-[18px] md:text-[20px] leading-[1.5] text-black mb-6">
                Seats are limited and the room is curated. Tell us who you are and which room you
                belong in.
              </p>
              <div className="border border-black/20 bg-[#F9F9F7] px-5 py-8 md:px-8 md:py-10">
                <InviteForm />
              </div>
            </section>
          </div>
        </article>
      </main>

      <MagazineFooter />
    </div>
  )
}
