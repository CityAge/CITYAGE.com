import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MagazineFooter } from '@/components/magazine-footer'

export const revalidate = 60

export const metadata = {
  title: 'Daybreak Dubai — A CityAge Intelligence Letter',
  description: 'Money. Luxury. Real Estate. Restaurants. Wellness. The morning intelligence of a very good life. Before anyone at dinner knows.',
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="font-display font-bold text-xl md:text-2xl text-black mt-10 mb-4">$1</h3>')
    .replace(/^## Before Sunrise$/gm, '<h2 class="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-[#C5A059] mt-12 mb-5">Before Sunrise</h2>')
    .replace(/^## The Lead$/gm, '<h2 class="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-black/50 mt-12 mb-5">The Lead</h2>')
    .replace(/^## The Market$/gm, '<h2 class="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-black/50 mt-12 mb-5">The Market</h2>')
    .replace(/^## The Table$/gm, '<h2 class="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-black/50 mt-12 mb-5">The Table</h2>')
    .replace(/^## The Life$/gm, '<h2 class="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-black/50 mt-12 mb-5">The Life</h2>')
    .replace(/^## The Number$/gm, '<h2 class="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-[#C5A059] mt-12 mb-5">The Number</h2>')
    .replace(/^## (.+)$/gm, '<h2 class="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-black/50 mt-12 mb-5">$1</h2>')
    .replace(/^# (.+)$/gm, '')
    .replace(/^\*\*(.+?)\*\*$/gm, '<p class="font-serif font-bold text-black text-[17px] md:text-[19px] leading-[1.8] mb-4">$1</p>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-black/55">$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-black underline decoration-[#C5A059] decoration-[1.5px] underline-offset-[3px] hover:decoration-black transition-colors">$1</a>')
    .replace(/^---$/gm, '<hr class="border-black/8 my-10" />')
    .replace(/^(?!<[h|p|s|e|a|u|hr])(.*\S.*)$/gm, '<p class="font-serif text-black/80 text-[17px] md:text-[19px] leading-[1.85] mb-5">$1</p>')
}

export default async function DaybreakDubaiPage() {
  let brief: any = null
  let archive: any[] = []

  try {
    const supabase = await createClient()

    // Get today's brief (most recent published)
    const { data: latest } = await supabase
      .from('briefs')
      .select('id, title, body, published_at, status')
      .eq('vertical', 'Daybreak Dubai')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .single()

    brief = latest

    // Get archive (last 30 published briefs)
    const { data: archiveData } = await supabase
      .from('briefs')
      .select('id, title, published_at')
      .eq('vertical', 'Daybreak Dubai')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(30)

    archive = archiveData || []
  } catch (e) {
    console.error('Supabase error:', e)
  }

  const todayDate = brief
    ? new Date(brief.published_at).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        timeZone: 'Asia/Dubai'
      })
    : ''

  const dubaiTime = brief
    ? new Date(brief.published_at).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', hour12: true,
        timeZone: 'Asia/Dubai'
      })
    : ''

  // Strip the # Daybreak Dubai header and dateline from body to avoid duplication
  const cleanedBody = brief?.body
    ?.split('\n')
    .filter((l: string) => {
      const trimmed = l.trim()
      if (trimmed.startsWith('# Daybreak Dubai')) return false
      if (trimmed.startsWith('*') && trimmed.includes('Dubai') && trimmed.includes('202') && trimmed.endsWith('*')) return false
      return true
    })
    .join('\n') || ''

  const html = brief ? renderMarkdown(cleanedBody) : ''

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">

      {/* ─── MASTHEAD ─── */}
      <header className="border-b-2 border-black">
        {/* Top utility bar */}
        <div className="border-b border-black/10 px-6 py-2.5">
          <div className="max-w-[700px] mx-auto flex items-center justify-between">
            <a href="https://cityage.com" className="font-mono text-[9px] tracking-[0.25em] uppercase text-black/40 hover:text-black transition-colors">
              ← CityAge
            </a>
            <a href="#subscribe" className="bg-black text-[#F9F9F7] px-6 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase hover:bg-[#C5A059] hover:text-black transition-all">
              Subscribe
            </a>
          </div>
        </div>

        {/* Wordmark */}
        <div className="px-6 py-10 md:py-14 text-center">
          <div className="max-w-[700px] mx-auto">
            <h1 className="font-display font-black text-[2.8rem] md:text-[4.5rem] leading-[0.9] tracking-tight text-black">
              Daybreak<br />Dubai
            </h1>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/40 mt-5">
              A CityAge Intelligence Letter
            </p>
          </div>
        </div>
      </header>

      {/* ─── SECTION TABS ─── */}
      <nav className="border-b border-black/15 px-4 overflow-x-auto">
        <div className="max-w-[700px] mx-auto flex items-center justify-center gap-0">
          {['Before Sunrise', 'The Market', 'The Table', 'The Life'].map((name, i) => (
            <span key={name} className="flex items-center shrink-0">
              {i > 0 && <span className="text-black/15 mx-2 md:mx-3">·</span>}
              <span className="px-2 md:px-3 py-3 font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-black/50">
                {name}
              </span>
            </span>
          ))}
        </div>
      </nav>

      {/* ─── TODAY'S BRIEF ─── */}
      {brief ? (
        <main className="flex-grow">
          {/* Date bar */}
          <div className="border-b border-black/8 px-6 py-4 text-center">
            <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/35">
              {todayDate}
            </span>
          </div>

          {/* Brief body */}
          <article className="max-w-[660px] mx-auto px-6 py-10 md:py-14">
            <div
              className="brief-content"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </article>

          {/* Footer tagline */}
          <div className="border-t border-black/8 px-6 py-8 text-center">
            <p className="font-serif italic text-black/35 text-[15px]">
              Money. Luxury. Real Estate. Restaurants. Wellness.
            </p>
          </div>
        </main>
      ) : (
        <main className="flex-grow flex items-center justify-center py-32">
          <div className="text-center px-6">
            <p className="font-display text-3xl md:text-4xl font-bold text-black/20 mb-4">
              Before sunrise
            </p>
            <p className="font-serif text-black/40 text-lg">
              The first Daybreak Dubai brief is on its way.
            </p>
          </div>
        </main>
      )}

      {/* ─── SUBSCRIBE ─── */}
      <section id="subscribe" className="bg-black px-6 py-16 md:py-20">
        <div className="max-w-[500px] mx-auto text-center">
          <h2 className="font-display font-black text-2xl md:text-3xl text-white mb-3">
            Daybreak Dubai
          </h2>
          <p className="font-serif text-white/50 text-[15px] leading-relaxed mb-8">
            What opened. What sold. What it cost.<br />
            Before anyone at dinner knows.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 px-4 py-3 font-mono text-[12px] tracking-wide focus:outline-none focus:border-[#C5A059] transition-colors"
            />
            <button className="bg-[#C5A059] text-black px-6 py-3 font-mono text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors shrink-0">
              Subscribe
            </button>
          </div>
          <p className="font-mono text-[9px] text-white/20 tracking-wide mt-4 uppercase">
            Free · Daily · 5 minutes · Dubai time
          </p>
        </div>
      </section>

      {/* ─── ARCHIVE ─── */}
      {archive.length > 1 && (
        <section className="border-t border-black/10 px-6 py-14">
          <div className="max-w-[660px] mx-auto">
            <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/40 mb-8">
              Archive
            </h3>
            <div className="space-y-0">
              {archive.slice(1).map((b: any) => (
                <Link
                  key={b.id}
                  href={`/dispatches/${b.id}`}
                  className="flex items-baseline justify-between py-3 border-b border-black/5 group"
                >
                  <span className="font-serif text-[15px] text-black/70 group-hover:text-black transition-colors">
                    {b.title}
                  </span>
                  <span className="font-mono text-[9px] text-black/25 tracking-wide shrink-0 ml-4">
                    {new Date(b.published_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                      timeZone: 'Asia/Dubai'
                    })}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FOOTER ─── */}
      <footer className="border-t-2 border-black px-6 py-10 text-center">
        <a href="https://cityage.com" className="font-display font-black text-xl tracking-tight text-black hover:text-[#C5A059] transition-colors">
          CityAge
        </a>
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/30 mt-2">
          Intelligence for The Urban Planet
        </p>
        <p className="font-mono text-[9px] tracking-[0.15em] text-black/20 mt-6">
          © {new Date().getFullYear()} The Influence Company & CityAge Media
        </p>
      </footer>
    </div>
  )
}
