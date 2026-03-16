export function Mission() {
  return (
    <section id="mission" className="bg-[#FDFCF8] px-8 md:px-16 py-20 md:py-32">
      <div className="max-w-7xl mx-auto">

        {/* Masthead */}
        <div className="flex items-center justify-between pb-6 border-b border-[#050505]/15 mb-14">
          <span className="font-mono text-[10px] tracking-[0.35em] text-[#050505]/40 uppercase">
            Manifesto
          </span>
          <span className="font-mono text-[10px] tracking-[0.2em] text-[#050505]/40 uppercase">
            thehumantouch.ai
          </span>
        </div>

        {/* Main editorial grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">

          {/* Left: big serif title + drop-cap body */}
          <div className="lg:col-span-5">
            <h2 className="font-serif font-black text-[#050505] text-4xl md:text-5xl leading-[1.05] tracking-tight text-balance mb-8">
              The Human Touch
            </h2>
            <div className="w-8 h-px bg-[#D4AF37] mb-8" />
            <p className="font-serif text-[#050505]/75 text-base md:text-lg leading-relaxed text-pretty"
               style={{ /* drop cap */
                 textIndent: 0,
               }}>
              <span className="font-serif font-black text-[#050505] text-5xl float-left mr-3 mt-1 leading-none">
                I
              </span>
              n an age of algorithmic abstraction, we believe intelligence must remain anchored to the places where people actually live, work, and build their futures. The urban planet is not a dataset — it is the sum of countless human decisions made at street level.
            </p>
          </div>

          {/* Center divider */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="h-full w-px bg-[#050505]/10 mx-auto" />
          </div>

          {/* Right: two-column editorial text */}
          <div className="lg:col-span-6 space-y-6">
            <p className="font-serif text-[#050505]/70 text-base leading-relaxed text-pretty">
              Our mission is to provide institutional-grade intelligence that respects this complexity. We synthesize satellite imagery, sensor networks, and economic flows into actionable insights — but we never lose sight of the human element that gives these patterns meaning.
            </p>
            <p className="font-serif text-[#050505]/70 text-base leading-relaxed text-pretty">
              We serve governments building resilient infrastructure, investors allocating capital to urban transformation, and organizations ensuring that growth serves the many, not just the few.
            </p>
            <p className="font-serif text-[#050505]/70 text-base leading-relaxed text-pretty">
              The future of our planet will be decided in cities — in the corridors of trade that connect them, the networks of energy that power them, and the institutions that govern them.
            </p>

            {/* Pull-quote */}
            <blockquote className="border-l-2 border-[#D4AF37] pl-6 py-1 mt-2">
              <p className="font-serif font-bold text-[#050505] text-lg md:text-xl leading-snug italic">
                "This is intelligence with a human touch."
              </p>
            </blockquote>
          </div>
        </div>

        {/* Signature row */}
        <div className="mt-16 pt-8 border-t border-[#050505]/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-[#050505]/40 uppercase mb-1">
              Founded
            </div>
            <div className="font-serif font-bold text-[#050505] text-sm">
              Geneva, 2024
            </div>
          </div>
          <div className="flex items-center gap-8 md:gap-12">
            {[
              { value: '12', label: 'Offices' },
              { value: '84', label: 'Analysts' },
              { value: '6', label: 'Continents' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-mono text-2xl font-bold text-[#D4AF37] leading-none mb-1">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] tracking-[0.2em] text-[#050505]/40 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
