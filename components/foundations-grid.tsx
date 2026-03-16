import { createClient } from '@/lib/supabase/server'

export async function FoundationsGrid() {
  const supabase = await createClient()

  // Fetch Canada Europe Connects vertical config
  const { data: vertical } = await supabase
    .from('vertical_config')
    .select('vertical, brief_name, subtitle, cadence, editorial_thesis, is_active')
    .eq('vertical', 'Canada Europe Connects')
    .single()

  // Fetch published brief count for CEC
  const { count: briefCount } = await supabase
    .from('briefs')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')
    .eq('vertical', 'Canada Europe Connects')

  const desc = vertical?.editorial_thesis
    ?.split('.')?.[0]
    ?.replace(/^[^:]+:\s*/, '')
    ?.trim()

  const card = {
    index: '01',
    title: vertical?.brief_name || 'Canada Europe Connects',
    subtitle: vertical?.subtitle || 'CAD–EU Transatlantic Intelligence',
    body: desc ? desc + '.' : 'Daily intelligence across the Canada–Europe transatlantic corridor covering defence, energy, technology, trade, and capital.',
    cadence: 'DAILY',
    briefCount: briefCount || 0,
  }

  return (
    <section id="influence-letters" className="bg-[#050505] border-b border-[#D4AF37]/20 px-8 md:px-16 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex items-end justify-between gap-6 mb-14 pb-8 border-b border-[#D4AF37]/20">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-[#D4AF37] uppercase mb-3">
              The Foundations
            </p>
            <h2 className="font-serif font-black text-white text-3xl md:text-4xl leading-tight tracking-tight">
              The Influence Letters
            </h2>
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase hidden sm:block">
            More Verticals Coming
          </span>
        </div>

        {/* Single card — Canada Europe Connects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D4AF37]/10">
          <div className="bg-[#050505] p-8 md:p-10 flex flex-col gap-6 group hover:bg-[#0a0a0a] transition-colors">

            {/* Index + title */}
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37]/50 uppercase mb-3 block">
                {card.index}
              </span>
              <h3 className="font-serif font-black text-white text-xl md:text-2xl leading-tight tracking-tight mb-1">
                {card.title}
              </h3>
              <p className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase">
                {card.subtitle}
              </p>
            </div>

            {/* Body */}
            <p className="font-serif text-[#FDFCF8]/55 text-sm leading-relaxed flex-1">
              {card.body}
            </p>

            {/* Stats */}
            <div className="border-t border-[#D4AF37]/15 pt-6 space-y-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-[10px] tracking-[0.15em] text-[#888888] uppercase">
                  Cadence
                </span>
                <span className="font-mono text-sm font-bold text-[#D4AF37]">
                  {card.cadence}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-mono text-[10px] tracking-[0.15em] text-[#888888] uppercase">
                  Published
                </span>
                <span className="font-mono text-sm font-bold text-[#D4AF37]">
                  {card.briefCount}
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

          {/* Placeholder spacer columns — maintain grid proportions */}
          <div className="bg-[#050505] hidden md:block" />
          <div className="bg-[#050505] hidden md:block" />
        </div>

      </div>
    </section>
  )
}
