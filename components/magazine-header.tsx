'use client'

import { useState, useEffect } from 'react'

// When compressed, header height is exactly: utility(36) + masthead(48) + nav(40) = 124px
export const HEADER_COMPRESSED_HEIGHT = 124

const HOUSE = [
  { href: '/purpose', label: 'Purpose' },
  { href: '/partners', label: 'Partners' },
  { href: '/studio', label: 'Studio' },
]

export function MagazineHeader() {
  const [isCompressed, setIsCompressed] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsCompressed(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
    <header className="sticky top-0 z-[100] bg-[#F9F9F7]">

      {/* ─── TOP UTILITY BAR — hidden when compressed ─── */}
      <div className={`border-b border-black/15 px-6 md:px-12 py-2 transition-all duration-200 ${isCompressed ? 'hidden' : ''}`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5 md:gap-7">
            <button
              type="button"
              className="md:hidden flex items-center gap-2 text-[11px] font-black tracking-[0.15em] uppercase text-black hover:opacity-60 transition-opacity"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="house-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
            <a href="/purpose" className="text-[11px] font-bold tracking-[0.12em] uppercase text-black hover:opacity-60 transition-opacity hidden md:block">Purpose</a>
            <a href="/partners" className="text-[11px] font-bold tracking-[0.12em] uppercase text-black hover:opacity-60 transition-opacity hidden md:block">Partners</a>
            <a href="/studio" className="text-[11px] font-bold tracking-[0.12em] uppercase text-black hover:opacity-60 transition-opacity hidden md:block">Studio</a>
          </div>
          <div className="flex items-center gap-5 md:gap-7">
            <a href="/people.html" className="hover:opacity-60 transition-opacity text-black" aria-label="Search contributors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </a>
            <a href="#subscribe" className="text-[11px] font-bold tracking-[0.12em] uppercase text-black hover:opacity-60 transition-opacity hidden sm:block">Log in</a>
            <a href="#subscribe" className="bg-[#C5A059] text-black px-5 md:px-8 py-1.5 md:py-2 text-[10px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] transition-all">
              Subscribe
            </a>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          id="house-menu"
          className="border-b border-black bg-[#F9F9F7] px-6 md:px-12 py-5 md:hidden"
        >
          <nav className="max-w-[1400px] mx-auto grid grid-cols-1 gap-y-1">
            {HOUSE.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-[13px] font-bold tracking-[0.12em] uppercase text-black py-2 border-b border-black/10"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* ─── MASTHEAD: two states, snaps instantly ─── */}
      <div className={`border-b border-black px-6 md:px-12 transition-all duration-200 ${isCompressed ? 'py-2' : 'py-8 md:py-12'}`}>
        <div className="max-w-[1400px] mx-auto relative flex items-center justify-center">



          {/* Wordmark: big or small — do not restyle .monocle-wordmark */}
          <div className="flex flex-col items-center text-center">
            <a href="/" className={`font-serif font-black uppercase monocle-wordmark text-black tracking-[0.035em] leading-[0.85] transition-all duration-200 ${isCompressed ? 'text-2xl md:text-3xl' : 'text-[3.5rem] md:text-[7rem] lg:text-[10rem] xl:text-[11rem]'}`}>
              CITYAGE
            </a>
            {!isCompressed && (
              <p className="mt-4 px-4 font-serif text-[14px] md:text-[16px] text-black/70 leading-snug">
                Intelligence for the urban planet.
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ─── VERTICAL NAV ─── */}
      <div className="border-b-2 border-black px-4 md:px-12">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between md:justify-center overflow-x-auto md:overflow-visible">
          {['Power', 'Money', 'Cities', 'Frontiers', 'Culture'].map((name, i) => (
            <div key={name} className="flex items-center shrink-0">
              {i > 0 && <span className="text-black/60 mx-1.5 sm:mx-3 md:mx-6 text-[11px] md:text-base font-normal">|</span>}
              <a
                href={`#${name.toLowerCase()}`}
                className="px-1 sm:px-3 md:px-5 py-3 md:py-4 text-[11px] sm:text-[13px] md:text-[16px] font-black tracking-[0.08em] md:tracking-[0.15em] uppercase text-black hover:opacity-50 transition-opacity"
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
