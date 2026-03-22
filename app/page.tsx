import { createClient } from '@/lib/supabase/server'
import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'
import { Navigation } from '@/components/navigation'
import { ColumnistStrip } from '@/components/columnist-strip'
import { PartnerMarquee } from '@/components/partner-marquee'
import { Ticker } from '@/components/ticker'
import { ArticleCard } from '@/components/article-card'
import { SubscriptionCard } from '@/components/subscription-card'
import { MagazineFooter } from '@/components/magazine-footer'

export const revalidate = 60

const leadImages = ['/ottawa-feature.jpg', '/wildfire-evacuation.jpg', '/guest-portrait.jpg']

export default async function Home() {
  let articles: {
    id: string; title: string; vertical: string;
    tagline: string | null; excerpt: string | null;
    date: string; index: number
  }[] = []

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (url && key) {
      const supabase = await createClient()
      const { data: briefs } = await supabase
        .from('briefs')
        .select('id, title, vertical, published_at, body')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(18)

      articles = (briefs ?? []).map((b: any, i: number) => {
        // Extract tagline (italic line)
        const tagline = b.body
          ?.split('\n')
          .find((l: string) => l.startsWith('*') && l.endsWith('*') && !l.includes('Defence.'))
          ?.replace(/\*/g, '')
          ?.trim() || null

        // Extract excerpt (first substantial paragraph after headers)
        const lines = b.body?.split('\n') || []
        const excerptLine = lines.find((l: string) => {
          const trimmed = l.trim()
          return trimmed.length > 60
            && !trimmed.startsWith('#')
            && !trimmed.startsWith('*')
            && !trimmed.startsWith('**')
            && !trimmed.startsWith('---')
        })
        const excerpt = excerptLine?.trim().slice(0, 160) + (excerptLine && excerptLine.length > 160 ? '…' : '') || null

        const date = new Date(b.published_at).toLocaleDateString('en-CA', {
          weekday: 'short', month: 'short', day: 'numeric',
          timeZone: 'America/Toronto',
        })

        return { id: b.id, title: b.title, vertical: b.vertical, tagline, excerpt, date, index: i }
      })
    }
  } catch (e) {
    console.error('Supabase error:', e)
    articles = []
  }

  // ── Distribute articles into editorial bands ──
  // Band 1: Hero — lead (1) + secondary (2) + tertiary (3-4 headlines)
  // Band 2: Featured row — next 4 articles, equal weight
  // Band 3: By Vertical — remaining articles grouped by vertical
  const hasArticles = articles.length > 0

  const heroLead = articles[0] || null
  const heroSecondary = articles.slice(1, 3)
  const heroTertiary = articles.slice(3, 7)
  const featuredArticles = articles.slice(7, 11)
  const remainingArticles = articles.slice(11)

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

      {/* Masthead */}
      <MagazineHeader />

      {/* Navigation */}
      <Navigation />

      {/* Columnist strip */}
      <ColumnistStrip />

      {/* Partner marquee */}
      <PartnerMarquee />

      {/* Ticker */}
      <Ticker />

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-grow max-w-[1200px] mx-auto w-full bg-[#F9F9F7]">
        {!hasArticles ? (
          <div className="py-24 px-8 text-center">
            <p className="font-serif italic text-2xl text-black/20 mb-3">
              The Urban Planet
            </p>
            <p className="font-mono text-[10px] text-black/30 tracking-widest uppercase">
              Magazine content will appear here once the editorial pipeline is active
            </p>
          </div>
        ) : (
          <>
            {/* ─── BAND 1: HERO EDITORIAL ─── */}
            <section className="border-b border-black/10 px-6 md:px-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[420px]">

                {/* Lead story — dominant left column */}
                {heroLead && (
                  <div className="lg:col-span-1 lg:border-r border-black/10 lg:pr-10 py-10">
                    <ArticleCard
                      id={heroLead.id}
                      title={heroLead.title}
                      vertical={heroLead.vertical}
                      tagline={heroLead.tagline}
                      excerpt={heroLead.excerpt}
                      date={heroLead.date}
                      isLead={true}
                      image={leadImages[0]}
                      readTime="5 min read"
                      variant="hero-lead"
                    />
                  </div>
                )}

                {/* Secondary stories — middle column */}
                <div className="lg:border-r border-black/10 lg:px-10 py-10 flex flex-col">
                  {heroSecondary.map((article, i) => (
                    <div key={article.id} className={`flex-1 ${i > 0 ? 'border-t border-black/10 pt-8 mt-8' : ''}`}>
                      <ArticleCard
                        id={article.id}
                        title={article.title}
                        vertical={article.vertical}
                        tagline={article.tagline}
                        excerpt={article.excerpt}
                        date={article.date}
                        image={i === 0 ? leadImages[1] : undefined}
                        readTime="5 min read"
                        variant="hero-secondary"
                      />
                    </div>
                  ))}
                </div>

                {/* Tertiary stories — right column, headlines only */}
                <div className="lg:pl-10 py-10 flex flex-col">
                  {heroTertiary.map((article, i) => (
                    <div key={article.id} className={`flex-1 ${i > 0 ? 'border-t border-black/10 pt-6 mt-6' : ''}`}>
                      <ArticleCard
                        id={article.id}
                        title={article.title}
                        vertical={article.vertical}
                        tagline={null}
                        excerpt={null}
                        date={article.date}
                        readTime="5 min read"
                        variant="hero-tertiary"
                      />
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* ─── BAND 2: FEATURED ROW ─── */}
            {featuredArticles.length > 0 && (
              <section className="border-b border-black/10 px-6 md:px-10">
                <div className="flex items-baseline justify-between pt-10 pb-7">
                  <h3 className="font-serif font-black text-2xl tracking-tight">
                    Featured
                  </h3>
                  <a href="/dispatches" className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40 hover:text-[#C5A059] transition-colors">
                    See All
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12">
                  {featuredArticles.map((article, i) => (
                    <ArticleCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      vertical={article.vertical}
                      tagline={article.tagline}
                      excerpt={article.excerpt}
                      date={article.date}
                      image={i === 0 ? leadImages[2] : undefined}
                      readTime="5 min read"
                      variant="featured-card"
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ─── BAND 3: SUBSCRIPTION ─── */}
            <SubscriptionCard />

            {/* ─── BAND 4: BY VERTICAL ─── */}
            {verticalKeys.length > 0 && (
              <section className="px-6 md:px-10 pt-12 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                  {verticalKeys.map((vertical, vIdx) => (
                    <div
                      key={vertical}
                      className={`${vIdx === 0 ? 'md:pr-10' : vIdx === 1 ? 'md:px-10 md:border-x border-black/10' : 'md:pl-10'}`}
                    >
                      <div className="flex items-baseline justify-between pb-5 mb-6 border-b-2 border-black">
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
                            readTime="5 min read"
                            variant="category-list"
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

      {/* From Our Partners section */}
      <section className="max-w-[1200px] mx-auto w-full border-t border-black/10 bg-[#F9F9F7] px-6 md:px-10 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-serif font-black text-xl tracking-tight">
            From Our Partners
          </h3>
          <a href="#partners" className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#C5A059] hover:text-black transition-colors">
            See All
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { partner: 'Orbit', title: 'Building the Future Space Economy', desc: 'Washington, D.C. — Join the launch event shaping the $1.8-trillion space economy.' },
            { partner: 'Canada Europe Connects', title: 'Transatlantic Defence & Trade', desc: 'Ottawa — Defence procurement, dual-use technology, and trans-Atlantic trade corridors.' },
            { partner: 'The Next Vancouver', title: 'Campaign Starts June 19', desc: 'Vancouver — The city\'s future in infrastructure, housing, and economic transformation.' },
          ].map((item, i) => (
            <a key={i} href="#" className="group">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C5A059] font-bold">
                {item.partner}
              </span>
              <h4 className="font-serif font-bold text-base leading-tight mt-2 mb-2 group-hover:text-[#1A365D] transition-colors">
                {item.title}
              </h4>
              <p className="font-serif text-black/50 text-xs leading-relaxed">
                {item.desc}
              </p>
            </a>
          ))}
        </div>
      </section>

      <MagazineFooter />
    </div>
  )
}
