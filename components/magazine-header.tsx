'use client'

import { useState, useEffect } from 'react'

export function MagazineHeader() {
  const [time, setTime] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const dcTime = now.toLocaleTimeString('en-US', {
        hour12: false, timeZone: 'America/New_York',
        hour: '2-digit', minute: '2-digit'
      })
      setTime(`${dcTime} EST`)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top utility bar */}
      <div className="border-b border-black/10 bg-[#F9F9F7] px-6 md:px-12 py-2">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/30 hidden lg:block shrink-0">
              Vancouver · {time}
            </span>
            <span className="text-black/10 text-[9px] hidden lg:block">|</span>
            <a href="https://cityage.com/events" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors shrink-0 hidden md:block">Events</a>
            <a href="/partners" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors shrink-0 hidden md:block">Knowledge Partners</a>
            <a href="/past-events" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors shrink-0 hidden lg:block">Past Events</a>
            <a href="https://cityage.com/about-us/purpose" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors shrink-0 hidden lg:block">Purpose</a>
            <a href="https://cityage.com/about-us" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors shrink-0 hidden lg:block">Contact</a>
            <a href="#sponsors" className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#C5A059] hover:text-black transition-colors shrink-0">Be a Sponsor</a>
          </div>
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <a href="#" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors hidden sm:block">Subscribe</a>
            <span className="text-black/15 text-[9px] hidden sm:block">|</span>
            <a href="#" className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/50 hover:text-black transition-colors">Log in</a>
          </div>
        </div>
      </div>

      {/* Main masthead */}
      <header className={`bg-[#F9F9F7] z-[60] ${isScrolled ? 'fixed top-0 left-0 right-0 border-b border-black shadow-sm' : 'relative border-b border-black'}`}>
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className={`flex items-center justify-between transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6 md:py-10'}`}>

            {/* Left: menu */}
            <a href="/" className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase hover:text-[#C5A059] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <span className="hidden sm:inline">Menu</span>
            </a>

            {/* Center: masthead */}
            <div className="flex flex-col items-center">
              {!isScrolled && (
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] uppercase text-black/50 mb-2">
                  Published by CityAge Media
                </span>
              )}
              <a href="/" className={`font-serif font-black uppercase monocle-wordmark leading-none transition-all duration-500 ${isScrolled ? 'text-xl md:text-2xl' : 'text-4xl md:text-6xl lg:text-8xl'}`}>
                CityAge
              </a>
              {!isScrolled && (
                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-[#C5A059] mt-3">
                  Intelligence for the 3 per cent
                </span>
              )}
            </div>

            {/* Right: search + join */}
            <div className="flex items-center gap-3 md:gap-5">
              <button className="hover:text-[#C5A059] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="bg-[#C5A059] text-black px-4 md:px-6 py-1.5 md:py-2 text-[9px] font-black tracking-[0.2em] uppercase hover:bg-black hover:text-[#C5A059] transition-all">
                Join
              </button>
            </div>

          </div>
        </div>
      </header>
    </>
  )
}
