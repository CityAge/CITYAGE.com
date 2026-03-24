'use client'

import { useState, useEffect, useRef } from 'react'

export function MagazineHeader() {
  const [scrollY, setScrollY] = useState(0)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Progress: 0 at top → 1 fully compressed over 300px
  const progress = Math.min(scrollY / 300, 1)

  // Logo: 10rem → 1.8rem on desktop, 3rem → 1.2rem mobile
  const desktopRem = 10 - progress * 8.2
  const mobileRem = 3 - progress * 1.8

  // Masthead padding: 40px → 6px
  const vertPad = Math.max(6, 40 - progress * 34)

  // Fade brackets + tagline — gone by 40% scroll
  const fadeOut = Math.max(0, 1 - progress * 2.5)

  // Utility bar padding: 10px → 4px
  const utilPad = Math.max(4, 10 - progress * 6)

  return (
    <header ref={headerRef} className="sticky top-0 z-[100] bg-[#F9F9F7]">

      {/* ─── UTILITY BAR ─── */}
      <div className="border-b border-black/15 px-6 md:px-12" style={{ paddingTop: utilPad, paddingBottom: utilPad }}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5 md:gap-7">
            <button className="flex items-center gap-2 text-[11px] font-black tracking-[0.15em] uppercase text-black hover:opacity-60 transition-opacity">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <a href="https://cityage.com/events" target="_blank" rel="noopener" className="text-[11px] font-bold tracking-[0.12em] uppercase text-black hover:opacity-60 transition-opacity hidden md:block">Events</a>
            <a href="https://cityage.com/knowledge-partners/" target="_blank" rel="noopener" className="text-[11px] font-bold tracking-[0.12em] uppercase text-black hover:opacity-60 transition-opacity hidden lg:block">Knowledge Partners</a>
            <a href="https://cityage.com/past-events/" target="_blank" rel="noopener" className="text-[11px] font-bold tracking-[0.12em] uppercase text-black hover:opacity-60 transition-opacity hidden lg:block">Past Events</a>
          </div>
          <div className="flex items-center gap-5 md:gap-7">
            <button className="hover:opacity-60 transition-opacity text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <a href="#" className="text-[11px] font-bold tracking-[0.12em] uppercase text-black hover:opacity-60 transition-opacity hidden sm:block">Log in</a>
            <a href="#" className="bg-[#C5A059] text-black px-5 md:px-8 py-1.5 md:py-2 text-[10px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] transition-all">
              Subscribe
            </a>
          </div>
        </div>
      </div>

      {/* ─── MASTHEAD: continuously shrinking logo ─── */}
      <div className="border-b border-black px-6 md:px-12" style={{ paddingTop: vertPad, paddingBottom: vertPad }}>
        <div className="max-w-[1400px] mx-auto relative">

          {/* Left bracket — text only, no cartoon */}
          {fadeOut > 0 && (
            <div className="hidden xl:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col items-start text-left" style={{ opacity: fadeOut }}>
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-black/40 leading-relaxed">
                Currently being<br />edited in Vancouver
              </span>
            </div>
          )}

          {/* Center: shrinking wordmark */}
          <div className="flex flex-col items-center">
            <a
              href="/"
              className="font-serif font-black uppercase monocle-wordmark leading-[0.85] text-black tracking-[-0.02em]"
              style={{ fontSize: `clamp(${mobileRem}rem, ${desktopRem}rem, 10rem)` }}
            >
              CityAge
            </a>
            {fadeOut > 0 && (
              <div className="overflow-hidden" style={{ maxHeight: fadeOut > 0.1 ? 30 : 0, opacity: fadeOut }}>
                <span className="text-[11px] md:text-[13px] font-bold tracking-[0.3em] uppercase text-black/70 mt-3 block">
                  Intelligence for The Urban Planet
                </span>
              </div>
            )}
          </div>

          {/* Right bracket */}
          {fadeOut > 0 && (
            <div className="hidden xl:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-end text-right" style={{ opacity: fadeOut }}>
              <a href="#subscribe" className="text-[10px] font-medium tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors leading-relaxed">
                Daily intelligence<br />from CityAge
              </a>
            </div>
          )}
        </div>
      </div>

      {/* ─── VERTICAL NAV ─── */}
      <div className="border-b border-black/20 px-4 md:px-12">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center overflow-x-auto md:overflow-visible">
          {['Power', 'Money', 'Cities', 'Frontiers', 'Culture'].map((name, i) => (
            <div key={name} className="flex items-center shrink-0">
              {i > 0 && <span className="text-black/20 mx-2 md:mx-3 hidden md:inline">|</span>}
              <a
                href={`#${name.toLowerCase()}`}
                className="px-3 md:px-5 py-2.5 text-[12px] md:text-[13px] font-bold tracking-[0.2em] uppercase text-black hover:opacity-60 transition-opacity"
              >
                {name}
              </a>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
