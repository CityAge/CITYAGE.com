import { Metadata } from 'next'
import Link from 'next/link'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'

export const metadata: Metadata = {
  title: 'Purpose — CityAge',
  description:
    'The Urban Planet: cities, regions, even small hamlets in the Arctic — built on 3 per cent of the planet, producing more than 80% of its GDP. CityAge convenes the leaders deciding what gets built there.',
}

export default function PurposePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow">

        {/* ── HERO: THE EARTH AT NIGHT ── */}
        <section className="relative border-b border-black bg-black text-white overflow-hidden">
          <img
            src="/earth-lights.jpg"
            alt="The Earth at night — the Urban Planet"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/95" />
          <div className="relative max-w-[900px] mx-auto px-6 md:px-12 pt-24 md:pt-40 pb-16 md:pb-24">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C5A059] block mb-10">
              Our Founding Thesis
            </span>
            <h1 className="font-serif font-black text-[2.6rem] md:text-[4.2rem] leading-[1.05] tracking-tight mb-8">
              The Urban Planet.
            </h1>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/55 max-w-[560px] leading-[1.9]">
              The image CityAge was founded on, fifteen years ago. The Earth at night.
              Three per cent of the surface. A single web of light.
            </p>
          </div>
        </section>

        {/* ── THE QUOTE ── */}
        <section className="border-b border-black bg-black text-white">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-16 md:py-20">
            <blockquote className="font-serif italic text-[1.4rem] md:text-[1.9rem] leading-[1.55] text-white/90 border-l-2 border-[#C5A059] pl-6 md:pl-10">
              &ldquo;Cities, regions, even small hamlets in the Arctic &mdash; built on
              3 per cent of the planet, producing more than 80% of its GDP. Every
              structural challenge of our era &mdash; climate, capital, sovereignty &mdash;
              gets solved or doesn&rsquo;t get solved there.&rdquo;
            </blockquote>
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/40 mt-8 pl-6 md:pl-10">
              Miro Cernetig &mdash; Founder, CEO &amp; Publisher
            </p>
          </div>
        </section>

        {/* ── THE THESIS ── */}
        <section className="border-b border-black bg-[#F9F9F7]">
          <div className="max-w-[760px] mx-auto px-6 md:px-12 py-20 md:py-24">
            <p className="font-serif text-[18px] md:text-[20px] leading-[1.8] text-black/80 mb-8">
              The Urban Planet is the three per cent of the Earth where people mostly
              are &mdash; and where innovation and investment happens. Sometimes it&rsquo;s
              a vast urban region. Sometimes it&rsquo;s a small and distant place. All of
              it is connected &mdash; through modern technology and human endeavour &mdash;
              into a single web of decisions.
            </p>

            <p className="font-serif italic text-[1.5rem] md:text-[2rem] leading-[1.45] text-[#8C6B48] py-6">
              Iqaluit is as connected to the Urban Planet as New York, Beijing or
              Brussels.
            </p>

            <p className="font-serif text-[18px] md:text-[20px] leading-[1.8] text-black/80 mb-8">
              CityAge was founded on a single observation: the decision-makers
              responsible for building the next century rarely get to talk to each
              other. Not the right ones. Not under conditions where trust gets built
              and decisions get made.
            </p>

            <p className="font-serif text-[18px] md:text-[20px] leading-[1.8] text-black/80">
              Fifteen years and 100+ forums later, we&rsquo;ve built the network that
              changes that &mdash; 25,000 verified leaders across government, capital,
              and industry, convened around the problems worth solving.
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
                { num: '25,000+', label: 'Verified decision-makers' },
                { num: '3%', label: 'Of the Earth. Most of what matters.' },
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
                What we do
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-black/10">
              {[
                {
                  label: 'Intelligence',
                  body: 'Editorial briefings for decision-makers across the verticals that define the Urban Planet — written with the standards of a newsroom, not a newsletter farm.',
                },
                {
                  label: 'Campaigns',
                  body: 'We work with organisations that want to lead the conversation, not just participate in it. Knowledge partnerships that create influence and open doors.',
                },
                {
                  label: 'Convening',
                  body: 'We bring leaders and ideas into the same room at the moments that matter — summits, intimate roundtables, and the networks that outlast them.',
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
            <p className="font-serif font-black text-[1.8rem] md:text-[2.8rem] leading-[1.25] tracking-tight mb-12">
              Three per cent of the Earth.<br />
              Most of what matters.<br />
              <span className="text-[#C5A059]">We work there.</span>
            </p>
            <Link
              href="/network"
              className="inline-block font-mono text-[10px] tracking-[0.24em] uppercase border border-white/40 px-8 py-4 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
            >
              Join the Network &rarr;
            </Link>
          </div>
        </section>

      </main>

      <MagazineFooter />
    </div>
  )
}
