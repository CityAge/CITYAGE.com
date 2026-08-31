'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'

export function DoorSpeakersLazy() {
  const slotRef = useRef<HTMLDivElement>(null)
  const [Strip, setStrip] = useState<ComponentType | null>(null)

  useEffect(() => {
    const el = slotRef.current
    if (!el) return

    const load = () => {
      void import(
        /* webpackPrefetch: false, webpackPreload: false */
        '@/components/door-speakers-strip'
      ).then((mod) => {
        setStrip(() => mod.DoorSpeakersStrip)
      })
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        load()
      },
      { rootMargin: '240px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return <div ref={slotRef}>{Strip ? <Strip /> : null}</div>
}
