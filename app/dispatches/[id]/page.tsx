import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MagazineHeader } from '@/components/magazine-header'
import { Navigation } from '@/components/navigation'
import { MagazineFooter } from '@/components/magazine-footer'

export const revalidate = 60

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="font-serif font-bold text-xl md:text-2xl text-black mt-12 mb-4">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="font-serif font-bold text-2xl md:text-3xl text-black mt-14 mb-4">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="font-serif font-black text-3xl md:text-4xl text-black mt-8 mb-4">$1</h1>')
    .replace(/^\*\*(.+?)\*\*$/gm, '<p class="font-mono font-bold text-black/70 text-sm tracking-wide mt-8 mb-3 uppercase">$1</p>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-black/70">$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-[#1A365D] hover:text-[#C5A059] underline underline-offset-4 decoration-black/20 hover:decoration-[#C5A059] transition-colors">$1</a>')
    .replace(/^---$/gm, '<hr class="border-black/10 my-10" />')
    .replace(/^(?!<[h|p|s|e|a|u|hr])(.*\S.*)$/gm, '<p class="font-serif text-black/75 text-[17px] md:text-[19px] leading-[1.8] mb-5">$1</p>')
}

export default async function BriefPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: brief } = await supabase
    .from('briefs')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (!brief) notFound()

  const date = new Date(brief.published_at).toLocaleDateString('en-CA', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'America/Toronto'
  })

  // Extract tagline/deck from body
  const tagline = brief.body
    ?.split('\n')
    .find((l: string) => l.startsWith('*') && l.endsWith('*') && l.length > 10)
    ?.replace(/\*/g, '')
    ?.trim() || null

  // Strip the title, tagline, and first header from body to avoid duplication
  const cleanedBody = brief.body
    ?.split('\n')
    .filter((l: string) => {
      const trimmed = l.trim()
      // Remove lines that match the title
      if (trimmed === `# ${brief.title}` || trimmed === brief.title) return false
      // Remove the first H1/H2 if it matches the title
      if (trimmed.startsWith('# ') && trimmed.includes(brief.title.split('—')[0]?.trim())) return false
      if (trimmed.startsWith('## ') && trimmed.includes(brief.title.split('—')[0]?.trim())) return false
      // Remove tagline line (italic)
      if (tagline && trimmed === `*${tagline}*`) return false
      // Remove standalone date/read-time lines near the top
      if (trimmed.match(/^Sunrise\s*·/i)) return false
      return true
    })
    .join('\n') || ''

  const html = renderMarkdown(cleanedBody)

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      {/* Full masthead */}
      <MagazineHeader />

      {/* Navigation */}
      <Navigation />

      {/* Article content */}
      <article className="flex-grow">
        {/* Article header — full width with contained content */}
        <div className="border-b border-black/10">
          <div className="max-w-[720px] mx-auto px-6 pt-10 pb-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-8">
              <Link href="/" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors">
                Home
              </Link>
              <span className="font-mono text-[9px] text-black/20">/</span>
              <Link href="/dispatches" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors">
                Dispatches
              </Link>
              <span className="font-mono text-[9px] text-black/20">/</span>
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/40">
                {brief.vertical}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-3 mb-5">
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-black/70">
                {brief.vertical}
              </span>
              <span className="text-black/20 text-[8px]">·</span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-black/40">
                {date}
              </span>
              <span className="text-black/20 text-[8px]">·</span>
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-black/40">
                5 Min Read
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif font-black text-3xl md:text-[2.75rem] leading-[1.15] tracking-tight mb-5">
              {brief.title}
            </h1>

            {/* Deck / subtitle */}
            {tagline && (
              <p className="font-serif text-black/50 text-lg md:text-xl leading-relaxed">
                {tagline}
              </p>
            )}
          </div>
        </div>

        {/* Article body */}
        <div className="max-w-[720px] mx-auto px-6 py-12 md:py-16">
          <div
            className="brief-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        {/* Article footer */}
        <div className="border-t border-black/10">
          <div className="max-w-[720px] mx-auto px-6 py-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-black/70">
                  {brief.vertical}
                </span>
                <span className="text-black/20 text-[8px]">·</span>
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/40">
                  Published {date}
                </span>
              </div>
              <Link href="/dispatches" className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#C5A059] hover:text-black transition-colors">
                ← All Dispatches
              </Link>
            </div>
          </div>
        </div>

        {/* Read next section */}
        <div className="border-t border-black/10 bg-[#F5F3EF]">
          <div className="max-w-[720px] mx-auto px-6 py-12">
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-black/30 font-bold block mb-6">
              Continue Reading
            </span>
            <Link href="/dispatches" className="group block">
              <span className="font-serif font-bold text-xl group-hover:text-[#1A365D] transition-colors">
                Browse all dispatches from The Urban Planet →
              </span>
            </Link>
          </div>
        </div>
      </article>

      <MagazineFooter />
    </div>
  )
}
