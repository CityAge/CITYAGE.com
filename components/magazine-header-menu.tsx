'use client'

import Link from 'next/link'
import { useState } from 'react'

const HOUSE_LINKS = [
  { href: '/purpose', label: 'Purpose' },
  { href: '/partners', label: 'Partners' },
  { href: '/studio', label: 'Studio' },
] as const

const HOUSE_LINK_CLASS =
  'text-[11px] font-bold tracking-[0.12em] uppercase text-black hover:opacity-60 transition-opacity'

export function MagazineUtilityBar() {
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
