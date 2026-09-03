'use client'

import { useEffect, useState } from 'react'
import { CityAgeMark, VerticalNav } from '@/components/magazine-header-chrome'

export function MagazineStickyHeader({
  hideRailOnPhone = false,
}: {
  hideRailOnPhone?: boolean
}) {
  const [mastheadGone, setMastheadGone] = useState(false)

  useEffect(() => {
    const el = document.getElementById('cityage-masthead')
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMastheadGone(!entry.isIntersecting)
      },
      { threshold: 0, root: null },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] bg-[#F9F9F7] ${mastheadGone ? '' : 'hidden'}`}
      aria-hidden={!mastheadGone}
    >
      <div className="border-b border-black px-6 md:px-12 py-2">
        <div className="max-w-[1400px] mx-auto relative flex items-center justify-center">
          <div className="flex flex-col items-center">
            <CityAgeMark tone="cream" size="compact" />
          </div>
        </div>
      </div>
      <VerticalNav hideOnPhone={hideRailOnPhone} />
    </header>
  )
}
