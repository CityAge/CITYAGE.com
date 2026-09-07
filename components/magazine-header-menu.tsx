'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/** The house line: Purpose · Events · Studio · Partners. Events is a dropdown, not a page. */
const HOUSE_LINKS = [
  { href: '/purpose', label: 'Purpose' },
  { href: '/studio', label: 'Studio' },
  { href: '/partners', label: 'Partners' },
] as const

/** The event franchises in the Events menu. Next Vancouver keeps its page but is not listed; old events come over from WordPress later. */
const EVENTS = [
  { href: '/the-next-west', label: 'The Next West' },
  { href: '/northern-century', label: 'The Northern Century' },
] as const

/** Older pages, reachable from the hamburger only. The event franchises sit under Events. */
const MORE_LINKS = [
  { href: '/contact', label: 'Contact' },
] as const

const HOUSE_LINK_CLASS =
  'text-[11px] font-bold tracking-[0.12em] uppercase text-black hover:opacity-60 transition-opacity'

const isDesktop = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches

export function MagazineUtilityBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)
  const eventsRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<number | null>(null)
  const openedByHover = useRef(false)

  // Escape closes the dropdown (focus back on Events); a click anywhere outside closes it too.
  useEffect(() => {
    if (!eventsOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEventsOpen(false)
        triggerRef.current?.focus()
      }
    }
    const onDown = (e: MouseEvent) => {
      if (!eventsRef.current?.contains(e.target as Node)) setEventsOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onDown)
    }
  }, [eventsOpen])

  const hoverOpen = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    if (isDesktop() && !eventsOpen) {
      openedByHover.current = true
      setEventsOpen(true)
    }
  }
  const hoverClose = () => {
    closeTimer.current = window.setTimeout(() => setEventsOpen(false), 120)
  }
  /** Desktop: a click opens, or pins open a menu the hover already opened; a second click closes. Phones: Events simply opens the hamburger. */
  const onEventsClick = () => {
    if (!isDesktop()) {
      setMenuOpen((o) => !o)
      return
    }
    if (eventsOpen && openedByHover.current) {
      openedByHover.current = false
      return
    }
    openedByHover.current = false
    setEventsOpen((o) => !o)
  }
  const onTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setEventsOpen(true)
      window.setTimeout(() => eventsRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus(), 0)
    }
  }
  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const items = Array.from(eventsRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])
    const i = items.indexOf(document.activeElement as HTMLElement)
    const next = e.key === 'ArrowDown' ? (i + 1) % items.length : (i - 1 + items.length) % items.length
    items[next]?.focus()
  }

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
          <Link href="/purpose" className={`${HOUSE_LINK_CLASS} hidden md:block`}>
            Purpose
          </Link>
          <div ref={eventsRef} className="relative" onMouseEnter={hoverOpen} onMouseLeave={hoverClose}>
            <button
              ref={triggerRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={eventsOpen}
              aria-controls="events-menu"
              onClick={onEventsClick}
              onKeyDown={onTriggerKey}
              className={HOUSE_LINK_CLASS}
            >
              Events
            </button>
            {eventsOpen ? (
              <div
                id="events-menu"
                role="menu"
                aria-label="Events"
                onKeyDown={onMenuKey}
                className="absolute left-0 top-full z-50 mt-3 min-w-[230px] bg-[#F9F9F7] border border-[#D9D7D0]"
              >
                {EVENTS.map((ev) => (
                  <Link
                    key={ev.href}
                    href={ev.href}
                    role="menuitem"
                    onClick={() => setEventsOpen(false)}
                    className={`${HOUSE_LINK_CLASS} block px-5 py-3 border-b border-[#D9D7D0] last:border-b-0 whitespace-nowrap`}
                  >
                    {ev.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
          {HOUSE_LINKS.filter((l) => l.href !== '/purpose').map((link) => (
            <Link key={link.href} href={link.href} className={`${HOUSE_LINK_CLASS} hidden md:block`}>
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
          <Link href="/subscribe" className="bg-[#C5A059] text-black px-5 md:px-8 py-1.5 md:py-2 text-[10px] font-black tracking-[0.15em] uppercase hover:bg-black hover:text-[#C5A059] transition-all">
            Subscribe
          </Link>
        </div>
      </div>
      {menuOpen && (
        <div className="max-w-[1400px] mx-auto flex flex-col gap-3 pt-3 pb-1">
          <Link href="/purpose" className={HOUSE_LINK_CLASS}>
            Purpose
          </Link>
          {/* Events: one entry, the franchises nested beneath it */}
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-black">Events</span>
            {EVENTS.map((ev) => (
              <Link key={ev.href} href={ev.href} className={`${HOUSE_LINK_CLASS} pl-6`}>
                {ev.label}
              </Link>
            ))}
          </div>
          {HOUSE_LINKS.filter((l) => l.href !== '/purpose').map((link) => (
            <Link key={link.href} href={link.href} className={HOUSE_LINK_CLASS}>
              {link.label}
            </Link>
          ))}
          <div className="border-t border-black/15 pt-3 mt-1 flex flex-col gap-3">
            {MORE_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={HOUSE_LINK_CLASS}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
