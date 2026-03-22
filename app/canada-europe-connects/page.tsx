import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MagazineFooter } from '@/components/magazine-footer'

export const revalidate = 60

export default async function CECPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('canada_europe_connects_intelligence')
    .select('id, title, summary, topic, source_urls, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const allArticles = articles || []

  // Group by topic
  const byTopic: Record<string, typeof allArticles> = {}
  allArticles.forEach((a) => {
    if (!byTopic[a.topic]) byTopic[a.topic] = []
    byTopic[a.topic].push(a)
  })

  // Separate people profiles from intelligence briefs
  const people = byTopic['People'] || []
  const topics = Object.keys(byTopic).filter(t => t !== 'People')

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">

      {/* ─── CEC MASTHEAD (bespoke, dark, exclusive) ─── */}
      <header className="bg-black text-white">
        {/* Top utility bar */}
        <div className="border-b border-white/10 px-6 md:px-12 py-2">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <Link href="/" className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-[#C5A059] transition-colors">
              ← The Urban Planet
            </Link>
            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/30">
                Invitation Only
              </span>
              <span className="text-white/10 text-[9px]">|</span>
              <a href="https://cityage.com/events/canada-europe-connect/" className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#C5A059] hover:text-white transition-colors">
                Request Access
              </a>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24 text-center">
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#C5A059] block mb-6">
            The Influence Letter · Special Edition
          </span>
          <h1 className="font-serif font-black text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
            Canada–Europe<br />Connects
          </h1>
          <p className="font-serif italic text-white/50 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Defence procurement, dual-use technology, and trans-Atlantic trade corridors converge in the capital.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-6 font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
              <span>Ottawa</span>
              <span className="text-white/15">|</span>
              <span>May 26, 2026</span>
              <span className="text-white/15">|</span>
              <span>{allArticles.length} Intelligence Briefs</span>
            </div>
          </div>
          <a
            href="https://cityage.com/events/canada-europe-connect/"
            className="inline-block bg-[#C5A059] text-black px-10 py-3 font-mono text-[10px] font-black tracking-[0.25em] uppercase hover:bg-white transition-colors"
          >
            Request Access to the Event
          </a>
        </div>
      </header>

      {/* ─── INTELLIGENCE FEED ─── */}
      <main className="max-w-[1200px] mx-auto w-full px-6 md:px-12">

        {/* Lead brief — most recent non-people article */}
        {topics.length > 0 && byTopic[topics[0]] && byTopic[topics[0]][0] && (
          <section className="py-14 border-b border-black/10">
            <div className="max-w-[800px]">
              <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-black/70 block mb-3">
                Latest Intelligence
              </span>
              <h2 className="font-serif font-black text-2xl md:text-3xl leading-[1.15] tracking-tight mb-4">
                {allArticles[0]?.title}
              </h2>
              <p className="font-serif text-black/60 text-[16px] leading-[1.7] mb-4">
                {allArticles[0]?.summary}
              </p>
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">
                {allArticles[0]?.topic} · {new Date(allArticles[0]?.published_at).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Toronto' })}
              </span>
            </div>
          </section>
        )}

        {/* Topic sections */}
        <section className="py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-16">

            {/* Main column: intelligence by topic */}
            <div>
              {topics.map((topic) => (
                <div key={topic} className="mb-14">
                  <div className="flex items-baseline justify-between pb-4 mb-6 border-b-2 border-black">
                    <h3 className="font-serif font-black text-xl tracking-tight uppercase">
                      {topic}
                    </h3>
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">
                      {byTopic[topic].length} brief{byTopic[topic].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="space-y-8">
                    {byTopic[topic].map((article) => (
                      <div key={article.id} className="group">
                        <h4 className="font-serif font-bold text-[17px] leading-snug tracking-tight mb-2">
                          {article.title}
                        </h4>
                        <p className="font-serif text-black/55 text-[15px] leading-[1.65] mb-3">
                          {article.summary}
                        </p>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">
                            {new Date(article.published_at).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'America/Toronto' })}
                          </span>
                          {article.source_urls && article.source_urls.length > 0 && (
                            <>
                              <span className="text-black/15 text-[8px]">·</span>
                              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">
                                {article.source_urls.length} source{article.source_urls.length !== 1 ? 's' : ''}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Right sidebar */}
            <aside>
              <div className="sticky top-24">
                {/* Event card */}
                <div className="bg-black text-white p-8 mb-8">
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C5A059] block mb-3">
                    The Event
                  </span>
                  <h3 className="font-serif font-black text-lg mb-3">
                    Canada–Europe Connects
                  </h3>
                  <div className="space-y-2 font-mono text-[10px] tracking-[0.15em] uppercase text-white/50 mb-6">
                    <p>Ottawa, Ontario</p>
                    <p>May 26, 2026</p>
                    <p>Invitation Only</p>
                  </div>
                  <a
                    href="https://cityage.com/events/canada-europe-connect/"
                    className="block w-full bg-[#C5A059] text-black py-2.5 font-mono text-[10px] font-black tracking-[0.2em] uppercase text-center hover:bg-white transition-colors"
                  >
                    Request Access
                  </a>
                </div>

                {/* People profiles */}
                {people.length > 0 && (
                  <div>
                    <div className="border-t-2 border-black pt-4 mb-6">
                      <h3 className="font-serif font-black text-base uppercase tracking-tight">
                        Key People
                      </h3>
                    </div>
                    <div className="space-y-5">
                      {people.map((person) => (
                        <div key={person.id}>
                          <h4 className="font-serif font-bold text-[14px] leading-snug mb-1">
                            {person.title}
                          </h4>
                          <p className="font-serif text-black/45 text-[12px] leading-[1.5]">
                            {person.summary?.slice(0, 120)}{(person.summary?.length || 0) > 120 ? '…' : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subscribe */}
                <div className="mt-8 pt-6 border-t border-black/10">
                  <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-black/25 block mb-3">
                    Get the Influence Letter
                  </span>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full border border-black/15 bg-white px-4 py-2.5 font-mono text-[11px] tracking-wider text-black placeholder-black/25 uppercase outline-none focus:border-[#C5A059] transition-colors mb-2"
                  />
                  <button className="w-full bg-black text-white py-2.5 font-mono text-[10px] font-black tracking-[0.2em] uppercase hover:bg-[#C5A059] hover:text-black transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </aside>

          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-black/10 py-16 text-center">
          <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#C5A059] block mb-4">
            May 26, 2026 · Ottawa
          </span>
          <h2 className="font-serif font-black text-3xl md:text-4xl tracking-tight mb-4">
            Join the Leaders Building the<br />Canada–Europe Future
          </h2>
          <p className="font-serif text-black/50 text-base max-w-xl mx-auto mb-8">
            Defence procurement, dual-use technology, and trans-Atlantic trade corridors. An invitation-only convening of the decision-makers shaping the corridor.
          </p>
          <a
            href="https://cityage.com/events/canada-europe-connect/"
            className="inline-block bg-black text-white px-10 py-3 font-mono text-[10px] font-black tracking-[0.25em] uppercase hover:bg-[#C5A059] hover:text-black transition-colors"
          >
            Request Access
          </a>
        </section>

      </main>

      <MagazineFooter />
    </div>
  )
}
