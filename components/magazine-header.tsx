'use client'

import { useState, useEffect } from 'react'

export function MagazineHeader() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 500)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* ─── TOP UTILITY BAR ─── */}
      <div className="border-b border-black/10 bg-[#F9F9F7] px-6 md:px-12 py-2.5">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <button className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-black/60 hover:text-black transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <span className="hidden sm:inline">Menu</span>
            </button>
            <span className="text-black/10 hidden md:block">|</span>
            <a href="https://cityage.com/events" target="_blank" rel="noopener" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors hidden md:block">Events</a>
            <a href="https://cityage.com/knowledge-partners/" target="_blank" rel="noopener" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors hidden lg:block">Knowledge Partners</a>
            <a href="https://cityage.com/past-events/" target="_blank" rel="noopener" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors hidden lg:block">Past Events</a>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <button className="hover:text-[#C5A059] transition-colors text-black/60">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <a href="#" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors hidden sm:block">Log in</a>
            <a href="#" className="bg-[#C5A059] text-black px-5 md:px-8 py-1.5 md:py-2 text-[9px] font-black tracking-[0.2em] uppercase hover:bg-black hover:text-[#C5A059] transition-all">
              Subscribe
            </a>
          </div>
        </div>
      </div>

      {/* ─── HERO MASTHEAD ─── */}
      {!isScrolled && (
        <div className="bg-[#F9F9F7] border-b border-black">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-8 md:py-12 relative">

            {/* Left bracket — like Monocle's "Currently being edited in London" */}
            <div className="hidden lg:flex absolute left-12 top-1/2 -translate-y-1/2 flex-col items-start text-left">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/30 leading-relaxed">
                Currently being<br />edited in Vancouver
              </span>
            </div>

            {/* Center: massive wordmark + tagline */}
            <div className="flex flex-col items-center">
              <a href="/" className="font-serif font-black uppercase monocle-wordmark leading-[0.85] text-[3.5rem] md:text-[7rem] lg:text-[10rem] xl:text-[12rem] text-black hover:text-black/80 transition-colors tracking-[-0.02em]">
                CityAge
              </a>
              <span className="font-mono text-[9px] md:text-[11px] tracking-[0.35em] uppercase text-black/50 mt-3 md:mt-4 hover:text-black hover:font-bold transition-all cursor-default">
                Intelligence for The Urban Planet
              </span>
            </div>

            {/* Right bracket — newsletter CTA */}
            <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col items-end text-right">
              <a href="#subscribe" className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/30 hover:text-[#C5A059] transition-colors leading-relaxed">
                Daily intelligence<br />from CityAge
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─── VERTICAL NAV BAR (becomes sticky on scroll) ─── */}
      <nav className={`bg-[#F9F9F7] z-[100] transition-all duration-300 ${isScrolled ? 'fixed top-0 left-0 right-0 border-b border-black shadow-sm' : 'border-b border-black/20'}`}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-12 flex items-center">

          {/* Compact logo — visible only when scrolled */}
          {isScrolled && (
            <a href="/" className="font-serif font-black uppercase monocle-wordmark text-lg md:text-xl leading-none mr-6 md:mr-10 shrink-0 py-3">
              CityAge
            </a>
          )}

          {/* Vertical links with pipe separators — centered like Monocle */}
          <div className={`flex items-center flex-1 overflow-x-auto md:overflow-visible ${isScrolled ? 'justify-start' : 'justify-center'}`}>
            {['Power', 'Money', 'Cities', 'Frontiers', 'Culture'].map((name, i) => (
              <div key={name} className="flex items-center shrink-0">
                {i > 0 && <span className="text-black/15 mx-1 md:mx-3 text-[10px] hidden md:inline">|</span>}
                <a
                  href={`#${name.toLowerCase()}`}
                  className="px-3 md:px-5 py-3 text-[11px] font-black tracking-[0.25em] uppercase text-black/60 hover:text-black transition-colors"
                >
                  {name}
                </a>
              </div>
            ))}
          </div>

          {/* Sticky bar utilities (only when scrolled) */}
          {isScrolled && (
            <div className="flex items-center gap-3 shrink-0">
              <button className="hover:text-[#C5A059] transition-colors text-black/50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <a href="#" className="bg-[#C5A059] text-black px-4 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase hover:bg-black hover:text-[#C5A059] transition-all">
                Join
              </a>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
