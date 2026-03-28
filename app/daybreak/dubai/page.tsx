import { createClient } from '@/lib/supabase/server'

export const revalidate = 0

export const metadata = {
  title: 'Daybreak Dubai — A CityAge Intelligence Letter',
  description: 'Money. Luxury. Real Estate. Restaurants. Wellness. The morning intelligence of a very good life. Before anyone at dinner knows.',
}

function renderMarkdown(md: string): string {
  return md
    .replace(/^# (.+)$/gm, '')
    .replace(/^\*(.+)\*$/gm, '')
    .replace(/^## Before Sunrise$/gm, '<h2 class="section-head gold">Before Sunrise</h2>')
    .replace(/^## The Lead$/gm, '<h2 class="section-head">The Lead</h2>')
    .replace(/^## The Market$/gm, '<h2 class="section-head">The Market</h2>')
    .replace(/^## The Table$/gm, '<h2 class="section-head">The Table</h2>')
    .replace(/^## The Life$/gm, '<h2 class="section-head">The Life</h2>')
    .replace(/^## The Number$/gm, '<h2 class="section-head gold">The Number</h2>')
    .replace(/^## (.+)$/gm, '<h2 class="section-head">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="story-head">$1</h3>')
    .replace(/^---$/gm, '<hr class="divider" />')
    .replace(/^\*\*(.+?)\*\*$/gm, '<p class="market-lead">$1</p>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="source-link">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^(?!<[h2|h3|p|hr|a|s])(.*\S.*)$/gm, '<p class="body-text">$1</p>')
}

export default async function DaybreakDubaiPage() {
  let brief: any = null
  let archive: any[] = []

  try {
    const supabase = await createClient()

    const { data: latest } = await supabase
      .from('briefs')
      .select('id, title, body, published_at')
      .eq('vertical', 'Daybreak Dubai')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1)
      .single()

    brief = latest

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

  const dubaiNow = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Dubai',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  const dubaiHour = parseInt(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', hour12: false }))
  const greeting = dubaiHour < 12 ? 'Good morning' : dubaiHour < 17 ? 'Good afternoon' : 'Good evening'

  const briefDate = brief
    ? new Date(brief.published_at).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        timeZone: 'Asia/Dubai',
      })
    : ''

  const cleanedBody = brief?.body
    ?.split('\n')
    .filter((l: string) => {
      const t = l.trim()
      if (t.startsWith('# Daybreak Dubai')) return false
      if (t.startsWith('*') && t.endsWith('*') && t.includes('Dubai') && t.includes('202')) return false
      return true
    })
    .join('\n') || ''

  const html = brief ? renderMarkdown(cleanedBody) : ''

  return (
    <>
      <style>{`
        .section-head {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.4);
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .section-head.gold { color: #C5A059; }
        .story-head {
          font-family: var(--font-serif, serif);
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: #000;
          margin-top: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .body-text {
          font-family: var(--font-serif, serif);
          font-size: 17px;
          line-height: 1.9;
          color: rgba(0,0,0,0.75);
          margin-bottom: 1.25rem;
        }
        .market-lead {
          font-family: var(--font-serif, serif);
          font-size: 17px;
          font-weight: 700;
          line-height: 1.6;
          color: #000;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .source-link {
          color: #000;
          text-decoration: underline;
          text-decoration-color: #C5A059;
          text-decoration-thickness: 1.5px;
          text-underline-offset: 3px;
          transition: text-decoration-color 0.2s;
        }
        .source-link:hover { text-decoration-color: #000; }
        .divider {
          border: none;
          border-top: 1px solid rgba(0,0,0,0.08);
          margin: 3rem 0;
        }
        strong { font-weight: 700; color: #000; }
        em { font-style: italic; color: rgba(0,0,0,0.55); }
      `}</style>

      <div className="min-h-screen bg-[#F9F9F7]">

        {/* ─── MASTHEAD ─── */}
        <header className="border-b-2 border-black">
          {/* Top bar */}
          <div className="border-b border-black/10 px-6 py-2.5">
            <div className="max-w-[720px] mx-auto flex items-center justify-between">
              <a href="https://cityagemag.vercel.app" className="font-mono text-[9px] tracking-[0.25em] uppercase text-black/40 hover:text-black transition-colors">
                ← CityAge
              </a>
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/30">
                {dubaiNow} · Dubai
              </span>
              <a href="#subscribe" className="bg-black text-[#F9F9F7] px-5 py-1.5 font-mono text-[9px] tracking-[0.2em] uppercase hover:bg-[#C5A059] hover:text-black transition-all">
                Subscribe
              </a>
            </div>
          </div>

          {/* Wordmark */}
          <div className="px-6 py-10 md:py-14 text-center">
            <div className="max-w-[720px] mx-auto">
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C5A059] mb-4">
                A CityAge Intelligence Letter
              </p>
              <h1 className="font-serif font-black text-[3.2rem] md:text-[5rem] leading-[0.9] tracking-tight text-black">
                Daybreak<br />Dubai
              </h1>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/30 mt-5">
                Money · Luxury · Real Estate · Restaurants · Wellness
              </p>
            </div>
          </div>
        </header>

        {/* ─── BRIEF ─── */}
        {brief ? (
          <main>
            {/* Date bar */}
            <div className="border-b border-black/8 px-6 py-4 bg-black">
              <div className="max-w-[720px] mx-auto flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
                  {briefDate}
                </span>
                <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#C5A059]">
                  {greeting} · Dubai
                </span>
              </div>
            </div>

            {/* Brief body */}
            <article className="max-w-[680px] mx-auto px-6 py-12 md:py-16">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </article>

            {/* Footer tagline */}
            <div className="border-t border-black/8 px-6 py-8 text-center">
              <p className="font-serif italic text-black/30 text-[14px]">
                Before anyone at dinner knows.
              </p>
            </div>
          </main>
        ) : (
          <main className="flex-grow flex items-center justify-center py-40">
            <div className="text-center px-6">
              <p className="font-serif font-black text-4xl text-black/10 mb-3">
                Before sunrise
              </p>
              <p className="font-serif text-black/30 text-lg">
                The first Daybreak Dubai brief arrives tomorrow morning.
              </p>
            </div>
          </main>
        )}

        {/* ─── SUBSCRIBE ─── */}
        <section id="subscribe" className="bg-black px-6 py-16 md:py-20">
          <div className="max-w-[500px] mx-auto text-center">
            <h2 className="font-serif font-black text-2xl md:text-3xl text-white mb-2">
              Daybreak Dubai
            </h2>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C5A059] mb-6">
              Daily · Free · 5 minutes · Dubai time
            </p>
            <p className="font-serif text-white/40 text-[15px] leading-relaxed mb-8">
              What opened. What sold. What it cost.<br />
              Before anyone at dinner knows.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/8 border border-white/15 text-white placeholder-white/25 px-4 py-3 font-mono text-[12px] tracking-wide focus:outline-none focus:border-[#C5A059] transition-colors"
              />
              <button className="bg-[#C5A059] text-black px-7 py-3 font-mono text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        {/* ─── ARCHIVE ─── */}
        {archive.length > 1 && (
          <section className="border-t border-black/10 px-6 py-12">
            <div className="max-w-[680px] mx-auto">
              <h3 className="font-mono text-[9px] tracking-[0.3em] uppercase text-black/30 mb-8">
                Archive
              </h3>
              <div className="divide-y divide-black/6">
                {archive.slice(1).map((b: any) => (
                  <a
                    key={b.id}
                    href={`/dispatches/${b.id}`}
                    className="flex items-baseline justify-between py-4 group"
                  >
                    <span className="font-serif text-[15px] text-black/60 group-hover:text-black transition-colors">
                      {new Date(b.published_at).toLocaleDateString('en-US', {
                        weekday: 'long', month: 'long', day: 'numeric',
                        timeZone: 'Asia/Dubai',
                      })}
                    </span>
                    <span className="font-mono text-[9px] text-black/20 tracking-wide shrink-0 ml-4 group-hover:text-[#C5A059] transition-colors">
                      Read →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── FOOTER ─── */}
        <footer className="border-t-2 border-black px-6 py-10 text-center">
          <a href="https://cityagemag.vercel.app" className="font-serif font-black text-xl tracking-tight text-black hover:text-[#C5A059] transition-colors">
            CityAge
          </a>
          <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/25 mt-2">
            Intelligence for The Urban Planet
          </p>
          <p className="font-mono text-[9px] tracking-[0.15em] text-black/15 mt-5">
            © {new Date().getFullYear()} The Influence Company & CityAge Media
          </p>
        </footer>
      </div>
    </>
  )
}
