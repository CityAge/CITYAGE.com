import Link from 'next/link'
import { CityAgeMark } from '@/components/magazine-header-chrome'

const HOUSE = [
  { href: '/purpose', label: 'Purpose' },
  { href: '/partners', label: 'Partners' },
  { href: '/studio', label: 'Studio' },
] as const

/** The magazine's utility bar and compact drawn mark, in the dark, for /pulse. */
export function PulseHeader() {
  return (
    <header className="bg-black text-[#F9F9F7] border-b border-white/15 px-6 md:px-12 h-[57px] flex items-center">
      <div className="max-w-[1400px] mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-5 md:gap-7">
          <CityAgeMark tone="ink" size="compact" />
          {HOUSE.map((link) => (
            <Link key={link.href} href={link.href} className="hidden md:block font-serif text-[11px] font-bold tracking-[0.12em] uppercase text-[#F9F9F7] hover:opacity-60 transition-opacity">
              {link.label}
            </Link>
          ))}
        </div>
        <Link href="/subscribe" className="bg-[#C5A059] text-black px-5 md:px-8 py-1.5 md:py-2 text-[10px] font-black tracking-[0.15em] uppercase hover:bg-white transition-colors">
          Subscribe
        </Link>
      </div>
    </header>
  )
}
