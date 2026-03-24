'use client'

import { useEffect, useRef, useState } from 'react'

interface HeroGridProps {
  leadColumn: React.ReactNode
  scrollColumns: React.ReactNode
}

export function HeroGrid({ leadColumn, scrollColumns }: HeroGridProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLDivElement>(null)
  const [leadStyle, setLeadStyle] = useState<'normal' | 'fixed' | 'bottom'>('normal')
  const [leadWidth, setLeadWidth] = useState(0)
  const [sectionTop, setSectionTop] = useState(0)
  const [sectionBottom, setSectionBottom] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !leadRef.current) return

      const section = sectionRef.current.getBoundingClientRect()
      const leadHeight = leadRef.current.scrollHeight
      const headerHeight = 140 // compressed header height

      // Section top relative to viewport
      const sectionTopInViewport = section.top

      // How far the section extends below the viewport
      const sectionBottomInViewport = section.bottom

      // Lead column should fix when the section top scrolls past the header
      // and release when the section bottom reaches the lead bottom
      if (sectionTopInViewport <= headerHeight && sectionBottomInViewport > headerHeight + leadHeight) {
        // Fix in place
        setLeadStyle('fixed')
        setLeadWidth(sectionRef.current.offsetWidth * 0.42) // ~5/12 of section
      } else if (sectionBottomInViewport <= headerHeight + leadHeight) {
        // Pin to bottom of section
        setLeadStyle('bottom')
      } else {
        // Normal flow
        setLeadStyle('normal')
      }
    }

    const handleResize = () => handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <section ref={sectionRef} className="border-b border-black/10 px-6 md:px-10 relative">
      <div className="hidden lg:flex lg:gap-8">
        
        {/* Column 1: the feature — fixed in place while cols 2+3 scroll */}
        <div className="w-[42%] shrink-0 relative">
          <div
            ref={leadRef}
            className="py-8"
            style={
              leadStyle === 'fixed'
                ? { position: 'fixed', top: 140, width: leadWidth, zIndex: 10 }
                : leadStyle === 'bottom'
                ? { position: 'absolute', bottom: 0, width: '100%' }
                : { position: 'relative' }
            }
          >
            {leadColumn}
          </div>
        </div>

        {/* Columns 2+3: the scroll area */}
        <div className="flex-1 flex gap-8">
          {scrollColumns}
        </div>
      </div>

      {/* Mobile: stacked, no sticky behaviour */}
      <div className="lg:hidden">
        <div className="py-8">{leadColumn}</div>
        <div>{scrollColumns}</div>
      </div>
    </section>
  )
}
