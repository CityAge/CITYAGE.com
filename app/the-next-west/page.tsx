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
  'Capital',
  'The airport',
  'The grid',
  'The hospital',
  'The campus',
  'The harbour',
  'The ground',
  'Title',
] as const

const DAY = [
  { time: '09:00', place: 'The harbour' },
  { time: '10:15', place: 'The airport' },
  { time: '11:30', place: 'The hospital' },
  { time: '13:30', place: 'The campus' },
  { time: '14:45', place: 'The grid' },
  { time: '16:00', place: 'The ground' },
  { time: '17:00', place: 'After Vancouver' },
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
              Coming to Vancouver, Winter 2026.
            </p>
          </header>

          <div className="max-w-[720px] mx-auto px-6 md:px-12 mt-14 md:mt-20">
            <h2 className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-6">
              The Thesis
            </h2>
            <p className="font-serif text-[1.25rem] md:text-[1.5rem] leading-[1.45] text-black mb-8">
              Serious money is coming to the Canadian west. This room puts it next to the idea,
              and the project that can take the cheque.
            </p>
            <p className="font-serif italic text-[17px] md:text-[19px] leading-[1.6] text-black/75 mb-16 md:mb-20">
              Then Toronto. Calgary in the spring. A campaign in the magazine, not a conference
              brand.
            </p>

            <h2 className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-8">
              The Room
            </h2>
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
                  </span>
                </li>
              ))}
            </ol>

            <section id="invite">
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
