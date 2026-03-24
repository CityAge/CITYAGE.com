'use client'

import { useState, useEffect, useCallback } from 'react'

export function MagazineHeader() {
  const [scrollY, setScrollY] = useState(0)

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

  // Shrink over 500px of scroll for a smooth, gradual compression
  const progress = Math.min(scrollY / 500, 1)

  // Logo: 11rem → 2rem on desktop, 3.5rem → 1.5rem on mobile
  const desktopRem = 11 - progress * 9    // 11 → 2
  const mobileRem = 3.5 - progress * 2    // 3.5 → 1.5

  // Masthead vertical padding: 40px → 6px
  const mastheadPad = Math.max(6, 40 - progress * 34)

  // Utility bar padding: 10px → 4px
  const utilPad = Math.max(4, 10 - progress * 6)

  // Fade out tagline, brackets (gone by 50% of scroll)
  const fadeOut = Math.max(0, 1 - progress * 2)

  // Show shadow once compressed
  const showShadow = progress > 0.8

  return (
    <header className={`sticky top-0 z-[100] bg-[#F9F9F7] transition-shadow duration-300 ${showShadow ? 'shadow-md' : ''}`}>

      {/* ─── TOP UTILITY BAR ─── */}
      <div className="border-b border-black/15 px-6 md:px-12" style={{
        paddingTop: `${utilPad}px`,
        paddingBottom: `${utilPad}px`,
      }}>
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

      {/* ─── MASTHEAD: continuous shrink, always visible ─── */}
      <div className="border-b border-black px-6 md:px-12" style={{
        paddingTop: `${mastheadPad}px`,
        paddingBottom: `${mastheadPad}px`,
      }}>
        <div className="max-w-[1400px] mx-auto relative flex items-center justify-center">

          {/* Left bracket — fades out */}
          {fadeOut > 0.01 && (
            <div className="hidden xl:block absolute left-0 top-1/2 -translate-y-1/2" style={{ opacity: fadeOut }}>
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-black/50 leading-relaxed">
                Currently being<br />edited in Vancouver
              </span>
            </div>
          )}

          {/* Center: continuously shrinking wordmark + fading tagline */}
          <div className="flex flex-col items-center min-w-0">
            <a href="/" className="font-serif font-black uppercase monocle-wordmark text-black tracking-[-0.02em] whitespace-nowrap" style={{
              fontSize: `${mobileRem}rem`,
              lineHeight: 0.85,
            }}>
              <span className="hidden md:inline" style={{ fontSize: `${desktopRem}rem` }}>CityAge</span>
              <span className="md:hidden">CityAge</span>
            </a>

            {fadeOut > 0.01 && (
              <span className="text-[11px] md:text-[13px] font-bold tracking-[0.3em] uppercase text-black/70 mt-2 md:mt-3" style={{ opacity: fadeOut }}>
                Intelligence for The Urban Planet
              </span>
            )}
          </div>

          {/* Right bracket — fades out */}
          {fadeOut > 0.01 && (
            <div className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 text-right" style={{ opacity: fadeOut }}>
              <a href="#subscribe" className="text-[10px] font-medium tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors leading-relaxed">
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
