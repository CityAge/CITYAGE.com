'use client'

import { useEffect, useRef } from 'react'

const partners = [
  'SHELL', 'GOOGLE', 'MICROSOFT', 'JACOBS', 'KAUFFMAN FOUNDATION',
  'WESGROUP', 'EMILI', 'COMMUNITECH', 'NATIONAL DESIGN', 'FAIRFAX COUNTY',
]

export function PartnerMarquee() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let pos = 0
    const step = () => {
      pos -= 0.4
      if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0
      el.style.transform = `translateX(${pos}px)`
      requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="border-b border-black/10 bg-[#F9F9F7] overflow-hidden py-3">
      <div ref={ref} className="inline-flex items-center gap-12 will-change-transform whitespace-nowrap">
        {[...partners, ...partners].map((p, i) => (
          <span key={i} className="inline-flex items-center gap-12 shrink-0">
            <span className="font-mono text-[9px] tracking-[0.3em] text-black/20 uppercase font-bold">
              {p}
            </span>
            <span className="text-black/10 text-[8px]">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
