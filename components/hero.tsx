export function Hero() {
  return (
    <section className="bg-[#050505] border-b border-[#D4AF37]/20 px-8 md:px-16 py-24 md:py-36">
      <div className="max-w-7xl mx-auto">

        {/* Overline */}
        <p className="font-mono text-[11px] tracking-[0.35em] text-[#D4AF37] uppercase mb-10">
          Institutional Intelligence
        </p>

        {/* Headline */}
        <h2 className="font-serif font-black text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[96px] leading-[1.0] tracking-tight text-balance mb-10 max-w-5xl">
          Intelligence for the Urban Planet.
        </h2>

        {/* Rule */}
        <div className="w-16 h-px bg-[#D4AF37] mb-10" />

        {/* Sub-headline */}
        <p className="font-serif text-[#FDFCF8]/70 text-xl md:text-2xl leading-relaxed max-w-2xl mb-16 text-pretty">
          70% of global GDP is created on the 3% of the Earth where we live.
          We offer the intelligence to build it.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          <button className="px-8 py-4 bg-[#D4AF37] text-[#050505] font-mono text-xs font-bold tracking-[0.2em] uppercase hover:bg-[#c9a430] transition-colors">
            Access Intelligence
          </button>
          <button className="px-8 py-4 border border-[#D4AF37]/40 text-[#D4AF37] font-mono text-xs tracking-[0.2em] uppercase hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-colors">
            View Methodology
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-0 border-t border-[#D4AF37]/20 pt-10 max-w-2xl">
          {[
            { value: '247', label: 'Cities Tracked' },
            { value: '1.2B', label: 'Data Points' },
            { value: '89%', label: 'Accuracy Rate' },
          ].map((stat, i) => (
            <div key={i} className={`pr-8 ${i > 0 ? 'pl-8 border-l border-[#D4AF37]/20' : ''}`}>
              <div className="font-mono text-3xl md:text-4xl font-bold text-[#D4AF37] mb-1">
                {stat.value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#888888]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
