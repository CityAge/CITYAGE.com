import { createClient } from '@/lib/supabase/server'
import { MagazineHeader } from '@/components/magazine-header'
import { ArticleCard } from '@/components/article-card'
import { MagazineFooter } from '@/components/magazine-footer'
import { HeroGrid } from '@/components/hero-grid'
import { SpeakersReel } from '@/components/speakers-reel'
import { StudioHouse } from '@/components/studio-house'
import { ROOM_PIECES } from '@/lib/rooms'

export const revalidate = 60
export const dynamic = 'force-dynamic'

type PaperStory = {
  id: string
  title: string
  vertical: string
  tagline: string | null
  excerpt: string | null
  date: string
  index: number
  image: string | null
  readTime: string
  source: 'magazine' | 'briefs' | 'room'
  href?: string
}

function roomStories(): PaperStory[] {
  return ROOM_PIECES.map((room, i) => ({
    id: room.id,
    title: room.title,
    vertical: room.vertical,
    tagline: room.tagline,
    excerpt: room.excerpt,
    date: room.date,
    index: i,
    image: room.image,
    readTime: room.readTime,
    source: 'room' as const,
    href: room.href,
  }))
}

export default async function Home() {
  let articles: PaperStory[] = []

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (url && key) {
      const supabase = await createClient()

      const { data: magArticles } = await supabase
        .from('magazine')
        .select('id, headline, deck, body, vertical, sub_vertical, image_url, read_time, published_at, featured')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(24)

      if (magArticles && magArticles.length > 0) {
        articles = magArticles.map((a: any, i: number) => {
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
            excerpt: a.deck || bodyExcerpt || null,
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

  const rooms = roomStories()
  const magazineLead = articles[0] || null
  const heroLead = magazineLead || rooms[0] || null
  const injectedRooms = magazineLead ? rooms : rooms.slice(1)
  const rest = [...injectedRooms, ...articles.slice(magazineLead ? 1 : 0)]

  const heroSecondary = rest.slice(0, 4)
  const heroTertiary = rest.slice(4, 10)
  const featuredArticles = articles.slice(11, 15)
  const remainingArticles = articles.slice(15)
  const linkPrefix = articles[0]?.source === 'magazine' ? '/magazine' : '/dispatches'

  const byVertical: Record<string, PaperStory[]> = {}
  remainingArticles.forEach((a) => {
    if (!byVertical[a.vertical]) byVertical[a.vertical] = []
    byVertical[a.vertical].push(a)
  })
  const verticalKeys = Object.keys(byVertical).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <SpeakersReel />

      <main className="flex-grow max-w-[1400px] mx-auto w-full bg-[#F9F9F7]">
        <div id="forums">
          <HeroGrid
            leadColumn={
              heroLead ? (
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
                  linkPrefix={heroLead.source === 'room' ? '' : linkPrefix}
                  href={heroLead.href}
                />
              ) : null
            }
            middleColumn={
              <div className="flex flex-col">
                {heroSecondary.map((article, i) => (
                  <div key={article.id} className={`${i > 0 ? 'border-t border-black/10 pt-10 mt-10' : ''}`}>
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
                      linkPrefix={article.source === 'room' ? '' : linkPrefix}
                      href={article.href}
                    />
                  </div>
                ))}
              </div>
            }
            sidebarColumn={
              <>
                <div id="letter" className="bg-black text-white p-8 flex flex-col">
                  <h3 className="font-serif font-black text-lg uppercase tracking-tight mb-1">
                    The Influence Letter
                  </h3>
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C5A059] mb-6">
                    Daily Intelligence Brief
                  </span>

                  <p className="font-serif italic text-white/70 text-[15px] leading-relaxed mb-3">
                    Intelligence for the urban planet.
                  </p>
                  <p className="font-serif text-white/50 text-[13px] leading-relaxed mb-6">
                    Everything happens on the earth’s 2 percent. Intelligence on infrastructure, defence, space, energy, and food systems. Delivered before markets open.
                  </p>

                  <div className="mb-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full bg-white/10 border border-white/20 px-4 py-2.5 font-mono text-[11px] tracking-wider text-white placeholder-white/30 uppercase outline-none focus:border-[#C5A059] transition-colors mb-2"
                    />
                    <button className="w-full bg-[#C5A059] text-black py-2.5 font-mono text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white transition-colors">
                      Subscribe Free
                    </button>
                  </div>
                </div>

                {heroTertiary.length > 0 && (
                  <div className="pt-8 space-y-6">
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
                          linkPrefix={article.source === 'room' ? '' : linkPrefix}
                          href={article.href}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>
            }
          />
        </div>

      </main>

      <StudioHouse />

      <main className="max-w-[1400px] mx-auto w-full bg-[#F9F9F7]">

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
              {featuredArticles.map((article) => (
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
                  href={article.href}
                />
              ))}
            </div>
          </section>
        )}

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
                        href={article.href}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <MagazineFooter />
    </div>
  )
}
