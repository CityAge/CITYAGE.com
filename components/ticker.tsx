'use client'

import { useEffect, useRef } from 'react'

const tickerItems = [
  'OTTAWA SUMMIT: MAY 26 CONFIRMED',
  'ORBIT DC: SPACE ECONOMY LAUNCH',
  'DEFENCE-TECH PROCUREMENT: TRANS-ATLANTIC',
  'NEXT VANCOUVER: JUNE 19',
  'SINGAPORE: +32.4°C',
  'COPENHAGEN: 1.2M SMART NODES',
  'RENEWABLE GRID: 98.6%',
  'TRADE FLUX NORTH ATLANTIC: +2.4%',
]

export function Ticker() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let pos = 0
    const step = () => {
      pos -= 0.6
      if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0
      el.style.transform = `translateX(${pos}px)`
      requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="border-b border-black bg-black text-white py-3 overflow-hidden">
      <div ref={ref} className="inline-flex items-center gap-14 will-change-transform whitespace-nowrap">
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-14 shrink-0">
            <span className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase">
              {item}
            </span>
            <span className="text-white/20 text-xs">●</span>
          </span>
        ))}
      </div>
    </div>
  )
}
