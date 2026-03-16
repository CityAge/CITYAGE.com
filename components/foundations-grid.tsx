import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export async function FoundationsGrid() {
  const supabase = await createClient()

  // Fetch active verticals (exclude Good Morning series - those are separate brands)
  const { data: verticals } = await supabase
    .from('vertical_config')
    .select('vertical, brief_name, subtitle, cadence, word_target, editorial_thesis, is_active')
    .eq('is_active', true)
    .not('vertical', 'ilike', '%Good Morning%')
    .order('vertical')

  // Fetch latest published brief count per vertical
  const { data: briefCounts } = await supabase
    .from('briefs')
    .select('vertical')
    .eq('status', 'published')

  const countMap: Record<string, number> = {}
  briefCounts?.forEach((b: any) => {
    countMap[b.vertical] = (countMap[b.vertical] || 0) + 1
  })

  const displayVerticals = (verticals ?? []).map((v: any, i: number) => {
    // Extract first sentence of editorial thesis as description
    const desc = v.editorial_thesis
      ?.split('.')?.[0]
      ?.replace(/^[^:]+:\s*/, '')
      ?.trim()

    return {
      index: String(i + 1).padStart(2, '0'),
      vertical: v.vertical,
      title: v.brief_name,
      subtitle: v.subtitle || v.vertical,
      body: desc ? desc + '.' : 'Intelligence vertical.',
      cadence: v.cadence === 'daily' ? 'DAILY' : 'WEEKLY',
      briefCount: countMap[v.vertical] || 0,
    }
  })

  return (
    <section id="intelligence" className="bg-[#050505] border-b border-[#D4AF37]/20 px-8 md:px-16 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex items-end justify-between gap-6 mb-14 pb-8 border-b border-[#D4AF37]/20">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-[#D4AF37] uppercase mb-3">
              The Influence Letters
            </p>
            <h2 className="font-serif font-black text-white text-3xl md:text-4xl leading-tight tracking-tight">
              Intelligence by Sector
            </h2>
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase hidden sm:block">
            {displayVerticals.length} Verticals
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D4AF37]/10">
          {displayVerticals.map((item) => (
            <div
              key={item.vertical}
              className="bg-[#050505] p-8 md:p-10 flex flex-col gap-6 group hover:bg-[#0a0a0a] transition-colors"
            >
              {/* Index + title */}
              <div>
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37]/50 uppercase mb-3 block">
                  {item.index}
                </span>
                <h3 className="font-serif font-black text-white text-xl md:text-2xl leading-tight tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase">
                  {item.subtitle}
                </p>
              </div>

              {/* Body */}
              <p className="font-serif text-[#FDFCF8]/55 text-sm leading-relaxed flex-1">
                {item.body}
              </p>

              {/* Stats */}
              <div className="border-t border-[#D4AF37]/15 pt-6 space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#888888] uppercase">
                    Cadence
                  </span>
                  <span className="font-mono text-sm font-bold text-[#D4AF37]">
                    {item.cadence}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#888888] uppercase">
                    Published
                  </span>
                  <span className="font-mono text-sm font-bold text-[#D4AF37]">
                    {item.briefCount}
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-[10px] tracking-[0.15em] text-[#888888] uppercase">
                    Status
                  </span>
                  <span className="font-mono text-sm font-bold text-[#D4AF37]">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
