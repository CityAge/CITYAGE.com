export function FoundationsGrid() {
  const foundations = [
    {
      index: '01',
      title: 'Trade Intelligence',
      subtitle: 'CAD–EU Bilateral',
      body: 'Tracking specialty metals, agricultural corridors, and defense-adjacent procurement across the Canada–Europe axis.',
      stats: [
        { label: 'YoY Growth', value: '+12.4%' },
        { label: 'Defense Contracts', value: '$847M' },
        { label: 'Specialty Metals', value: 'ACTIVE' },
      ],
    },
    {
      index: '02',
      title: 'Space & Orbit',
      subtitle: 'Low-Earth Orbit Monitor',
      body: 'Real-time orbital density mapping, asset congestion risk scoring, and dual-use infrastructure surveillance.',
      stats: [
        { label: 'Active Assets', value: '847' },
        { label: 'Orbital Density', value: '89%' },
        { label: 'Congestion Risk', value: 'NOMINAL' },
      ],
    },
    {
      index: '03',
      title: 'The Influence Letter',
      subtitle: 'Weekly Capital & Power',
      body: 'A curated weekly briefing on capital flows, political power shifts, and urban investment signals across 247 cities.',
      stats: [
        { label: 'Cities Tracked', value: '247' },
        { label: 'Capital Inflow', value: '$3.2B' },
        { label: 'Frequency', value: 'WEEKLY' },
      ],
    },
  ]

  return (
    <section id="intelligence" className="bg-[#050505] border-b border-[#D4AF37]/20 px-8 md:px-16 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="flex items-end justify-between gap-6 mb-14 pb-8 border-b border-[#D4AF37]/20">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] text-[#D4AF37] uppercase mb-3">
              The Foundations
            </p>
            <h2 className="font-serif font-black text-white text-3xl md:text-4xl leading-tight tracking-tight">
              Core Intelligence Verticals
            </h2>
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase hidden sm:block">
            Three Mandates
          </span>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#D4AF37]/10">
          {foundations.map((item) => (
            <div
              key={item.index}
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
                {item.stats.map((stat) => (
                  <div key={stat.label} className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-[10px] tracking-[0.15em] text-[#888888] uppercase">
                      {stat.label}
                    </span>
                    <span className="font-mono text-sm font-bold text-[#D4AF37]">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
