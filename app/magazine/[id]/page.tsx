import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'
import { Navigation } from '@/components/navigation'
import { MagazineFooter } from '@/components/magazine-footer'

export const revalidate = 60

function renderMarkdown(md: string): string {
  return md
    // Headings
    .replace(/^### (.+)$/gm, '<h3 class="font-serif font-bold text-[22px] md:text-[24px] text-black mt-12 mb-4 leading-snug">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-serif font-bold text-[26px] md:text-[30px] text-black mt-14 mb-5 leading-snug">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-serif font-black text-[30px] md:text-[36px] text-black mt-10 mb-5 leading-tight">$1</h1>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="border-black/10 my-12" />')
    // Bold-only lines (subheadings)
    .replace(/^\*\*(.+?)\*\*$/gm, '<p class="font-serif font-bold text-[18px] md:text-[20px] text-black mt-10 mb-3">$1</p>')
    // Inline bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-black/70">$1</em>')
    // Hyperlinks
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-[#1A365D] hover:text-[#C5A059] underline underline-offset-4 decoration-black/20 hover:decoration-[#C5A059] transition-colors font-medium">$1</a>')
    // Body paragraphs — catch any remaining non-empty non-tag lines
    .replace(/^(?!<[h1-6|p|hr|strong|em|a])(.+\S.*)$/gm, '<p class="font-serif text-[18px] md:text-[19px] leading-[1.82] text-black/85 mb-6">$1</p>')
    // Clean up empty paragraphs
    .replace(/<p[^>]*>\s*<\/p>/g, '')
}

export default async function MagazineArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  let article: any = null
  let related: any[] = []

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = await createClient()

      const { data } = await supabase
        .from('magazine')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single()

      article = data

      if (article) {
        const { data: rel } = await supabase
          .from('magazine')
          .select('id, headline, vertical, image_url, image_credit, image_credit_url, read_time, published_at')
          .eq('status', 'published')
          .eq('vertical', article.vertical)
          .neq('id', id)
          .order('published_at', { ascending: false })
          .limit(3)
        related = rel || []
      }
    }
  } catch (e) {
    console.error('Supabase error:', e)
  }

  if (!article) notFound()

  const relatedArticles = (related ?? []).map((a: any) => ({
    id: a.id,
    title: a.headline,
    vertical: a.vertical,
    image: a.image_url,
    readTime: `${a.read_time || 5} min read`,
  }))

  const sidebarArticles = relatedArticles.slice(0, 3)
  const bottomArticles = relatedArticles.slice(3, 6)

  const date = new Date(article.published_at).toLocaleDateString('en-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'America/Toronto'
  })

  const shortDate = new Date(article.published_at).toLocaleDateString('en-CA', {
    month: 'long', day: 'numeric', year: 'numeric',
    timeZone: 'America/Toronto'
  }).toUpperCase()

  const html = renderMarkdown(article.body)

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <CampaignBanner />
      <MagazineHeader />
      <Navigation />

      <article className="flex-grow">

        {/* ─── CENTERED ARTICLE HEADER ─── */}
        <div className="border-b border-black/10">
          <div className="max-w-[900px] mx-auto px-6 pt-10 pb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-black/70">
                {article.vertical}
              </span>
              {article.sub_vertical && (
                <>
                  <span className="text-black/20 text-[8px]">|</span>
                  <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-black/40">
                    {article.sub_vertical}
                  </span>
                </>
              )}
            </div>

            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/60 mb-6">
              {(article.dateline_city || 'VANCOUVER').toUpperCase()} · {new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).toUpperCase()} · {new Date(article.published_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} GMT · {article.read_time || 5} Min Read
            </p>

            <h1 className="font-serif font-black text-3xl md:text-[2.75rem] leading-[1.15] tracking-tight mb-5 max-w-[750px] mx-auto">
              {article.headline}
            </h1>

            {article.deck && (
              <p className="font-serif text-black/65 text-lg md:text-xl leading-relaxed max-w-[650px] mx-auto mb-6">
                {article.deck}
              </p>
            )}

            <div className="flex items-center justify-center gap-4 pt-2">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/60">Share</span>
              <a href={`https://x.com/intent/tweet?url=${encodeURIComponent(`https://cityagemag.vercel.app/magazine/${id}`)}&text=${encodeURIComponent(article.headline)}`} target="_blank" rel="noopener" className="text-black/50 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://cityagemag.vercel.app/magazine/${id}`)}`} target="_blank" rel="noopener" className="text-black/50 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href={`mailto:?subject=${encodeURIComponent(article.headline)}&body=${encodeURIComponent(`https://cityagemag.vercel.app/magazine/${id}`)}`} className="text-black/50 hover:text-black transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* ─── HERO IMAGE ─── */}
        {article.image_url && (
          <div className="max-w-[1000px] mx-auto px-6 py-8">
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <img
                src={article.image_url}
                alt={article.headline}
                className="w-full h-full object-cover"
              />
            </div>
            {article.image_credit && (
              <p className="font-mono text-[9px] tracking-[0.1em] text-black/40 mt-2">
                <a href={article.image_credit_url || '#'} target="_blank" rel="noopener" className="hover:text-black transition-colors">
                  {article.image_credit}
                </a>
              </p>
            )}
          </div>
        )}

        {/* ─── BODY + SIDEBAR ─── */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16">
            <div className="max-w-[720px]">
              <div className="brief-content" dangerouslySetInnerHTML={{ __html: html }} />
              <div className="border-t border-black/10 mt-12 pt-8">
                <p className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-black/50 mb-6">CityAge Media</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-black/70">{article.vertical}</span>
                    <span className="text-black/20 text-[8px]">·</span>
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/60">Published {date}</span>
                  </div>
                  <Link href="/" className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/60 hover:text-black transition-colors">
                    ← Home
                  </Link>
                </div>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="border-t-2 border-black pt-4 mb-6">
                  <h3 className="font-serif font-black text-base uppercase tracking-tight">Recommendations</h3>
                </div>
                <div className="space-y-6">
                  {sidebarArticles.map((a) => (
                    <Link key={a.id} href={`/magazine/${a.id}`} className="block group">
                      {a.image ? (
                        <div className="w-full aspect-[4/3] mb-3 overflow-hidden">
                          <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-full aspect-[4/3] mb-3 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-black/10">Photograph</span>
                        </div>
                      )}
                      <h4 className="font-serif font-bold text-[14px] leading-snug group-hover:text-[#1A365D] transition-colors mb-1">{a.title}</h4>
                      <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">{a.readTime}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ─── RELATED ─── */}
        {bottomArticles.length > 0 && (
          <div className="border-t border-black/10">
            <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-14">
              <h3 className="font-serif font-black text-2xl uppercase tracking-tight italic mb-8">Related</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {bottomArticles.map((a) => (
                  <Link key={a.id} href={`/magazine/${a.id}`} className="block group">
                    {a.image ? (
                      <div className="w-full aspect-[4/3] mb-4 overflow-hidden">
                        <img src={a.image} alt={a.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-full aspect-[4/3] mb-4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="font-mono text-[8px] tracking-[0.2em] uppercase text-black/10">Photograph</span>
                      </div>
                    )}
                    <h4 className="font-serif font-bold text-base leading-snug group-hover:text-[#1A365D] transition-colors mb-2">{a.title}</h4>
                    <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">{a.readTime}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </article>

      <MagazineFooter />
    </div>
  )
}
