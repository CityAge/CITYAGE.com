import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { readMinutes } from '@/lib/magazine'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { ShareRow } from '@/components/share-row'

export const revalidate = 60
export const dynamic = 'force-dynamic'

const SITE_URL = 'https://cityage.com'

/** /magazine/[id] takes either the row uuid or its optional slug. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const lookupColumn = (param: string) => (UUID_RE.test(param) ? 'id' : 'slug')

function renderMarkdown(md: string): string {
  // Process line by line for clean, reliable rendering
  const lines = md.split('\n')
  const output: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    
    // Skip empty lines
    if (!line.trim()) {
      output.push('')
      continue
    }
    
    // Headings
    if (line.startsWith('### ')) {
      line = `<h3 class="font-serif font-bold text-[22px] md:text-[24px] text-black mt-12 mb-4 leading-snug">${applyInline(line.slice(4))}</h3>`
    } else if (line.startsWith('## ')) {
      line = `<h2 class="font-serif font-bold text-[26px] md:text-[30px] text-black mt-14 mb-5 leading-snug">${applyInline(line.slice(3))}</h2>`
    } else if (line.startsWith('# ')) {
      line = `<h1 class="font-serif font-black text-[30px] md:text-[36px] text-black mt-10 mb-5 leading-tight">${applyInline(line.slice(2))}</h1>`
    // Pull quote: one bold move. 24px under a heavy rule, short gold bar.
    } else if (line.startsWith('> ')) {
      line = `<figure class="my-10 pt-5 border-t-2 border-black"><p class="font-serif text-[24px] leading-[1.25] font-medium text-black m-0">${applyInline(line.slice(2))}</p><span class="block w-12 h-[2px] bg-[#C5A059] mt-5" aria-hidden="true"></span></figure>`
    // Horizontal rule
    } else if (line.trim() === '---') {
      line = '<hr class="border-black/10 my-12" />'
    // Bold-only line = a question (interviews) or a subheading: 19px, weight 600
    } else if (/^\*\*[^*]+\*\*$/.test(line.trim())) {
      line = `<p class="font-serif font-semibold text-[19px] leading-[1.35] text-black mt-8 mb-2">${applyInline(line)}</p>`
    // Regular paragraph
    } else {
      line = `<p class="type-body text-black/85 mb-6">${applyInline(line)}</p>`
    }
    
    output.push(line)
  }
  
  return output.join('\n')
}

function applyInline(text: string): string {
  return text
    // Strip bold markers from bold-only subheadings
    .replace(/^\*\*(.+?)\*\*$/, '$1')
    // Hyperlinks first (before bold/italic)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-[#1A365D] hover:text-[#C5A059] underline underline-offset-4 decoration-black/20 hover:decoration-[#C5A059] transition-colors font-medium">$1</a>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em class="italic text-black/70">$1</em>')
}

type ArticleMeta = {
  headline: string
  deck: string | null
  image_url: string | null
}

async function fetchArticleMeta(id: string): Promise<ArticleMeta | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  try {
    const res = await fetch(
      `${url}/rest/v1/magazine?select=headline,deck,image_url&${lookupColumn(id)}=eq.${encodeURIComponent(id)}&status=eq.published&limit=1`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        next: { revalidate: 60 },
      },
    )
    if (!res.ok) return null
    const rows = (await res.json()) as ArticleMeta[]
    return Array.isArray(rows) && rows[0]?.headline ? rows[0] : null
  } catch {
    return null
  }
}

/** Each article gets its own <title> and Open Graph title/description. */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const article = await fetchArticleMeta(id)
  if (!article) return {}

  const title = `${article.headline} — CityAge`
  const description = article.deck || undefined

  return {
    title,
    description,
    openGraph: {
      title: article.headline,
      description,
      url: `${SITE_URL}/magazine/${id}`,
      type: 'article',
      siteName: 'CityAge',
      images: article.image_url ? [{ url: article.image_url }] : undefined,
    },
  }
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
        .eq(lookupColumn(id), id)
        .eq('status', 'published')
        .single()

      article = data

      if (article) {
        const { data: rel } = await supabase
          .from('magazine')
          .select('id, headline, vertical, image_url, published_at, body')
          .eq('status', 'published')
          .eq('vertical', article.vertical)
          .neq('id', article.id)
          .order('published_at', { ascending: false })
          .limit(3)
        related = rel || []
      }
    }
  } catch (e) {
    console.error('Supabase error:', e)
  }

  if (!article) notFound()

  const html = renderMarkdown(article.body)
  // Share URLs: the public site, slug when the row has one, else the uuid path.
  const shareUrl = `${SITE_URL}/magazine/${article.slug || article.id}`
  const readMin = readMinutes(article.body)
  const dateLabel = new Date(article.published_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <article className="flex-grow">

        {/* ── ARTICLE HEADER ── */}
        <div className="border-b border-black/10">
          <div className="max-w-[800px] mx-auto px-6 pt-12 pb-10 text-center">

            {/* One meta line: section | (opinion) | date | read time */}
            <div className="type-meta flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-6">
              <span className="text-[#C5A059]">{article.vertical}</span>
              {article.sub_vertical ? (
                <>
                  <span className="text-black/25">|</span>
                  <span>{article.sub_vertical}</span>
                </>
              ) : null}
              <span className="text-black/25">|</span>
              <span>{dateLabel}</span>
              <span className="text-black/25">|</span>
              <span>{readMin} min read</span>
            </div>

            {/* Headline */}
            <h1 className="type-lead-h tracking-normal mb-5 text-black">
              {article.headline}
            </h1>

            {/* Deck */}
            {article.deck && (
              <p
                className="type-deck text-black/60 max-w-[640px] mx-auto mb-6 [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-1 hover:[&_a]:decoration-2"
                dangerouslySetInnerHTML={{ __html: applyInline(article.deck) }}
              />
            )}

            {/* Writer */}
            {article.author ? (
              <div className="flex items-baseline justify-center gap-2 mb-6">
                <span className="type-meta">Writer</span>
                <span className="font-serif text-[15px] text-black/80">{article.author}</span>
              </div>
            ) : null}

            {/* Share */}
            <div className="pt-1">
              <ShareRow url={shareUrl} title={article.headline} align="center" />
            </div>
          </div>
        </div>

        {/* ── HERO IMAGE ── */}
        {article.image_url && (
          <div className="max-w-[960px] mx-auto px-6 pt-10 pb-2">
            <div className="relative w-full aspect-[16/9] overflow-hidden">
              <img
                src={article.image_url}
                alt={article.headline}
                className="w-full h-full object-cover"
              />
            </div>
            {article.image_credit && (
              <p className="font-mono text-[9px] tracking-[0.1em] text-black/35 mt-2">
                {article.image_credit_url ? (
                  <a href={article.image_credit_url} target="_blank" rel="noopener" className="hover:text-black transition-colors">
                    {article.image_credit}
                  </a>
                ) : article.image_credit}
              </p>
            )}
          </div>
        )}

        {/* ── BODY + SIDEBAR ── */}
        <div className="max-w-[1100px] mx-auto px-6 md:px-10 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-16">

            {/* Body */}
            <div>
              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              {/* Share, again, after the last paragraph */}
              <div className="mt-2 pt-8 border-t border-[#D9D7D0]">
                <ShareRow url={shareUrl} title={article.headline} />
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                {related.length > 0 && (
                  <>
                    <div className="border-t-2 border-black pt-3 mb-6">
                      <span className="font-serif font-bold text-[18px] leading-none uppercase tracking-[0.02em] text-black">Recommendations</span>
                    </div>
                    <div className="space-y-8">
                      {related.map((a: any) => (
                        <div key={a.id}>
                          {a.image_url && (
                            <Link href={`/magazine/${a.id}`} className="block w-full aspect-[16/10] mb-3 overflow-hidden" tabIndex={-1} aria-hidden="true">
                              <img src={a.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                            </Link>
                          )}
                          <h4 className="font-serif font-medium text-[16px] leading-snug mb-2">
                            <Link href={`/magazine/${a.id}`} className="story-link">{a.headline}</Link>
                          </h4>
                          <span className="type-meta block">{readMinutes(a.body)} min read</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Subscribe nudge */}
                <div className="mt-12 bg-black text-white p-6">
                  <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C5A059] block mb-3">
                    The Intelligence Letter
                  </span>
                  <p className="font-serif text-white/60 text-[13px] leading-relaxed mb-5">
                    Daily intelligence for leaders of The Urban Planet.
                  </p>
                  <a href="/subscribe" className="block w-full bg-[#C5A059] text-black font-mono text-[9px] font-black tracking-[0.2em] uppercase py-2.5 text-center hover:bg-white transition-colors">
                    Subscribe Free
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>

      </article>

      <MagazineFooter />
    </div>
  )
}
