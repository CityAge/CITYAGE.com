import { createClient } from '@/lib/supabase/server'
import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'
import { ArticleCard } from '@/components/article-card'
import { MagazineFooter } from '@/components/magazine-footer'
import { UrbanPlanetVoices } from '@/components/urban-planet-voices'

export const revalidate = 60

export default async function Home() {
  let articles: {
    id: string; title: string; vertical: string;
    tagline: string | null; excerpt: string | null;
    date: string; index: number; image: string | null;
    readTime: string; source: 'magazine' | 'briefs'
  }[] = []

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (url && key) {
      const supabase = await createClient()

      // ── Try magazine table first ──
      const { data: magArticles } = await supabase
        .from('magazine')
        .select('id, headline, deck, body, vertical, sub_vertical, image_url, read_time, published_at, featured')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(24)

      if (magArticles && magArticles.length > 0) {
        articles = magArticles.map((a: any, i: number) => {
          // Extract a clean body excerpt (first real paragraph)
          const lines = (a.body || '').split('\n')
          let bodyExcerpt = ''
          for (const line of lines) {
            const t = line.trim()
            if (t.length > 40
              && !t.startsWith('#')
              && !t.startsWith('*')
              && !t.startsWith('**')
              && !t.startsWith('---')
              && !t.startsWith('|')
              && !t.startsWith('>')
            ) {
              bodyExcerpt = t
                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                .replace(/https?:\/\/\S+/g, '')
                .replace(/\*\*/g, '').replace(/\*/g, '')
                .replace(/\s{2,}/g, ' ').trim()
              break
            }
          }
          if (bodyExcerpt.length > 240) {
            bodyExcerpt = bodyExcerpt.slice(0, 240) + '…'
          }

          return {
            id: a.id,
            title: a.headline,
            vertical: a.vertical,
            tagline: a.deck || null,
            excerpt: bodyExcerpt || a.deck || null,
            date: new Date(a.published_at).toLocaleDateString('en-CA', {
              weekday: 'short', month: 'short', day: 'numeric',
              timeZone: 'America/Toronto',
            }),
            index: i,
            image: a.image_url || null,
            readTime: `${a.read_time || 5} min read`,
            source: 'magazine' as const,
          }
        })
      } else {
        // ── Fallback to briefs table ──
        const { data: briefs } = await supabase
          .from('briefs')
          .select('id, title, vertical, published_at, body')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(18)

        articles = (briefs ?? []).map((b: any, i: number) => {
          const tagline = b.body
            ?.split('\n')
            .find((l: string) => l.startsWith('*') && l.endsWith('*') && !l.includes('Defence.'))
            ?.replace(/\*/g, '')
            ?.trim() || null

          const lines = b.body?.split('\n') || []
          const excerptLine = lines.find((l: string) => {
            const trimmed = l.trim()
            return trimmed.length > 60
              && !trimmed.startsWith('#')
              && !trimmed.startsWith('*')
              && !trimmed.startsWith('**')
              && !trimmed.startsWith('---')
          })
          let rawExcerpt = excerptLine?.trim() || ''
          rawExcerpt = rawExcerpt.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          rawExcerpt = rawExcerpt.replace(/https?:\/\/\S+/g, '')
          rawExcerpt = rawExcerpt.replace(/\s{2,}/g, ' ').trim()
          const excerpt = rawExcerpt.length > 0
            ? rawExcerpt.slice(0, 160) + (rawExcerpt.length > 160 ? '…' : '')
            : null

          const date = new Date(b.published_at).toLocaleDateString('en-CA', {
            weekday: 'short', month: 'short', day: 'numeric',
            timeZone: 'America/Toronto',
          })

          return { id: b.id, title: b.title, vertical: b.vertical, tagline, excerpt, date, index: i, image: null, readTime: '5 min read', source: 'briefs' as const }
        })
      }
    }
  } catch (e) {
    console.error('Supabase error:', e)
    articles = []
  }

  // ── Distribute articles into editorial bands ──
  // Band 1: Hero — lead (1) + secondary (2) + Influence Letter sidebar
  // Band 2: Featured row — next 4 articles, equal weight
  // Band 3: By Vertical — remaining articles grouped by vertical
  const hasArticles = articles.length > 0
  const linkPrefix = articles[0]?.source === 'magazine' ? '/magazine' : '/dispatches'

  const heroLead = articles[0] || null
  const heroSecondary = articles.slice(1, 5)  // 4 stories for middle column
  const heroTertiary = articles.slice(5, 8)   // 3 stories for below Influence Letter
  const featuredArticles = articles.slice(8, 12)
  const remainingArticles = articles.slice(12)

  // Group remaining by vertical for category sections
  const byVertical: Record<string, typeof articles> = {}
  remainingArticles.forEach((a) => {
    if (!byVertical[a.vertical]) byVertical[a.vertical] = []
    byVertical[a.vertical].push(a)
  })
  const verticalKeys = Object.keys(byVertical).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      {/* Campaign banner — full width event promotion */}
      <CampaignBanner />

      {/* Masthead (includes vertical nav) */}
      <MagazineHeader />

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full bg-[#F9F9F7]">
        {!hasArticles ? (
          <div className="py-24 px-8 text-center">
            <p className="font-serif italic text-2xl text-black/20 mb-3">
              CityAge
            </p>
            <p className="font-mono text-[10px] text-black/30 tracking-widest uppercase">
              Magazine content will appear here once the editorial pipeline is active
            </p>
          </div>
        ) : (
          <>
            {/* ─── BAND 1: HERO EDITORIAL ─── */}
            <section className="border-b border-black/10 px-6 md:px-10">
              <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr_3fr] lg:gap-8">

                {/* Lead story — STICKY: column stretches, content sticks */}
                {heroLead && (
                  <div className="lg:pr-10 py-8 lg:py-10 flex flex-col">
                    <div className="lg:sticky lg:top-[140px] flex flex-col flex-grow">
                    <ArticleCard
                      id={heroLead.id}
                      title={heroLead.title}
                      vertical={heroLead.vertical}
                      tagline={heroLead.tagline}
                      excerpt={heroLead.excerpt}
                      date={heroLead.date}
                      isLead={true}
                      image={heroLead.image || undefined}
                      readTime={heroLead.readTime}
                      variant="hero-lead"
                      linkPrefix={linkPrefix}
                    />
                    </div>
                  </div>
                )}

                {/* Secondary stories — middle column with images */}
                <div className="lg:px-10 py-8 lg:py-12 flex flex-col border-t lg:border-t-0 border-black/10">
                  {heroSecondary.map((article, i) => (
                    <div key={article.id} className={`flex-1 ${i > 0 ? 'border-t border-black/10 pt-10 mt-10' : ''}`}>
                      <ArticleCard
                        id={article.id}
                        title={article.title}
                        vertical={article.vertical}
                        tagline={article.tagline}
                        excerpt={article.excerpt}
                        date={article.date}
                        image={article.image || undefined}
                        readTime={article.readTime}
                        variant="hero-secondary"
                        linkPrefix={linkPrefix}
                      />
                    </div>
                  ))}
                </div>

                {/* Right sidebar — scrolls with column 2 (NOT sticky) */}
                <div className="flex flex-col py-8 lg:py-0">
                  {/* Influence Letter — black box */}
                  <div className="bg-black text-white p-8 flex flex-col">
                    <h3 className="font-serif font-black text-lg uppercase tracking-tight mb-1">
                      The Influence Letter
                    </h3>
                    <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C5A059] mb-6">
                      Daily Intelligence Brief
                    </span>

                    <p className="font-serif text-white/50 text-[13px] leading-relaxed mb-6">
                      Intelligence on infrastructure, defence, space, energy, and food systems. Delivered before markets open.
                    </p>

                    <div className="mb-6">
                      <input
                        type="email"
                        placeholder="your@email.com"
                        className="w-full bg-white/10 border border-white/20 px-4 py-2.5 font-mono text-[11px] tracking-wider text-white placeholder-white/30 uppercase outline-none focus:border-[#C5A059] transition-colors mb-2"
                      />
                      <button className="w-full bg-[#C5A059] text-black py-2.5 font-mono text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white transition-colors">
                        Subscribe Free
                      </button>
                    </div>

                    <div className="border-t border-white/10 pt-6 mt-auto">
                      <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/25 block mb-4">
                        Upcoming Events
                      </span>
                      <div className="space-y-4">
                        <a href="https://cityage.com/events" target="_blank" rel="noopener" className="block group">
                          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#C5A059]">May 26 · Ottawa</span>
                          <span className="font-serif font-bold text-sm block mt-1 group-hover:text-[#C5A059] transition-colors">Canada–Europe Connects</span>
                        </a>
                        <a href="https://cityage.com/events" target="_blank" rel="noopener" className="block group">
                          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#C5A059]">Jun 19 · Vancouver</span>
                          <span className="font-serif font-bold text-sm block mt-1 group-hover:text-[#C5A059] transition-colors">The Next Vancouver</span>
                        </a>
                        <a href="https://cityage.com/events" target="_blank" rel="noopener" className="block group">
                          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#C5A059]">2026 · Washington DC</span>
                          <span className="font-serif font-bold text-sm block mt-1 group-hover:text-[#C5A059] transition-colors">Orbit — Space Economy</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Stories below the Influence Letter — like Monocle puts stories below Radio */}
                  {heroTertiary.length > 0 && (
                    <div className="lg:px-8 pt-8 space-y-6">
                      {heroTertiary.map((article, i) => (
                        <div key={article.id} className={`${i > 0 ? 'border-t border-black/10 pt-6' : ''}`}>
                          <ArticleCard
                            id={article.id}
                            title={article.title}
                            vertical={article.vertical}
                            tagline={null}
                            excerpt={null}
                            date={article.date}
                            readTime={article.readTime}
                            variant="hero-tertiary"
                            linkPrefix={linkPrefix}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>{/* close grid */}
            </section>

            {/* ─── VOICES FROM THE URBAN PLANET ─── */}
            <UrbanPlanetVoices />

            {/* ─── BAND 2: FEATURED ROW ─── */}
            {featuredArticles.length > 0 && (
              <section className="border-b border-black/10 px-6 md:px-10">
                <div className="flex items-baseline justify-between pt-14 pb-8">
                  <h3 className="font-serif font-black text-2xl tracking-tight">
                    Featured
                  </h3>
                  <a href="/dispatches" className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40 hover:text-[#C5A059] transition-colors">
                    See All
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-14">
                  {featuredArticles.map((article, i) => (
                    <ArticleCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      vertical={article.vertical}
                      tagline={article.tagline}
                      excerpt={article.excerpt}
                      date={article.date}
                      image={article.image || undefined}
                      readTime={article.readTime}
                      variant="featured-card"
                      linkPrefix={linkPrefix}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ─── BAND 3: BY VERTICAL ─── */}
            {verticalKeys.length > 0 && (
              <section className="px-6 md:px-10 pt-14 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {verticalKeys.map((vertical, vIdx) => (
                    <div
                      key={vertical}
                      className={`${vIdx === 0 ? 'md:pr-12' : vIdx === 1 ? 'md:px-12 md:border-x border-black/10' : 'md:pl-12'} ${vIdx > 0 ? 'mt-10 pt-10 border-t border-black/10 md:mt-0 md:pt-0 md:border-t-0' : ''}`}
                    >
                      <div className="flex items-baseline justify-between pb-5 mb-8 border-b-2 border-black">
                        <h3 className="font-serif font-black text-xl tracking-tight uppercase">
                          {vertical}
                        </h3>
                        <a href="/dispatches" className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40 hover:text-[#C5A059] transition-colors">
                          See All
                        </a>
                      </div>
                      {byVertical[vertical].map((article, aIdx) => (
                        <div key={article.id} className={`${aIdx > 0 ? 'border-t border-black/10 pt-5 mt-5' : ''}`}>
                          <ArticleCard
                            id={article.id}
                            title={article.title}
                            vertical={article.vertical}
                            tagline={null}
                            excerpt={null}
                            date={article.date}
                            readTime={article.readTime}
                            variant="category-list"
                            linkPrefix={linkPrefix}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <MagazineFooter />
    </div>
  )
}
