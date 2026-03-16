import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export async function FoundationsGrid() {
  const supabase = await createClient()

  // Fetch the most recent published briefs — one per vertical, latest first
  const { data: briefs } = await supabase
    .from('briefs')
    .select('id, title, vertical, published_at, body')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6)

  // Dedupe to one per vertical (most recent)
  const seen = new Set<string>()
  const tiles = (briefs ?? []).filter((b: any) => {
    if (seen.has(b.vertical)) return false
    seen.add(b.vertical)
    return true
  }).map((b: any, i: number) => {
    // Extract tagline (italic line after dateline)
    const tagline = b.body
      ?.split('\n')
      .find((l: string) => l.startsWith('*') && l.endsWith('*') && !l.includes('Defence.'))
      ?.replace(/\*/g, '')
      ?.trim()

    const date = new Date(b.published_at).toLocaleDateString('en-CA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'America/Toronto',
    })

    return {
      index: String(i + 1).padStart(2, '0'),
      id: b.id,
      vertical: b.vertical,
      title: b.vertical,
      tagline: tagline || b.title,
      date,
    }
  })

  return (
    <section id="influence-letters" className="bg-[#050505] border-b border-[#D4AF37]/20 px-8 md:px-16 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex items-end justify-between gap-6 mb-14 pb-8 border-b border-[#D4AF37]/20">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-[#D4AF37] uppercase mb-3">
              Daily Intelligence
            </p>
            <h2 className="font-serif font-black text-white text-3xl md:text-4xl leading-tight tracking-tight">
              The Influence Letters
            </h2>
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase hidden sm:block">
            {tiles.length} {tiles.length === 1 ? 'Edition' : 'Editions'} Live
          </span>
        </div>

        {/* Brief tiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D4AF37]/10">
          {tiles.map((tile) => (
            <Link
              key={tile.id}
              href={`/dispatches/${tile.id}`}
              className="bg-[#050505] p-8 md:p-10 flex flex-col gap-6 group hover:bg-[#0a0a0a] transition-colors"
            >
              {/* Index + vertical */}
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37]/50 uppercase mb-3 block">
                  {tile.index}
                </span>
                <h3 className="font-serif font-black text-white text-xl md:text-2xl leading-tight tracking-tight mb-1">
                  {tile.title}
                </h3>
              </div>

              {/* Tagline */}
              <p className="font-serif italic text-[#FDFCF8]/55 text-sm leading-relaxed flex-1">
                {tile.tagline}
              </p>

              {/* Date + read CTA */}
              <div className="border-t border-[#D4AF37]/15 pt-6 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.15em] text-[#888888] uppercase">
                  {tile.date}
                </span>
                <span className="font-mono text-[10px] tracking-[0.15em] text-[#D4AF37] uppercase group-hover:underline">
                  Read →
                </span>
              </div>
            </Link>
          ))}

          {/* Fill empty slots to maintain 3-col grid if fewer than 3 tiles */}
          {tiles.length % 3 !== 0 && Array.from({ length: 3 - (tiles.length % 3) }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-[#050505] hidden md:block" />
          ))}
        </div>

      </div>
    </section>
  )
}
