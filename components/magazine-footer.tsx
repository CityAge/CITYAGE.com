import { LOGO_WHITE } from '@/components/magazine-header-chrome'

/** The footer mirrors the masthead: the house line, the five sections, and the utilities. */
const HOUSE = [
  { href: '/purpose', label: 'Purpose' },
  { href: '/studio', label: 'Studio' },
  { href: '/partners', label: 'Partners' },
] as const
/** Events has no page of its own; in the footer it heads the franchises. */
const EVENTS = [
  { href: '/the-next-west', label: 'The Next West' },
  { href: '/northern-century', label: 'The Northern Century' },
] as const
const SECTIONS = [
  { href: '/power', label: 'Power' },
  { href: '/money', label: 'Money' },
  { href: '/cities', label: 'Cities' },
  { href: '/frontiers', label: 'Frontiers' },
  { href: '/culture', label: 'Culture' },
] as const
const UTILITIES = [
  { href: '/contact', label: 'Contact' },
  { href: '/subscribe', label: 'Subscribe' },
  { href: '/privacy', label: 'Privacy' },
] as const

const HEAD = 'text-[11px] font-bold tracking-[0.18em] uppercase text-white'
const LINK = 'text-[11px] font-bold tracking-[0.12em] uppercase text-white/70 hover:text-white transition-colors'

export function MagazineFooter() {
  return (
    <footer className="bg-black text-white py-14 px-8 mt-auto font-serif">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10 border-t border-white/15 pt-12">

        {/* Brand */}
        <div className="md:col-span-5 space-y-5">
          <h2 className="m-0">
            {/* Drawn mark — same as the masthead, white, smaller. Not a web-font CITYAGE. */}
            <img
              src={LOGO_WHITE}
              alt="CITYAGE"
              width={517}
              height={119}
              className="block h-auto w-[min(64vw,18rem)]"
              decoding="async"
            />
          </h2>
          <p className="text-white text-[18px] md:text-[20px] leading-snug">Intelligence for The Urban Planet</p>
          <p className="text-[12px] leading-none uppercase tracking-[0.08em] text-white/60">Vancouver · Ottawa · Washington</p>
          <p className="text-white/80 text-[16px] md:text-[17px] leading-relaxed">Earth’s two per cent. Where everything happens.</p>
          <a
            href="/subscribe"
            className="inline-block bg-[#C5A059] text-black px-8 py-2.5 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-white transition-colors"
          >
            Subscribe
          </a>
          <address className="not-italic text-[14px] text-white/70 leading-relaxed pt-2">
            <a href="mailto:info@cityage.com" className="hover:text-white transition-colors">info@cityage.com</a>
            <span className="text-white/30"> · </span>
            <a href="https://www.linkedin.com/company/cityage/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          </address>
          <p className="text-white/70 text-[14px]">© CityAge 2026</p>
        </div>

        {/* House line */}
        <nav className="md:col-span-3 space-y-4" aria-label="CityAge">
          <h3 className={HEAD}>CityAge</h3>
          <ul className="space-y-3">
            {HOUSE.slice(0, 1).map((l) => (
              <li key={l.href}><a href={l.href} className={LINK}>{l.label}</a></li>
            ))}
            <li>
              <span className={LINK.replace('text-white/70 hover:text-white transition-colors', 'text-white/70')}>Events</span>
              <ul className="mt-3 space-y-3 pl-5 border-l border-white/15">
                {EVENTS.map((l) => (
                  <li key={l.href}><a href={l.href} className={LINK}>{l.label}</a></li>
                ))}
              </ul>
            </li>
            {HOUSE.slice(1).map((l) => (
              <li key={l.href}><a href={l.href} className={LINK}>{l.label}</a></li>
            ))}
          </ul>
        </nav>

        {/* Sections */}
        <nav className="md:col-span-2 space-y-4" aria-label="Sections">
          <h3 className={HEAD}>Sections</h3>
          <ul className="space-y-3">
            {SECTIONS.map((l) => (
              <li key={l.href}><a href={l.href} className={LINK}>{l.label}</a></li>
            ))}
          </ul>
        </nav>

        {/* Utilities */}
        <nav className="md:col-span-2 space-y-4" aria-label="Utilities">
          <h3 className={HEAD}>CityAge Media</h3>
          <ul className="space-y-3">
            {UTILITIES.map((l) => (
              <li key={l.href}><a href={l.href} className={LINK}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}
