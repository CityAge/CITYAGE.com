'use client'

import { useState, useEffect } from 'react'

export function MagazineHeader() {
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-[100] bg-[#F9F9F7]">

      {/* ─── UTILITY BAR ─── */}
      <div className={`border-b border-black/15 px-6 md:px-12 transition-all duration-500 ${compact ? 'py-1' : 'py-2.5'}`}>
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

      {/* ─── MASTHEAD ─── */}
      <div className={`border-b border-black px-6 md:px-12 transition-all duration-500 ${compact ? 'py-2' : 'py-8 md:py-10'}`}>
        <div className="max-w-[1400px] mx-auto relative flex items-center">

          {/* Left bracket — only when expanded */}
          <div className={`hidden xl:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col items-start text-left transition-opacity duration-500 ${compact ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-black/40 leading-relaxed">
              Currently being<br />edited in Vancouver
            </span>
          </div>

          {/* Center: wordmark — transitions between large and small */}
          <div className="flex flex-col items-center w-full">
            <a
              href="/"
              className={`font-serif font-black uppercase monocle-wordmark leading-[0.85] text-black tracking-[-0.02em] transition-all duration-500 ${compact ? 'text-xl md:text-2xl' : 'text-[3rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem]'}`}
            >
              CityAge
            </a>
            {/* Tagline — collapses when compact */}
            <div className={`transition-all duration-500 overflow-hidden ${compact ? 'max-h-0 opacity-0 mt-0' : 'max-h-10 opacity-100 mt-3'}`}>
              <span className="text-[11px] md:text-[13px] font-bold tracking-[0.3em] uppercase text-black/70 block">
                Intelligence for The Urban Planet
              </span>
            </div>
          </div>

          {/* Right bracket — only when expanded */}
          <div className={`hidden xl:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-end text-right transition-opacity duration-500 ${compact ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <a href="#subscribe" className="text-[10px] font-medium tracking-[0.15em] uppercase text-black/40 hover:text-black transition-colors leading-relaxed">
              Daily intelligence<br />from CityAge
            </a>
          </div>
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
