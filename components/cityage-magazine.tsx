'use client'

import Image from 'next/image'

export function CityAgeMagazine() {
  return (
    <section className="bg-white">
      {/* Sponsor bar */}
      <div className="bg-[#001A4D] py-2 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase text-center">
            GLOBAL SPONSOR: THE HUMAN HABITATS INITIATIVE: DESIGNING FOR PEOPLE, DRIVEN BY DATA
          </p>
        </div>
      </div>

      {/* Masthead section */}
      <div className="bg-white border-b border-black py-12 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Vol / Title / Est + Search */}
          <div className="flex items-center justify-between mb-8">
            <span className="font-mono text-[11px] tracking-[0.3em] text-black/60 uppercase hidden md:block">
              VOL. 24 NO. 297
            </span>
            <span className="font-mono text-[11px] tracking-[0.3em] text-black/60 uppercase hidden md:block">
              EST. 2012
            </span>
            {/* Search beside masthead */}
            <div className="group flex items-center gap-2 border border-black/30 hover:border-[#D4AF37] focus-within:border-[#D4AF37] px-3 py-1.5 transition-colors duration-200 ml-auto md:ml-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-black/50 shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search the archive..."
                className="bg-transparent font-mono text-[10px] tracking-[0.1em] text-black placeholder-black/40 outline-none w-36 uppercase"
              />
            </div>
          </div>

          {/* Massive THE URBAN PLANET wordmark */}
          <h1 className="font-serif font-black text-black text-4xl md:text-6xl lg:text-[4.7rem] leading-none text-center tracking-[-0.03em] mb-2">
            THE URBAN PLANET
          </h1>

          {/* Tagline italic */}
          <p className="font-serif italic text-black/70 text-center text-xl md:text-2xl mt-4 mb-10">
            Intelligence for the 3 per cent
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-black py-4 px-8 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-12">
          {['THE BUILD', 'THE SYSTEM', 'THE LIFE'].map((item) => (
            <a
              key={item}
              href="#"
              className="font-serif font-bold text-black text-sm md:text-base hover:text-[#D4AF37] transition-colors flex items-center gap-2"
            >
              {item}
              <span className="text-[10px]">▼</span>
            </a>
          ))}
        </div>
      </div>

      {/* Live ticker — dark navy */}
      <div className="bg-black py-3 px-8 md:px-16 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-8 whitespace-nowrap">
          <div className="flex items-center gap-8 shrink-0">
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/80 uppercase">
              [TABLE]
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/80 uppercase">
              COPENHAGEN: +1.2M SMART NODES
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/80 uppercase">
              LONDON: THAMES BARRIER MAINTENANCE ADVISORY
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/80 uppercase">
              SYDNEY: CARBON TARGET REACHED
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/80 uppercase">
              L-TRAIN OPTIMIZED
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/80 uppercase">
              RENEWABLE GRID 98.6%
            </span>
          </div>
        </div>
      </div>

      {/* Article grid — 3 columns */}
      <div className="bg-white py-16 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-b border-black py-12">

          {/* Column 1: FABRIC - Large lead article */}
          <div className="md:col-span-1 border-r border-black pr-8">
            <div className="mb-4">
              <span className="font-mono text-[11px] tracking-[0.35em] text-black/60 uppercase font-semibold">
                FABRIC
              </span>
            </div>
            {/* Grayscale landscape image placeholder */}
            <div className="w-full bg-gray-300 aspect-video mb-6 rounded-sm overflow-hidden">
              <img
                src="/ottawa-feature.jpg"
                alt="The Vertical Forest: Reimagining Singapore's Skyline"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <h2 className="font-serif font-black text-black text-2xl md:text-3xl leading-tight mb-3">
              The Vertical Forest: Reimagining Singapore's Skyline
            </h2>
            <p className="font-serif text-black/70 text-sm leading-relaxed">
              Exploring how biophilic architecture is reshaping urban density and institutional land use in one of the world's most constrained city-states.
            </p>
          </div>

          {/* Column 2: Center feature — thehumantouch.ai */}
          <div className="md:col-span-1 border-r border-black pr-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase font-bold border border-[#D4AF37] text-[#D4AF37] px-2 py-0.5">
                HT.AI
              </span>
              <a href="#" className="font-mono text-[11px] tracking-[0.2em] text-black/70 uppercase font-semibold hover:text-[#D4AF37] transition-colors">
                THEHUMANTOUCH.AI
              </a>
            </div>
            {/* Square image */}
            <div className="w-full bg-gray-300 aspect-square mb-4 rounded-sm overflow-hidden mb-6">
              <img
                src="/guest-portrait.jpg"
                alt="Why Soft Infrastructure is the Future of Global Cities"
                className="w-full h-full object-cover grayscale"
              />
            </div>
            <h2 className="font-serif font-black text-black text-xl md:text-2xl leading-tight mb-3">
              Why Soft Infrastructure is the Future of Global Cities
            </h2>
            <p className="font-serif text-black/70 text-sm leading-relaxed mb-4">
              The digital layer of governance is moving from simple data collection to empathetic citizen-centric response systems.
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-black">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-black/60 uppercase font-semibold">
                  Sarah Chen
                </p>
              <p className="font-mono text-[9px] text-black/40 uppercase">
                Oct 18, 2024
              </p>
              </div>
              <a href="/article/soft-infrastructure-cities" className="font-mono text-[11px] tracking-[0.2em] text-black uppercase font-bold hover:text-[#D4AF37] transition-colors">
                READ FULL
              </a>
            </div>
          </div>

          {/* Column 3: TRANSIT — text only top, featured article bottom */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <span className="font-mono text-[11px] tracking-[0.35em] text-black/60 uppercase font-semibold">
                TRANSIT
              </span>
            </div>
            <h2 className="font-serif font-black text-black text-2xl md:text-3xl leading-tight mb-3">
              Hydrogen Corridors: The New Silk Road?
            </h2>
            <p className="font-serif text-black/70 text-sm leading-relaxed mb-4">
              Examining the massive shift in transit logistics as the world moves away from petroleum-based shipping routes.
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-black mb-8 pb-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-black/60 uppercase font-semibold">
                  Samaire Armstrong
                </p>
              <p className="font-mono text-[9px] text-black/40 uppercase">
                Oct 22, 2024
              </p>
              </div>
              <a href="/article/hydrogen-corridors" className="font-mono text-[11px] tracking-[0.2em] text-black uppercase font-bold hover:text-[#D4AF37] transition-colors">
                READ FULL
              </a>
            </div>

            {/* Secondary article card */}
            <div className="border-t border-black pt-6">
              <div className="mb-3 flex items-center gap-2">
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase font-bold border border-[#D4AF37] text-[#D4AF37] px-2 py-0.5">
                  HT.AI
                </span>
                <a href="#" className="font-mono text-[11px] tracking-[0.2em] text-black/70 uppercase font-semibold hover:text-[#D4AF37] transition-colors">
                  THEHUMANTOUCH.AI
                </a>
              </div>
              <div className="w-full bg-gray-300 aspect-square rounded-sm overflow-hidden mb-3">
                <img
                  src="/editor-portrait.jpg"
                  alt="The Future of Intelligence Gathering"
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <h3 className="font-serif font-bold text-black text-lg mb-2">
                The Future of Intelligence Gathering
              </h3>
              <p className="font-serif text-black/70 text-xs leading-relaxed">
                How institutional frameworks are adapting to real-time urban data streams.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
