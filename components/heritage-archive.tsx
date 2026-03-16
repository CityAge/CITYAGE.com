'use client'

export function HeritageArchive() {
  const speakers = Array(5).fill(null)

  return (
    <section className="bg-[#0D0D0D] py-16 md:py-24 px-8 md:px-16 border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">
            CityAge Archive
          </h2>
          <p className="text-sm md:text-base font-mono text-[#D4AF37] uppercase tracking-wider">
            15 Years of Context. 12,000+ Experts Indexed.
          </p>
        </div>

        {/* Speaker Portraits Grid */}
        <div className="flex justify-center items-center gap-6 md:gap-8 flex-wrap">
          {speakers.map((_, idx) => (
            <div 
              key={idx}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 border-2 border-[#D4AF37]/40 flex items-center justify-center hover:border-[#D4AF37]/80 transition-colors"
            >
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-serif text-[#D4AF37]/60">
                  ●
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Archive Stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 text-center">
          <div className="border-l border-r border-[#D4AF37]/20 py-4">
            <p className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-mono">
              15
            </p>
            <p className="text-xs font-mono text-[#888888] uppercase tracking-widest mt-2">
              Years
            </p>
          </div>
          <div className="border-l border-r border-[#D4AF37]/20 py-4">
            <p className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-mono">
              12K+
            </p>
            <p className="text-xs font-mono text-[#888888] uppercase tracking-widest mt-2">
              Experts
            </p>
          </div>
          <div className="border-l border-r border-[#D4AF37]/20 py-4">
            <p className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-mono">
              247
            </p>
            <p className="text-xs font-mono text-[#888888] uppercase tracking-widest mt-2">
              Cities
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
