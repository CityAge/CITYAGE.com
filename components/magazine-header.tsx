'use client'

import { useState, useEffect } from 'react'

export function MagazineHeader() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const dcTime = now.toLocaleTimeString('en-US', { 
        hour12: false, timeZone: 'America/New_York',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      })
      setTime(`${dcTime} EST`)
      const dateStr = now.toLocaleDateString('en-US', {
        month: 'long', day: '2-digit', year: 'numeric', timeZone: 'America/New_York'
      }).toUpperCase()
      setDate(dateStr)
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`transition-all duration-700 ease-in-out border-b border-black bg-[#F9F9F7] z-[60] ${isScrolled ? 'fixed top-0 left-0 right-0 py-3 shadow-md' : 'relative'}`}>
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 relative flex flex-col">
        
        {/* Top utility row */}
        <div className={`flex justify-between items-center py-4 md:py-10 border-b border-black/5 transition-all duration-500 relative ${isScrolled ? 'h-0 opacity-0 overflow-hidden py-0' : 'h-auto'}`}>
          
          {/* Centered tagline */}
          {!isScrolled && (
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 mt-10 pointer-events-none z-0">
              <div className="tagline-lock whitespace-nowrap">
                INTELLIGENCE FOR THE URBAN PLANET
              </div>
            </div>
          )}

          <button className="flex items-center space-x-2 md:space-x-4 text-[10px] font-black tracking-[0.2em] uppercase hover:text-[#1A365D] transition-all relative z-10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
            <span className="hidden sm:inline">MENU</span>
          </button>

          <div className="flex items-center space-x-6 md:space-x-12 relative z-10">
            <button className="hidden md:block text-[10px] font-black tracking-[0.2em] uppercase text-black hover:opacity-50 transition-opacity">
              LOG IN
            </button>
            <button className="bg-[#C5A059] text-black px-6 md:px-12 py-2 md:py-3 text-[10px] font-black tracking-[0.2em] uppercase hover:bg-black hover:text-[#C5A059] transition-all shadow-xl">
              <span className="md:hidden">JOIN</span>
              <span className="hidden md:inline">JOIN THE NETWORK</span>
            </button>
          </div>
        </div>

        {/* Wordmark block */}
        <div className={`relative flex flex-col items-center justify-center transition-all duration-700 ${isScrolled ? 'h-[60px]' : 'h-[160px] md:h-[300px]'}`}>
          
          {/* Left bracket — Vancouver hub */}
          {!isScrolled && (
            <div className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 items-center space-x-6 text-left z-0">
              <div className="flex flex-col space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 leading-none">Global Dispatch // Vancouver Hub</span>
                <div className="h-px w-12 bg-black/10"></div>
                <span className="font-mono text-[9px] font-bold text-black/30 tracking-widest uppercase">{time}</span>
              </div>
            </div>
          )}

          {/* CITYAGE wordmark */}
          <div className="flex flex-col items-center justify-center z-10 select-none cursor-pointer mx-auto px-12 md:px-[80px]">
            <h1 className={`font-serif monocle-wordmark uppercase leading-[0.5] flex justify-center items-baseline transition-all duration-700 ${isScrolled ? 'text-2xl md:text-4xl' : 'text-[2.2rem] md:text-[11.5rem]'}`}>
              CITYAGE
            </h1>
            {!isScrolled && (
              <div className="md:hidden mt-8 tagline-lock text-[12px] whitespace-nowrap text-center">
                INTELLIGENCE FOR THE URBAN PLANET
              </div>
            )}
          </div>

          {/* Right bracket — DC time */}
          {!isScrolled && (
            <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col items-end text-right space-y-2 z-0">
              <span className="font-mono text-[11px] font-bold text-black tracking-widest uppercase mb-1">{time}</span>
              <span className="font-mono text-[10px] font-bold text-black/20 tracking-widest uppercase">{date}</span>
              <div className="h-px w-12 bg-[#C5A059] mt-2"></div>
            </div>
          )}

          {/* Mobile time */}
          {!isScrolled && (
            <div className="lg:hidden mt-4 flex flex-col items-center space-y-1 text-[8px] font-mono font-bold tracking-[0.35em] text-black/40 uppercase">
              <span>Vancouver Hub // {time}</span>
              <span>{date}</span>
            </div>
          )}

          {/* Scrolled compact controls */}
          {isScrolled && (
            <div className="absolute right-0 flex items-center space-x-4 md:space-x-6">
              <button className="hover:text-[#C5A059] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <div className="h-4 w-px bg-black/10" />
              <button className="bg-[#C5A059] text-black px-4 py-1.5 text-[9px] font-black tracking-[0.2em] uppercase">JOIN</button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
