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

  // Distribute into 3 columns — lead article gets image, sub card every 5
  const columns: (typeof articles[0] | 'subscription')[][] = [[], [], []]
  let colIdx = 0
  articles.forEach((article, i) => {
    columns[colIdx].push(article)
    colIdx = (colIdx + 1) % 3
    if ((i + 1) % 5 === 0) {
      columns[colIdx].push('subscription')
      colIdx = (colIdx + 1) % 3
    }
  })

  const hasArticles = articles.length > 0

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

      {/* Main article grid */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full md:border-x border-black bg-[#F9F9F7]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black">
            {columns.map((col, cIdx) => (
              <div key={cIdx} className="flex flex-col">
                {col.map((item, idx) => (
                  item === 'subscription' ? (
                    <SubscriptionCard key={`sub-${cIdx}-${idx}`} />
                  ) : (
                    <ArticleCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      vertical={item.vertical}
                      tagline={item.tagline}
                      excerpt={item.excerpt}
                      date={item.date}
                      isLead={idx === 0}
                      image={idx === 0 ? leadImages[cIdx % leadImages.length] : undefined}
                      readTime="5 min read"
                    />
                  )
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* From Our Partners section */}
      <section className="max-w-[1400px] mx-auto w-full md:border-x border-black border-t bg-white px-6 md:px-12 py-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-mono text-[11px] tracking-[0.3em] uppercase text-black/40 font-bold">
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
