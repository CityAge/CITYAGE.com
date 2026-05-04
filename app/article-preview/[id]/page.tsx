import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import '../../redesign.css'

export const revalidate = 60
export const dynamic = 'force-dynamic'

/**
 * Article preview page in the new newspaper aesthetic.
 *
 * Fetches the same article data from the Supabase `magazine` table that the
 * existing `/magazine/[id]` route uses, but renders it with the new
 * `.cityage-redesign` styles so we can compare the two designs side-by-side.
 *
 * Try it: visit /article-preview/[same-id-as-magazine-route] on the preview URL.
 */

// ---- Markdown rendering (simple, server-side) ----
function applyInline(text: string): string {
  return text
    // Strip wrapping ** if the whole line is bold (treated as subheading separately)
    .replace(/^\*\*(.+?)\*\*$/, '$1')
    // Hyperlinks
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>'
    )
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []

  for (const raw of lines) {
    const line = raw.trim()

    if (!line) {
      out.push('')
      continue
    }

    if (line.startsWith('### ')) {
      out.push(`<h3>${applyInline(line.slice(4))}</h3>`)
    } else if (line.startsWith('## ')) {
      out.push(`<h2>${applyInline(line.slice(3))}</h2>`)
    } else if (line.startsWith('# ')) {
      out.push(`<h2>${applyInline(line.slice(2))}</h2>`)
    } else if (line === '---') {
      out.push('<hr />')
    } else if (line.startsWith('> ')) {
      out.push(`<blockquote>${applyInline(line.slice(2))}</blockquote>`)
    } else if (/^\*\*[^*]+\*\*$/.test(line)) {
      // Bold-only line = subheading
      out.push(`<h3>${applyInline(line)}</h3>`)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Simple list item
      out.push(`<li>${applyInline(line.slice(2))}</li>`)
    } else {
      out.push(`<p>${applyInline(line)}</p>`)
    }
  }

  // Wrap consecutive <li> blocks in <ul>
  const wrapped: string[] = []
  let inList = false
  for (const segment of out) {
    if (segment.startsWith('<li>')) {
      if (!inList) {
        wrapped.push('<ul>')
        inList = true
      }
      wrapped.push(segment)
    } else {
      if (inList) {
        wrapped.push('</ul>')
        inList = false
      }
      wrapped.push(segment)
    }
  }
  if (inList) wrapped.push('</ul>')

  return wrapped.join('\n')
}

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-CA', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'America/Toronto',
    })
  } catch {
    return ''
  }
}

export default async function ArticlePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let article: any = null

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (url && key) {
    try {
      const supabase = await createClient()
      const { data } = await supabase
        .from('magazine')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single()
      article = data
    } catch {
      article = null
    }
  }

  if (!article) {
    notFound()
  }

  const headline: string = article.headline || 'Untitled'
  const deck: string | null = article.deck || null
  const vertical: string | null = article.vertical || null
  const subVertical: string | null = article.sub_vertical || null
  const body: string = article.body || ''
  const imageUrl: string | null = article.image_url || null
  const readTime: number = article.read_time || 5
  const publishedAt: string | null = article.published_at || null

  const html = renderMarkdown(body)

  return (
    <div className="cityage-redesign">
      {/* Minimal site header so the article doesn't float in space */}
      <header className="site-header">
        <Link className="brand" href="/" aria-label="CITYAGE — Intelligence for the Urban Planet">
          <span className="brand-name">CITYAGE</span>
          <span className="brand-divider" aria-hidden="true">|</span>
          <span className="brand-tagline">Intelligence for the Urban Planet</span>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          <a href="/#signals">Signals</a>
          <a href="/#verticals">Verticals</a>
          <a href="/#pro">Pro</a>
          <a href="/#events">Events</a>
          <a href="/#partner">Partner</a>
        </nav>
        <a className="header-cta" href="/#pro">
          Join Pro
        </a>
      </header>

      <article className="article-page">
        <div className="article-hero">
          <div className="article-hero-inner">
            <div className="article-meta">
              {vertical && <span className="vertical-tag">{vertical}</span>}
              {subVertical && (
                <>
                  <span className="separator">/</span>
                  <span>{subVertical}</span>
                </>
              )}
              {publishedAt && (
                <>
                  <span className="separator">/</span>
                  <span>{formatDate(publishedAt)}</span>
                </>
              )}
              <span className="separator">/</span>
              <span>{readTime} min read</span>
            </div>

            <h1 className="article-headline">{headline}</h1>

            {deck && <p className="article-deck">{deck}</p>}

            <div className="article-byline">
              <span>
                By <strong>CITYAGE Editorial</strong>
              </span>
            </div>
          </div>
        </div>

        {imageUrl && (
          <div className="article-feature-image">
            <Image
              src={imageUrl}
              alt={headline}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}

        <div
          className="article-body"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="article-footer">
          <hr className="article-footer-divider" />
          <Link className="article-back" href="/">
            ← Back to CITYAGE
          </Link>
        </div>
      </article>

      <footer className="footer">
        <Link className="brand" href="/">
          <span className="brand-name">CITYAGE</span>
          <span className="brand-divider" aria-hidden="true">|</span>
          <span className="brand-tagline">Intelligence for the Urban Planet</span>
        </Link>
        <nav aria-label="Footer navigation">
          <a href="/#signals">Signals</a>
          <a href="/#pro">Pro</a>
          <a href="/#events">Events</a>
          <a href="/#partner">Partner</a>
        </nav>
      </footer>
    </div>
  )
}
