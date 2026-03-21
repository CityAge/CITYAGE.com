import { createClient } from '@/lib/supabase/server'
import { SponsorshipBanner } from '@/components/sponsorship-banner'
import { ColumnistStrip } from '@/components/columnist-strip'
import { MagazineHeader } from '@/components/magazine-header'
import { Navigation } from '@/components/navigation'
import { PartnerMarquee } from '@/components/partner-marquee'
import { Ticker } from '@/components/ticker'
import { ArticleCard } from '@/components/article-card'
import { SubscriptionCard } from '@/components/subscription-card'
import { MagazineFooter } from '@/components/magazine-footer'

export const revalidate = 60

// Available images to cycle through for lead articles
const images = ['/ottawa-feature.jpg', '/wildfire-evacuation.jpg', '/editor-portrait.jpg']

export default async function Home() {
  let briefs: any[] | null = null

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('briefs')
      .select('id, title, vertical, published_at, body')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(18)
    briefs = data
  } catch {
    // Supabase not configured yet — render empty state
    briefs = null
  }

  // Process briefs into article data
  const articles = (briefs ?? []).map((b, i) => {
    const tagline = b.body
      ?.split('\n')
      .find((l: string) => l.startsWith('*') && l.endsWith('*') && !l.includes('Defence.'))
      ?.replace(/\*/g, '')
      ?.trim() || null

    const date = new Date(b.published_at).toLocaleDateString('en-CA', {
      weekday: 'short', month: 'short', day: 'numeric',
      timeZone: 'America/Toronto',
    })

    return { id: b.id, title: b.title, vertical: b.vertical, tagline, date, index: i }
  })

  // Distribute into 3 columns with subscription cards every 5 articles
  const columns: (typeof articles[0] | 'subscription')[][] = [[], [], []]
  let colIdx = 0
  articles.forEach((article, i) => {
    columns[colIdx].push(article)
    colIdx = (colIdx + 1) % 3
    // Insert subscription card after every 5th article
    if ((i + 1) % 5 === 0) {
      columns[colIdx].push('subscription')
      colIdx = (colIdx + 1) % 3
    }
  })

  const hasArticles = articles.length > 0

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <SponsorshipBanner />
      <ColumnistStrip />
      <MagazineHeader />
      <Navigation />
      <PartnerMarquee />
      <Ticker />

      {/* Main article grid */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full md:border-x border-black bg-white">
        {!hasArticles ? (
          <div className="p-32 text-center">
            <p className="font-serif italic text-3xl text-black/20 uppercase tracking-[0.2em] mb-4">
              Establishing Link...
            </p>
            <p className="font-mono text-[11px] text-black/30 tracking-widest uppercase">
              Intelligence briefs will appear here once your Supabase pipeline is active
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black border-b border-black">
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
                      date={item.date}
                      isFirstInColumn={idx === 0}
                      image={idx === 0 ? images[cIdx % images.length] : undefined}
                    />
                  )
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      <MagazineFooter />
    </div>
  )
}
