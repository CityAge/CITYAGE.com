import { Metadata } from 'next'
import Link from 'next/link'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'

export const metadata: Metadata = {
  title: 'Purpose — CityAge',
  description:
    'We live on the urban planet. Two percent of Earth. Everything happens here. CityAge is the small rooms, drawn from 20,000 leaders. Publisher: Miro Cernetig.',
}

export default function PurposePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow">

        {/* ── HERO: THE EARTH AT NIGHT — unmasked ── */}
        <section className="border-b border-black bg-black text-white">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-12 md:pb-16">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C5A059] block mb-10">
              Our Founding Thesis
            </span>
            <h1 className="font-serif font-black text-[2.6rem] md:text-[4.2rem] leading-[1.05] tracking-tight mb-8">
              The Urban Planet.
            </h1>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/55 max-w-[560px] leading-[1.9]">
              We live on the urban planet. Two percent of Earth. Everything happens here.
            </p>
          </div>
          <img
            src="/earth-lights.jpg"
            alt="The Earth at night — the Urban Planet"
            className="w-full h-auto block"
          />
        </section>

        {/* ── THE QUOTE ── */}
        <section className="border-b border-black bg-black text-white">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-16 md:py-20">
            <blockquote className="font-serif italic text-[1.4rem] md:text-[1.9rem] leading-[1.55] text-white/90 border-l-2 border-[#C5A059] pl-6 md:pl-10">
              &ldquo;We live on the urban planet. Two percent of Earth.
              Everything happens here. Cities, regions, even small hamlets
              in the Arctic &mdash; this is where every structural challenge
              of our era &mdash; climate, capital, sovereignty &mdash;
              gets solved or doesn&rsquo;t get solved.&rdquo;
            </blockquote>
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/40 mt-8 pl-6 md:pl-10">
              Miro Cernetig &mdash; Publisher
            </p>
          </div>
        </section>

        {/* ── THE THESIS ── */}
        <section className="border-b border-black bg-[#F9F9F7]">
          <div className="max-w-[760px] mx-auto px-6 md:px-12 py-20 md:py-24">
            <p className="font-serif text-[18px] md:text-[20px] leading-[1.8] text-black/80 mb-8">
              The Urban Planet is the two percent of Earth where people mostly
              are &mdash; and where everything happens. Sometimes it&rsquo;s
              a vast urban region. Sometimes it&rsquo;s a small and distant place. All of
              it is connected &mdash; through modern technology and human endeavour &mdash;
              into a single web of decisions.
            </p>

            <p className="font-serif italic text-[1.5rem] md:text-[2rem] leading-[1.45] text-[#8C6B48] py-6">
              Iqaluit is as connected to the Urban Planet as New York, Beijing or
              Brussels.
            </p>

            <p className="font-serif text-[18px] md:text-[20px] leading-[1.8] text-black/80 mb-8">
              CityAge is the small rooms, drawn from 20,000 leaders. Come do the work.
            </p>

            <p className="font-serif text-[18px] md:text-[20px] leading-[1.8] text-black/80">
              Fifteen years and 100+ forums later, we convene the people who
              decide what gets built &mdash; government, capital, and industry &mdash;
              in rooms small enough to do the work.
            </p>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="border-b border-black bg-white">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-black/10">
              {[
                { num: '15', label: 'Years convening leaders' },
                { num: '100+', label: 'Forums worldwide' },
                { num: '20,000', label: 'Leaders. The small rooms.' },
                { num: '2%', label: 'Of Earth. Everything happens here.' },
              ].map((stat, i) => (
                <div key={i} className="px-6 md:px-10 py-4 first:pl-0 last:pr-0">
                  <div className="font-serif font-black text-[2rem] md:text-[2.8rem] leading-none tracking-tight text-black mb-2">
                    {stat.num}
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT WE DO ── */}
        <section className="border-b border-black bg-[#F9F9F7]">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20">
            <div className="flex items-baseline gap-6 mb-12 pb-6 border-b border-black/10">
              <h2 className="font-serif font-black text-[1.8rem] md:text-[2.4rem] tracking-tight">
                The rooms
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-black/10">
              {[
                {
                  label: 'Northern Century',
                  body: 'The Arctic and northern hemisphere as a room: ideas and investments in the new geography of power.',
                },
                {
                  label: 'Next West',
                  body: 'The Next Vancouver — the Pacific room. The leaders deciding what this coast builds next.',
                },
                {
                  label: 'The Influence Letter',
                  body: 'Intelligence on infrastructure, defence, space, energy, and food systems. Delivered before markets open.',
                },
              ].map((item, i) => (
                <div key={i} className="py-8 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0">
                  <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-[#8C6B48] block mb-4">
                    {item.label}
                  </span>
                  <p className="font-serif text-[15px] leading-[1.75] text-black/70">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CLOSE ── */}
        <section className="bg-black text-white">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-24 md:py-32 text-center">
            <p className="font-serif font-black text-[1.8rem] md:text-[2.8rem] leading-[1.25] tracking-tight mb-6">
              We live on the urban planet.<br />
              Two percent of Earth.<br />
              <span className="text-[#C5A059]">Everything happens here.</span>
            </p>
            <p className="font-serif italic text-white/60 text-lg mb-12">
              CityAge is the small rooms, drawn from 20,000 leaders. Come do the work.
            </p>
            <Link
              href="/#subscribe"
              className="inline-block font-mono text-[10px] tracking-[0.24em] uppercase border border-white/40 px-8 py-4 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
            >
              Subscribe &rarr;
            </Link>
          </div>
        </section>

      </main>

      <MagazineFooter />
    </div>
  )
}
