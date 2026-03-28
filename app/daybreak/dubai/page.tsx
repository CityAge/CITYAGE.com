import { createClient } from '@/lib/supabase/server'

export const revalidate = 0

export const metadata = {
  title: 'Daybreak Dubai — A CityAge Intelligence Letter',
  description: 'Money. Luxury. Real Estate. Restaurants. Wellness. The morning intelligence of a very good life.',
}

function renderMarkdown(md: string): string {
  return md
    // Strip h1 title
    .replace(/^# .+$/gm, '')
    // Strip italic dateline (single * wrapping whole line, not bold **)
    .replace(/^\*(?!\*)[^\n]+(?<!\*)\*$/gm, '')
    // Section headers
    .replace(/^## Before Sunrise$/gm, '<h2 class="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059] mt-14 mb-5 pb-3 border-b border-black/8">Before Sunrise</h2>')
    .replace(/^## The Lead$/gm, '<h2 class="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mt-14 mb-5 pb-3 border-b border-black/8">The Lead</h2>')
    .replace(/^## The Market$/gm, '<h2 class="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mt-14 mb-5 pb-3 border-b border-black/8">The Market</h2>')
    .replace(/^## The Table$/gm, '<h2 class="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mt-14 mb-5 pb-3 border-b border-black/8">The Table</h2>')
    .replace(/^## The Life$/gm, '<h2 class="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mt-14 mb-5 pb-3 border-b border-black/8">The Life</h2>')
    .replace(/^## The Number$/gm, '<h2 class="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059] mt-14 mb-5 pb-3 border-b border-black/8">The Number</h2>')
    .replace(/^## (.+)$/gm, '<h2 class="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-black/40 mt-14 mb-5 pb-3 border-b border-black/8">$1</h2>')
    // Sub-headlines
    .replace(/^### (.+)$/gm, '<h3 class="font-serif font-black text-[24px] md:text-[30px] leading-[1.2] tracking-tight text-black mt-6 mb-5">$1</h3>')
    // Dividers
    .replace(/^---$/gm, '<hr class="border-black/8 my-10" />')
    // Bold standalone lines (market leads) — must come BEFORE inline bold
    .replace(/^\*\*(.+?)\*\*$/gm, '<p class="font-serif font-bold text-black text-[18px] leading-[1.6] mt-8 mb-3">$1</p>')
    // Hyperlinks — must come BEFORE inline bold/italic
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-black underline decoration-[#C5A059] decoration-[1.5px] underline-offset-[3px] hover:decoration-black transition-colors">$1</a>')
    // Inline formatting
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-black">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic text-black/50">$1</em>')
    // Paragraphs — wrap any remaining unwrapped lines
    .replace(/^(?!<)(.*\S.*)$/gm, '<p class="font-serif text-black/75 text-[17px] md:text-[18px] leading-[1.9] mb-6">$1</p>')
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

  // Fetch Unsplash hero image for today's brief
  let heroImage: {url: string, credit: string, creditUrl: string} | null = null
  if (brief) {
    try {
      const keywords = brief.body?.match(/Dubai|Palm Jumeirah|DIFC|Marina|luxury|hotel|restaurant|real estate/i)?.[0] || 'Dubai'
      const unsplashQuery = encodeURIComponent(`Dubai ${keywords} architecture luxury`)
      const unsplashRes = await fetch(
        `https://api.unsplash.com/search/photos?query=${unsplashQuery}&per_page=1&orientation=landscape&content_filter=high`,
        { headers: { 'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY || ''}` } }
      )
      if (unsplashRes.ok) {
        const data = await unsplashRes.json()
        const photo = data.results?.[0]
        if (photo) {
          heroImage = {
            url: photo.urls.regular,
            credit: `Photo by ${photo.user.name}`,
            creditUrl: `${photo.user.links.html}?utm_source=cityage&utm_medium=referral`
          }
        }
      }
    } catch { /* non-fatal */ }
  }

  const dubaiNow = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Dubai', hour: 'numeric', minute: '2-digit', hour12: true,
  })
  const dubaiHour = parseInt(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai', hour: 'numeric', hour12: false }))
  const greeting = dubaiHour < 12 ? 'Good morning' : dubaiHour < 17 ? 'Good afternoon' : 'Good evening'

  const briefDate = brief
    ? new Date(brief.published_at).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Dubai',
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
    <div className="min-h-screen bg-[#F9F9F7]">

      {/* MASTHEAD */}
      <header className="border-b-2 border-black">
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

      {/* BRIEF */}
      {brief ? (
        <main>
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
          {heroImage && (
            <div className="relative w-full aspect-[21/9] overflow-hidden">
              <img src={heroImage.url} alt="Daybreak Dubai" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-black/60 to-transparent">
                <a href={heroImage.creditUrl} target="_blank" rel="noopener"
                  className="font-mono text-[8px] tracking-[0.15em] uppercase text-white/40 hover:text-white/70 transition-colors">
                  {heroImage.credit} · Unsplash
                </a>
              </div>
            </div>
          )}
          <article className="max-w-[680px] mx-auto px-6 py-8 md:py-10">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </article>
          <div className="border-t border-black/8 px-6 py-8 text-center">
            <p className="font-serif italic text-black/30 text-[14px]">
              Before anyone at dinner knows.
            </p>
          </div>
        </main>
      ) : (
        <main className="flex items-center justify-center py-40">
          <div className="text-center px-6">
            <p className="font-serif font-black text-4xl text-black/10 mb-3">Before sunrise</p>
            <p className="font-serif text-black/30 text-lg">The first brief arrives tomorrow morning.</p>
          </div>
        </main>
      )}

      {/* SUBSCRIBE */}
      <section id="subscribe" className="bg-black px-6 py-16 md:py-20">
        <div className="max-w-[500px] mx-auto text-center">
          <h2 className="font-serif font-black text-2xl md:text-3xl text-white mb-2">Daybreak Dubai</h2>
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C5A059] mb-6">Daily · Free · 5 minutes · Dubai time</p>
          <p className="font-serif text-white/40 text-[15px] leading-relaxed mb-8">
            What opened. What sold. What it cost.<br />Before anyone at dinner knows.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto">
            <input type="email" placeholder="your@email.com"
              className="flex-1 bg-white/8 border border-white/15 text-white placeholder-white/25 px-4 py-3 font-mono text-[12px] tracking-wide focus:outline-none focus:border-[#C5A059] transition-colors" />
            <button className="bg-[#C5A059] text-black px-7 py-3 font-mono text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* ARCHIVE */}
      {archive.length > 1 && (
        <section className="border-t border-black/10 px-6 py-12">
          <div className="max-w-[680px] mx-auto">
            <h3 className="font-mono text-[9px] tracking-[0.3em] uppercase text-black/30 mb-8">Archive</h3>
            <div className="divide-y divide-black/6">
              {archive.slice(1).map((b: any) => (
                <a key={b.id} href={`/dispatches/${b.id}`}
                  className="flex items-baseline justify-between py-4 group">
                  <span className="font-serif text-[15px] text-black/60 group-hover:text-black transition-colors">
                    {new Date(b.published_at).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric', timeZone: 'Asia/Dubai',
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

      {/* FOOTER */}
      <footer className="border-t-2 border-black px-6 py-10 text-center">
        <a href="https://cityagemag.vercel.app" className="font-serif font-black text-xl tracking-tight text-black hover:text-[#C5A059] transition-colors">
          CityAge
        </a>
        <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/25 mt-2">Intelligence for The Urban Planet</p>
        <p className="font-mono text-[9px] tracking-[0.15em] text-black/15 mt-5">
          © {new Date().getFullYear()} The Influence Company & CityAge Media
        </p>
      </footer>
    </div>
  )
}
