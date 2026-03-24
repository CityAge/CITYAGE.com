'use client'

import { useState, useEffect } from 'react'

// When compressed, header height is exactly: utility(36) + masthead(48) + nav(40) = 124px
export const HEADER_COMPRESSED_HEIGHT = 124

export function MagazineHeader() {
  const [isCompressed, setIsCompressed] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsCompressed(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="sticky top-0 z-[100] bg-[#F9F9F7]">

      {/* ─── TOP UTILITY BAR ─── */}
      <div className="border-b border-black/15 px-6 md:px-12 py-2">
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

      {/* ─── MASTHEAD: two states, snaps instantly ─── */}
      <div className={`border-b border-black px-6 md:px-12 transition-all duration-200 ${isCompressed ? 'py-2' : 'py-8 md:py-12'}`}>
        <div className="max-w-[1400px] mx-auto relative flex items-center justify-center">

          {/* Left bracket — hidden when compressed */}
          {!isCompressed && (
            <div className="hidden xl:block absolute left-0 bottom-0">
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-black/50 leading-relaxed">
                Currently being<br />edited in Vancouver
              </span>
            </div>
          )}

          {/* Wordmark: big or small */}
          <div className="flex flex-col items-center">
            <a href="/" className={`font-serif font-black uppercase monocle-wordmark text-black tracking-[-0.02em] leading-[0.85] transition-all duration-200 ${isCompressed ? 'text-2xl md:text-3xl' : 'text-[3.5rem] md:text-[7rem] lg:text-[10rem] xl:text-[11rem]'}`}>
              CityAge
            </a>
            {!isCompressed && (
              <span className="text-[11px] md:text-[13px] font-bold tracking-[0.3em] uppercase text-black/70 mt-3 md:mt-4">
                Intelligence for The Urban Planet
              </span>
            )}
          </div>

          {/* Right bracket — hidden when compressed */}
          {!isCompressed && (
            <div className="hidden xl:block absolute right-0 bottom-0 text-right">
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
              {i > 0 && <span className="text-black/20 mx-3 md:mx-4 hidden md:inline">|</span>}
              <a
                href={`#${name.toLowerCase()}`}
                className="px-3 md:px-6 py-3 text-[13px] md:text-[14px] font-bold tracking-[0.2em] uppercase text-black hover:opacity-60 transition-opacity"
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
