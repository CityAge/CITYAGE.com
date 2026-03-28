import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'

export const metadata: Metadata = {
  title: 'Speakers — CityAge',
  description: 'More than 500 leaders from across The Urban Planet have spoken at CityAge events. Mayors, CEOs, scientists, investors, architects and policymakers from 50+ cities worldwide.',
}

export const revalidate = 3600

interface Speaker {
  id: string
  name: string
  title: string | null
  organisation: string | null
  photo_url: string | null
  event_name: string | null
  city: string | null
  year: number | null
}

export default async function SpeakersPage() {
  let speakers: Speaker[] = []
  let events: string[] = []
  let cities: string[] = []

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = await createClient()
      const { data } = await supabase
        .from('speakers')
        .select('id, name, title, organisation, photo_url, event_name, city, year')
        .order('year', { ascending: false })
        .order('name', { ascending: true })
      speakers = data || []
      events = [...new Set(speakers.map(s => s.event_name).filter(Boolean))] as string[]
      cities = [...new Set(speakers.map(s => s.city).filter(Boolean))].sort() as string[]
    }
  } catch (e) {
    console.error('Supabase error:', e)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow">

        {/* ── HERO ── */}
        <section className="border-b border-black bg-black text-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 md:py-24">
            <div className="max-w-[700px]">
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C5A059] block mb-8">
                The CityAge Network
              </span>
              <h1 className="font-serif font-black text-[2.2rem] md:text-[3.5rem] leading-[1.08] tracking-tight mb-6">
                The leaders of<br />The Urban Planet
              </h1>
              <p className="font-serif text-white/50 text-[16px] md:text-[18px] leading-[1.72]">
                Since 2012, CityAge has convened more than 500 speakers from across the disciplines that shape city life — mayors and deputy mayors, CEOs, investors, architects, scientists, engineers and policymakers — from more than 50 cities around the world.
              </p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-10 mt-12 pt-10 border-t border-white/10">
              {[
                { num: '500+', label: 'Speakers' },
                { num: '100+', label: 'Events' },
                { num: '50+', label: 'Cities' },
                { num: '2012', label: 'Est.' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-serif font-black text-[1.8rem] text-white leading-none mb-1">{s.num}</div>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FILTER BAR ── */}
        {events.length > 0 && (
          <section className="border-b border-black bg-[#F9F9F7] sticky top-[100px] z-50">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-3 flex items-center gap-4 overflow-x-auto">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/30 flex-shrink-0">
                Filter
              </span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">
                  All Events
                </span>
              </div>
              {events.map(event => (
                <span
                  key={event}
                  className="font-mono text-[9px] tracking-[0.12em] uppercase text-black/40 hover:text-[#C5A059] transition-colors cursor-pointer flex-shrink-0 whitespace-nowrap"
                >
                  {event}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── SPEAKERS GRID ── */}
        <section className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">

          {speakers.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/20">
                Speaker profiles loading
              </p>
            </div>
          ) : (
            <>
              {/* Group by event */}
              {events.map(eventName => {
                const eventSpeakers = speakers.filter(s => s.event_name === eventName)
                const eventYear = eventSpeakers[0]?.year
                const eventCity = eventSpeakers[0]?.city
                return (
                  <div key={eventName} className="mb-20">
                    {/* Event header */}
                    <div className="flex items-baseline justify-between mb-10 pb-5 border-b-2 border-black">
                      <div>
                        <h2 className="font-serif font-black text-[1.4rem] md:text-[1.8rem] tracking-tight text-black">
                          {eventName}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                          {eventCity && (
                            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40">
                              {eventCity}
                            </span>
                          )}
                          {eventYear && (
                            <>
                              <span className="text-black/20 text-[8px]">·</span>
                              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40">
                                {eventYear}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/25">
                        {eventSpeakers.length} speakers
                      </span>
                    </div>

                    {/* Speaker grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                      {eventSpeakers.map(speaker => (
                        <div key={speaker.id} className="group">
                          {/* Photo */}
                          <div className="aspect-square bg-[#F0EEE9] overflow-hidden mb-3 relative">
                            {speaker.photo_url ? (
                              <img
                                src={speaker.photo_url}
                                alt={speaker.name}
                                className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="font-serif font-black text-2xl text-black/10">
                                  {speaker.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div>
                            <div className="font-serif font-bold text-[13px] leading-snug text-black mb-0.5">
                              {speaker.name}
                            </div>
                            {speaker.title && (
                              <div className="font-mono text-[8px] tracking-[0.1em] uppercase text-black/40 leading-relaxed">
                                {speaker.title}
                              </div>
                            )}
                            {speaker.organisation && (
                              <div className="font-mono text-[8px] tracking-[0.1em] uppercase text-[#C5A059] leading-relaxed">
                                {speaker.organisation}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-black bg-black text-white">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C5A059] mb-3">
                Join the network
              </div>
              <p className="font-serif text-white/60 text-[15px] leading-[1.65] max-w-[500px]">
                CityAge convenes leaders across The Urban Planet. If you are building something that matters, we would like to hear from you.
              </p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <a
                href="/purpose"
                className="inline-block border border-white/20 text-white font-mono text-[9px] font-bold tracking-[0.2em] uppercase px-6 py-3 hover:border-[#C5A059] hover:text-[#C5A059] transition-colors"
              >
                Our Purpose
              </a>
              <a
                href="mailto:miro@cityage.com"
                className="inline-block bg-[#C5A059] text-black font-mono text-[9px] font-bold tracking-[0.2em] uppercase px-6 py-3 hover:bg-white transition-colors"
              >
                Get in Touch →
              </a>
            </div>
          </div>
        </section>

      </main>

      <MagazineFooter />
    </div>
  )
}
