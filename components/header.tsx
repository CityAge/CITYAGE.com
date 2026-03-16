'use client'

import { useEffect, useRef } from 'react'

const tickerItems = [
  'AI DATA CENTER POWER DEMAND: +18%',
  'SILICON CORRIDOR INVESTMENT: $4.2B',
  'AUTONOMOUS LOGISTICS INDEX: 92.4',
  'URBAN AI COMPUTE CAPACITY: +34%',
  'SMART INFRA DEPLOYMENT: 247 CITIES',
  'DEFENCE-TECH CONTRACTS: $1.2B',
  'ORBITAL DENSITY INDEX: 89%',
  'TRADE FLUX NORTH ATLANTIC: +2.4%',
  'ROTTERDAM PORT THROUGHPUT: STABLE',
  'OTTAWA SUMMIT: MAY 26 CONFIRMED',
]

export function Header() {
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = tickerRef.current
    if (!el) return
    let pos = 0
    const speed = 0.5
    const step = () => {
      pos -= speed
      if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0
      el.style.transform = `translateX(${pos}px)`
      requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <header className="bg-[#050505] border-b border-[#D4AF37]/20">

      {/* Brand bar */}
      <div className="px-8 md:px-16 py-6 md:py-8">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-8">

          {/* Wordmark */}
          <div>
            <h1 className="font-serif font-black text-white text-3xl md:text-4xl lg:text-5xl tracking-tight leading-none mb-2">
              CITYAGE
            </h1>
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase">
              Est. 2012 &nbsp;|&nbsp; Join 25K+ subscribers
            </p>
          </div>

          {/* Nav + Search */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-8">
              {['Dispatches', 'Intelligence', 'Events', 'Purpose'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#888888] hover:text-[#D4AF37] transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
            {/* Search — gold border on focus/hover */}
            <div className="group flex items-center gap-2 border border-[#D4AF37]/30 hover:border-[#D4AF37] focus-within:border-[#D4AF37] px-3 py-1.5 transition-colors duration-200">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#888888] group-hover:text-[#D4AF37] group-focus-within:text-[#D4AF37] transition-colors shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent font-mono text-[10px] tracking-[0.15em] text-white placeholder-[#888888] outline-none w-24 uppercase"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Animated live data ticker crawl */}
      <div className="border-t border-[#D4AF37]/15 bg-[#050505] overflow-hidden">
        <div className="py-2.5 whitespace-nowrap">
          <div ref={tickerRef} className="inline-flex items-center gap-10 will-change-transform">
            {/* Doubled for seamless loop */}
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-10 shrink-0">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#D4AF37]/70 uppercase">
                  {item}
                </span>
                <span className="text-[#D4AF37]/25 text-xs">//</span>
              </span>
            ))}
          </div>
        </div>
      </div>

    </header>
  )
}
