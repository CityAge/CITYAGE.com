import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'

export const metadata: Metadata = {
  title: 'Purpose — CityAge',
  description: 'CityAge connects the leaders building The Urban Planet. A global intelligence platform for decision-makers across cities, defence, investment, technology, space and climate.',
}

const partners = [
  { name: 'Google', src: 'https://cityage.com/wp-content/uploads/google.jpg' },
  { name: 'Microsoft', src: 'https://cityage.com/wp-content/uploads/microsoft.jpg' },
  { name: 'Cisco', src: 'https://cityage.com/wp-content/uploads/cisco.jpg' },
  { name: 'Deloitte', src: 'https://cityage.com/wp-content/uploads/deloitte.jpg' },
  { name: 'PwC', src: 'https://cityage.com/wp-content/uploads/pwc.jpg' },
  { name: 'KPMG', src: 'https://cityage.com/wp-content/uploads/kpgm.jpg' },
  { name: 'EY', src: 'https://cityage.com/wp-content/uploads/ey.jpg' },
  { name: 'Mastercard', src: 'https://cityage.com/wp-content/uploads/mastercard.jpg' },
  { name: 'Reuters', src: 'https://cityage.com/wp-content/uploads/reuters.png' },
  { name: 'Verizon', src: 'https://cityage.com/wp-content/uploads/verizon.jpg' },
  { name: 'Shell', src: 'https://cityage.com/wp-content/uploads/shell.png' },
  { name: 'SAP', src: 'https://cityage.com/wp-content/uploads/sap.jpg' },
  { name: 'IBM Watson', src: 'https://cityage.com/wp-content/uploads/ibmmwatson.jpg' },
  { name: 'Dell', src: 'https://cityage.com/wp-content/uploads/dell.png' },
  { name: 'Autodesk', src: 'https://cityage.com/wp-content/uploads/autodesk.jpg' },
  { name: 'WSP', src: 'https://cityage.com/wp-content/uploads/wsp.jpg' },
  { name: 'AECOM', src: 'https://cityage.com/wp-content/uploads/aecom.jpg' },
  { name: 'Jacobs', src: 'https://cityage.com/wp-content/uploads/jacobs.jpg' },
]

const events = [
  { name: 'Canada–Europe Connects', city: 'Ottawa', year: '2026' },
  { name: 'ORBIT: Space Cities Strategies', city: 'Washington, DC', year: '2026' },
  { name: 'The Next Vancouver', city: 'Vancouver', year: '2024–2025' },
  { name: 'Securing Canada\'s AI Future', city: 'Vancouver', year: '2024' },
  { name: 'Estonia: A Blueprint for the Digital Future', city: 'Digital', year: '2024–2025' },
  { name: 'The Next Grid', city: 'Digital', year: '2024' },
  { name: 'CityAge New York: The New Infrastructure', city: 'New York', year: '2023' },
  { name: 'Decarbonizing America\'s Urban Hubs', city: 'Digital', year: '2024' },
  { name: 'The Data Effect', city: 'Vancouver', year: '2024' },
  { name: 'Space Cities', city: 'Washington, DC', year: '2026' },
  { name: 'Fast Track Cities', city: 'Digital', year: '2024' },
  { name: 'CityAge London', city: 'London', year: '2019' },
  { name: 'CityAge Hong Kong', city: 'Hong Kong', year: '2018' },
]

const verticals = [
  'Power & Governance',
  'Defence & Security',
  'Investment & Finance',
  'Cities & Infrastructure',
  'Technology & AI',
  'Space Economy',
  'Planetary Health',
  'Energy & Climate',
  'Oceans & Food Systems',
  'Culture & Urban Life',
]

export default function PurposePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className="border-b border-black bg-black text-white">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20 md:py-32">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C5A059] block mb-10">
              Purpose
            </span>
            <h1 className="font-serif font-black text-[2.2rem] md:text-[3.8rem] leading-[1.08] tracking-tight mb-8">
              We started looking at the age of cities.<br />
              We discovered something larger.
            </h1>
            <p className="font-serif text-white/60 text-[17px] md:text-[19px] leading-[1.72] max-w-[680px]">
              The Urban Planet is three per cent of Earth's surface. It is where 75 per cent of people live, where 75 per cent of global GDP is created, and where the defining ideas of our age take form — from artificial intelligence to the space economy, from climate to defence, from the future of democracy to the future of capital.
            </p>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="border-b border-black bg-[#F9F9F7]">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-black/10">
              {[
                { num: '25,000+', label: 'Leaders in our network' },
                { num: '100+', label: 'Events worldwide' },
                { num: '50+', label: 'Cities represented' },
                { num: '2012', label: 'Est. Vancouver' },
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
        <section className="border-b border-black bg-white">
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
                  body: 'The Intelligence Letter — our editorial platform for decision-makers across the verticals that define The Urban Planet. Daily briefings. Special editions for events. Client intelligence series.',
                },
                {
                  label: 'Campaigns',
                  body: 'We work with organisations that want to lead the conversation, not just participate in it. Knowledge Partnerships that create influence, open doors and make a measurable difference.',
                },
                {
                  label: 'Convening',
                  body: 'We bring leaders and ideas into the same room, physically and digitally, at the moments that matter. In-person events, digital convenings, and intimate roundtables.',
                },
              ].map((item, i) => (
                <div key={i} className="py-8 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0">
                  <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059] block mb-4">
                    {item.label}
                  </span>
                  <p className="font-serif text-[15px] leading-[1.72] text-black/70">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Verticals */}
            <div className="mt-16 pt-10 border-t border-black/10">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-black/30 block mb-6">
                The verticals of The Urban Planet
              </span>
              <div className="flex flex-wrap gap-3">
                {verticals.map((v) => (
                  <span key={v} className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase text-black border border-black/15 px-3 py-1.5">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── NON-PARTISAN ── */}
        <section className="border-b border-black bg-[#F9F9F7]">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-12">
            <p className="font-serif text-[17px] leading-[1.72] text-black/60 max-w-[680px]">
              CityAge is non-partisan. Our only allegiance is to the quality of the ideas and the integrity of the people who hold them.
            </p>
          </div>
        </section>

        {/* ── WHO WE ARE ── */}
        <section className="border-b border-black bg-white">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20">
            <div className="flex items-baseline gap-6 mb-12 pb-6 border-b border-black/10">
              <h2 className="font-serif font-black text-[1.8rem] md:text-[2.4rem] tracking-tight">
                Who we are
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-12 items-start">
              {/* Avatar */}
              <div>
                <div className="w-[120px] h-[120px] bg-black flex items-center justify-center mb-4">
                  <span className="font-serif font-black text-3xl text-[#C5A059] tracking-wider">MC</span>
                </div>
                <div className="font-serif font-black text-[17px] text-black leading-tight mb-1">
                  Miro Cernetig
                </div>
                <div className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/40">
                  Publisher & CEO
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="font-serif text-[16px] leading-[1.78] text-black/75 mb-5">
                  Miro Cernetig is a journalist and brand strategist who has reported and worked from Beijing, New York, the Arctic and across Canada. His journalism and partnerships have appeared in The Economist, on 60 Minutes, National Geographic Television, the BBC, CBC, The Globe and Mail, The New York Times and The Wall Street Journal.
                </p>
                <p className="font-serif text-[16px] leading-[1.78] text-black/75">
                  He is the founder of{' '}
                  <a
                    href="https://thehumantouch.ai"
                    target="_blank"
                    rel="noopener"
                    className="text-black underline underline-offset-4 decoration-black/20 hover:decoration-[#C5A059] hover:text-[#C5A059] transition-colors"
                  >
                    TheHumanTouch.ai
                  </a>
                  {' '}— exploring how human judgment and artificial intelligence can coexist and strengthen each other. That question sits at the heart of everything CityAge publishes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── KNOWLEDGE PARTNERS ── */}
        <section className="border-b border-black bg-[#F9F9F7]">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20">
            <div className="flex items-baseline justify-between mb-12 pb-6 border-b border-black/10">
              <h2 className="font-serif font-black text-[1.8rem] md:text-[2.4rem] tracking-tight">
                Knowledge Partners
              </h2>
              <a
                href="https://cityage.com/knowledge-partners/"
                target="_blank"
                rel="noopener"
                className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40 hover:text-[#C5A059] transition-colors hidden md:block"
              >
                View all →
              </a>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-black/5">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="bg-white flex items-center justify-center p-5 aspect-[3/2]"
                >
                  <img
                    src={partner.src}
                    alt={partner.name}
                    className="max-w-full max-h-[40px] w-auto object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">
                And 100+ more organisations across North America, Europe and Asia
              </p>
              <a
                href="https://cityage.com/knowledge-partners/"
                target="_blank"
                rel="noopener"
                className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40 hover:text-[#C5A059] transition-colors md:hidden"
              >
                View all →
              </a>
            </div>
          </div>
        </section>

        {/* ── PAST EVENTS ── */}
        <section className="border-b border-black bg-white">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20">
            <div className="flex items-baseline justify-between mb-12 pb-6 border-b border-black/10">
              <h2 className="font-serif font-black text-[1.8rem] md:text-[2.4rem] tracking-tight">
                Where we've convened
              </h2>
              <a
                href="https://cityage.com/past-events/"
                target="_blank"
                rel="noopener"
                className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40 hover:text-[#C5A059] transition-colors hidden md:block"
              >
                Full archive →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-black/8">
              {events.map((event, i) => (
                <div key={i} className="flex items-baseline justify-between py-4 gap-6">
                  <div>
                    <span className="font-serif font-bold text-[15px] text-black leading-snug block">
                      {event.name}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/35 mt-1 block">
                      {event.city}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/25 flex-shrink-0">
                    {event.year}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="https://cityage.com/past-events/"
                target="_blank"
                rel="noopener"
                className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40 hover:text-[#C5A059] transition-colors"
              >
                View the full event archive →
              </a>
            </div>
          </div>
        </section>

        {/* ── JOIN US ── */}
        <section className="bg-black text-white">
          <div className="max-w-[900px] mx-auto px-6 md:px-12 py-20">
            <div className="flex items-baseline gap-6 mb-12 pb-6 border-b border-white/10">
              <h2 className="font-serif font-black text-[1.8rem] md:text-[2.4rem] tracking-tight">
                Join us
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {[
                {
                  label: 'Read The Intelligence Letter',
                  body: 'Our free daily briefing for leaders of The Urban Planet. Subscribe and stay ahead.',
                  cta: 'Subscribe free',
                  href: '/#subscribe',
                  internal: true,
                },
                {
                  label: 'Become a Knowledge Partner',
                  body: 'Work with us on campaigns that create influence, open doors and make a measurable difference.',
                  cta: 'Get in touch',
                  href: 'mailto:miro@cityage.com',
                  internal: false,
                },
                {
                  label: 'Commission a campaign',
                  body: 'Building something that matters in the urban world? We help you find the leaders, capital and attention it deserves.',
                  cta: 'Start a conversation',
                  href: 'mailto:miro@cityage.com',
                  internal: false,
                },
              ].map((item, i) => (
                <div key={i} className="py-8 md:py-0 md:px-8 first:md:pl-0 last:md:pr-0 flex flex-col">
                  <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-[#C5A059] block mb-4">
                    {item.label}
                  </span>
                  <p className="font-serif text-[14px] leading-[1.72] text-white/50 mb-6 flex-grow">
                    {item.body}
                  </p>
                  {item.internal ? (
                    <Link
                      href={item.href}
                      className="inline-block bg-[#C5A059] text-black font-mono text-[9px] font-black tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-white transition-colors self-start"
                    >
                      {item.cta} →
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="inline-block bg-[#C5A059] text-black font-mono text-[9px] font-black tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-white transition-colors self-start"
                    >
                      {item.cta} →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <MagazineFooter />
    </div>
  )
}
