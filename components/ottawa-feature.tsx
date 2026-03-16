import Image from 'next/image'

export function OttawaFeature() {
  return (
    <section className="bg-[#050505] border-b border-[#D4AF37]/20">

      {/* Section label bar */}
      <div className="px-8 md:px-16 py-5 border-b border-[#D4AF37]/20 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase">
          Featured Dispatch
        </span>
        <span className="font-mono text-[10px] tracking-[0.25em] text-[#888888] uppercase">
          No. 001 — May 2026
        </span>
      </div>

      {/* 60/40 split */}
      <div className="flex flex-col lg:flex-row min-h-[560px]">

        {/* Left: Editorial copy — 60% */}
        <div className="flex-1 lg:basis-[60%] px-8 md:px-16 py-14 md:py-20 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D4AF37]/20">
          <div>
            {/* Location / date slug */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-mono text-[11px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase">
                From Ottawa
              </span>
              <span className="w-8 h-px bg-[#D4AF37]/40" />
              <span className="font-mono text-[11px] tracking-[0.2em] text-[#888888] uppercase">
                May 26, 2026
              </span>
            </div>

            {/* Headline */}
            <h2 className="font-serif font-black text-white text-3xl sm:text-4xl md:text-5xl leading-[1.1] tracking-tight text-balance mb-6 max-w-xl">
              Canada–Europe Connects.
            </h2>

            {/* Deck */}
            <p className="font-serif text-[#FDFCF8]/65 text-lg md:text-xl leading-relaxed max-w-lg mb-10 text-pretty">
              Defense procurement, dual-use technology, and trans-Atlantic trade corridors converge in the capital. A closed-door convening for principals only.
            </p>

            {/* Theme tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {['Defense', 'Dual-Use', 'Trans-Atlantic Trade', 'Procurement'].map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-[#D4AF37]/30 text-[#D4AF37]/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-10 border-t border-[#D4AF37]/20">
            <div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-[#888888] uppercase mb-1">
                Venue
              </div>
              <div className="font-serif text-white text-sm font-semibold">
                Parliament Hill Precinct, Ottawa
              </div>
            </div>
            <button className="self-start sm:self-auto px-7 py-3.5 bg-[#D4AF37] text-[#050505] font-mono text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#c9a430] transition-colors whitespace-nowrap">
              Request Access
            </button>
          </div>
        </div>

        {/* Right: Image — 40% */}
        <div className="lg:basis-[40%] relative min-h-[300px] lg:min-h-0 overflow-hidden">
          <Image
            src="/ottawa-feature.jpg"
            alt="Ottawa parliamentary architecture and trade infrastructure"
            fill
            className="object-cover grayscale contrast-110 brightness-75"
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
          />
          {/* Overlay vignette from left for editorial blend */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, #050505 0%, transparent 35%)',
            }}
          />
          {/* Caption */}
          <div className="absolute bottom-6 right-6">
            <span className="font-mono text-[9px] tracking-[0.25em] text-white/40 uppercase">
              Ottawa — Parliament Hill
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
