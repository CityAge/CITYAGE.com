'use client'

import { useState, useEffect } from 'react'

export function MagazineHeader() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Progress from 0 (top of page) to 1 (fully compressed) over 300px of scroll
  const progress = Math.min(scrollY / 300, 1)
  const isCompressed = progress > 0.95

  // Logo font size: desktop 12rem → 1.5rem, mobile 3.5rem → 1.25rem
  const desktopSize = 12 - progress * 10.5 // 12rem → 1.5rem
  const mobileSize = 3.5 - progress * 2.25 // 3.5rem → 1.25rem

  // Padding: 48px → 8px
  const vertPad = Math.max(8, 48 - progress * 40)

  // Fade out brackets and tagline
  const fadeOut = Math.max(0, 1 - progress * 2.5) // gone by 40% scroll

  return (
    <header className="sticky top-0 z-[100] bg-[#F9F9F7]">

      {/* ─── TOP UTILITY BAR ─── */}
      <div className="border-b border-black/15 px-6 md:px-12" style={{
        paddingTop: `${Math.max(4, 10 - progress * 6)}px`,
        paddingBottom: `${Math.max(4, 10 - progress * 6)}px`,
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

      {/* ─── MASTHEAD: Logo shrinks continuously, never disappears ─── */}
      <div className="border-b border-black px-6 md:px-12 relative overflow-hidden" style={{
        paddingTop: `${vertPad}px`,
        paddingBottom: `${vertPad}px`,
      }}>
        <div className="max-w-[1400px] mx-auto relative">

          {/* Left bracket — illustration + CTA, like Monocle's book drawing */}
          {fadeOut > 0 && (
            <div className="hidden xl:flex absolute left-0 bottom-2 flex-col items-start text-left gap-2" style={{ opacity: fadeOut }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="https://rniqmxpmtqmnwqtawlnz.supabase.co/storage/v1/object/public/magazine-images/masthead-thinker-v5.png" 
                alt="Got an idea? Write it for us." 
                className="w-[90px] h-[90px] rounded object-cover"
              />
              <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-black/50 leading-tight">
                Got an idea?<br />Write it for us.
              </span>
            </div>
          )}

          {/* Center: continuously shrinking wordmark */}
          <div className="flex flex-col items-center">
            <a href="/" className="font-serif font-black uppercase monocle-wordmark leading-[0.85] text-black tracking-[-0.02em]" style={{
              fontSize: `max(${mobileSize}rem, min(${desktopSize}rem, 12rem))`,
            }}>
              CityAge
            </a>

            {/* Tagline — fades out */}
            {fadeOut > 0 && (
              <span className="text-[11px] md:text-[13px] font-bold tracking-[0.3em] uppercase text-black/70 mt-3" style={{ opacity: fadeOut }}>
                Intelligence for The Urban Planet
              </span>
            )}
          </div>

          {/* Right bracket — newsletter CTA + location */}
          {fadeOut > 0 && (
            <div className="hidden xl:flex absolute right-0 bottom-2 flex-col items-end text-right gap-2" style={{ opacity: fadeOut }}>
              <a href="#subscribe" className="text-[9px] font-bold tracking-[0.12em] uppercase text-black/50 hover:text-black transition-colors leading-tight">
                Daily intelligence<br />from CityAge
              </a>
              <span className="text-[8px] tracking-[0.12em] uppercase text-black/30">
                Edited in Vancouver
              </span>
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
