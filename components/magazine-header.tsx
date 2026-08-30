'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Compact sticky: masthead(py-2) + nav. Used as a swap after the large mark is gone.
export const HEADER_COMPRESSED_HEIGHT = 124

/** One CITYAGE drawing — door and Studio share this. No second face. */
export const WORDMARK_TYPE =
  'font-serif font-black uppercase monocle-wordmark tracking-[0.035em] leading-[0.85]'

const WORDMARK_LARGE = `${WORDMARK_TYPE} text-black text-[2.25rem] md:text-[4rem] lg:text-[5.5rem] xl:text-[6rem]`
const WORDMARK_COMPACT = `${WORDMARK_TYPE} text-black text-2xl md:text-3xl`

/** Same compact mark as the door, white on ink. */
export const WORDMARK_COMPACT_ON_INK = `${WORDMARK_TYPE} text-white text-2xl md:text-3xl`

const HOUSE_LINKS = [
  { href: '/purpose', label: 'Purpose' },
  { href: '/partners', label: 'Partners' },
  { href: '/studio', label: 'Studio' },
] as const

const HOUSE_LINK_CLASS =
  'text-[11px] font-bold tracking-[0.12em] uppercase text-black hover:opacity-60 transition-opacity'

function UtilityBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="border-b border-black/15 px-6 md:px-12 py-2">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-5 md:gap-7">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-label="Menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 text-[11px] font-black tracking-[0.15em] uppercase text-black hover:opacity-60 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          {HOUSE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${HOUSE_LINK_CLASS} hidden md:block`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-5 md:gap-7">
          <button className="hover:opacity-60 transition-opacity text-black" aria-label="Search">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <a href="/#subscribe" className="bg-[#C5A059] text-black px-5 md:px-8 py-1.5 md:py-2 text-[10px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] transition-all">
            Subscribe
          </a>
        </div>
      </div>
      {menuOpen && (
        <div className="max-w-[1400px] mx-auto flex flex-col gap-3 pt-3 pb-1">
          {HOUSE_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={HOUSE_LINK_CLASS}>
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function VerticalNav() {
  return (
    <div className="border-b-2 border-black px-4 md:px-12">
      <div className="max-w-[1400px] mx-auto flex items-center justify-center overflow-x-auto md:overflow-visible">
        {['Power', 'Money', 'Cities', 'Frontiers', 'Culture'].map((name, i) => (
          <div key={name} className="flex items-center shrink-0">
            {i > 0 && <span className="text-black/60 mx-4 md:mx-6 text-base font-normal">|</span>}
            <a
              href={`#${name.toLowerCase()}`}
              className="px-3 md:px-5 py-4 text-[14px] md:text-[16px] font-black tracking-[0.15em] uppercase text-black hover:opacity-50 transition-opacity"
            >
              {name}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export function MagazineHeader() {
  const [mastheadGone, setMastheadGone] = useState(false)
  const wordmarkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const el = wordmarkRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setMastheadGone(!entry.isIntersecting)
      },
      { threshold: 0, root: null }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* In-flow masthead: large CITYAGE stays locked size and scrolls off with the page */}
      <header className="bg-[#F9F9F7]">
        <UtilityBar />

        <div className="border-b border-black px-6 md:px-12 py-10 md:py-16">
          <div className="max-w-[1400px] mx-auto relative flex items-center justify-center">
            <div className="flex flex-col items-center">
              <a ref={wordmarkRef} href="/" className={WORDMARK_LARGE}>
                CITYAGE
              </a>
            </div>
          </div>
        </div>

        <VerticalNav />
      </header>

      {/* Compact sticky: existing small mark, only after the large one has left the viewport */}
      <header
        className={`fixed top-0 left-0 right-0 z-[100] bg-[#F9F9F7] ${mastheadGone ? '' : 'hidden'}`}
        aria-hidden={!mastheadGone}
      >
        <div className="border-b border-black px-6 md:px-12 py-2">
          <div className="max-w-[1400px] mx-auto relative flex items-center justify-center">
            <div className="flex flex-col items-center">
              <a href="/" className={WORDMARK_COMPACT}>
                CITYAGE
              </a>
            </div>
          </div>
        </div>
        <VerticalNav />
      </header>
    </>
  )
}
