'use client'

import { useEffect } from 'react'

/** Progressive enhancement only. First paint already has the uncompressed clothes. */
export function MagazineHeaderCompress() {
  useEffect(() => {
    const header = document.getElementById('paper-header')
    if (!header) return
    const onScroll = () => {
      header.toggleAttribute('data-compressed', window.scrollY > 100)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return null
}
