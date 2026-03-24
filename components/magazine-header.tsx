'use client'

import { useState, useEffect } from 'react'

export function MagazineHeader() {
  const [scrollY, setScrollY] = useState(0)
  const isScrolled = scrollY > 400

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth logo size: starts at 12rem, shrinks to 3rem over 400px of scroll
  const logoProgress = Math.min(scrollY / 400, 1)

  return (
    <>
      {/* ─── TOP UTILITY BAR ─── */}
      <div className="border-b border-black/15 bg-[#F9F9F7] px-6 md:px-12 py-2.5">
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

      {/* ─── HERO MASTHEAD with shrinking logo ─── */}
      {!isScrolled && (
        <div className="bg-[#F9F9F7] border-b border-black overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative" style={{
            paddingTop: `${Math.max(16, 48 - logoProgress * 32)}px`,
            paddingBottom: `${Math.max(16, 48 - logoProgress * 32)}px`,
          }}>

            {/* Left bracket */}
            <div className="hidden xl:flex absolute left-12 bottom-6 flex-col items-start text-left" style={{
              opacity: Math.max(0, 1 - logoProgress * 2)
            }}>
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-black/50 leading-relaxed">
                Currently being<br />edited in Vancouver
              </span>
            </div>

            {/* Center: shrinking wordmark + tagline */}
            <div className="flex flex-col items-center">
              <a href="/" className="font-serif font-black uppercase monocle-wordmark leading-[0.85] text-black tracking-[-0.02em] transition-none" style={{
                fontSize: `clamp(3.5rem, ${12 - logoProgress * 9}rem, 12rem)`
              }}>
                CityAge
              </a>
              <span className="text-[11px] md:text-[13px] font-bold tracking-[0.3em] uppercase text-black/70 mt-3 md:mt-4" style={{
                opacity: Math.max(0, 1 - logoProgress * 1.5)
              }}>
                Intelligence for The Urban Planet
              </span>
            </div>

            {/* Right bracket */}
            <div className="hidden xl:flex absolute right-12 bottom-6 flex-col items-end text-right" style={{
              opacity: Math.max(0, 1 - logoProgress * 2)
            }}>
              <a href="#subscribe" className="text-[10px] font-medium tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors leading-relaxed">
                Daily intelligence<br />from CityAge
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─── VERTICAL NAV BAR — pins to top on scroll ─── */}
      <nav className={`bg-[#F9F9F7] z-[100] transition-shadow duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 border-b border-black shadow-sm' : 'border-b border-black/20'}`}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 flex items-center">

          {/* Compact logo — visible only when fully scrolled */}
          {isScrolled && (
            <a href="/" className="font-serif font-black uppercase monocle-wordmark text-xl md:text-2xl leading-none mr-6 md:mr-10 shrink-0 py-3">
              CityAge
            </a>
          )}

          {/* Vertical links — centered, bold, black */}
          <div className={`flex items-center flex-1 overflow-x-auto md:overflow-visible ${isScrolled ? 'justify-start' : 'justify-center'}`}>
            {['Power', 'Money', 'Cities', 'Frontiers', 'Culture'].map((name, i) => (
              <div key={name} className="flex items-center shrink-0">
                {i > 0 && <span className="text-black/20 mx-2 md:mx-3 hidden md:inline">|</span>}
                <a
                  href={`#${name.toLowerCase()}`}
                  className="px-3 md:px-5 py-3 text-[12px] md:text-[13px] font-bold tracking-[0.2em] uppercase text-black hover:opacity-60 transition-opacity"
                >
                  {name}
                </a>
              </div>
            ))}
          </div>

          {/* Sticky bar utilities */}
          {isScrolled && (
            <div className="flex items-center gap-4 shrink-0">
              <button className="hover:opacity-60 transition-opacity text-black">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <a href="#" className="bg-[#C5A059] text-black px-5 py-1.5 text-[10px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] transition-all">
                Subscribe
              </a>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
