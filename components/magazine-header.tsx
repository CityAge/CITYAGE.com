import { CityAgeMark, VerticalNav } from '@/components/magazine-header-chrome'
import { MagazineUtilityBar } from '@/components/magazine-header-menu'
import { MagazineStickyHeader } from '@/components/magazine-header-sticky'

export { HEADER_COMPRESSED_HEIGHT } from '@/components/magazine-header-chrome'
export { CityAgeMark } from '@/components/magazine-header-chrome'

export function MagazineHeader({ hideRailOnPhone = false }: { hideRailOnPhone?: boolean } = {}) {
  return (
    <>
      <header className="bg-[#F9F9F7]">
        <MagazineUtilityBar />

        <div className="border-b border-black px-6 md:px-12 py-9 md:py-16">
          <div className="max-w-[1400px] mx-auto relative flex items-center justify-center lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
            <a
              href="/subscribe"
              className="hidden lg:block justify-self-start font-serif text-[15px] text-black underline decoration-[#C5A059] decoration-1 underline-offset-8 hover:text-[#9A7738] transition-colors"
            >
              Subscribe
            </a>
            <div className="flex flex-col items-center">
              <CityAgeMark id="cityage-masthead" tone="cream" size="large" />
              <p className="mt-4 text-center font-serif text-[13px] md:text-[15px] font-normal leading-snug tracking-[0.04em] text-black/65">
                Intelligence for the urban planet
              </p>
            </div>
            <a
              href="/contact?subject=contribute"
              className="hidden lg:block justify-self-end font-serif text-[15px] text-black underline decoration-[#C5A059] decoration-1 underline-offset-8 hover:text-[#9A7738] transition-colors"
            >
              Contributions welcome
            </a>
          </div>
        </div>

        <VerticalNav hideOnPhone={hideRailOnPhone} />
      </header>

      <MagazineStickyHeader hideRailOnPhone={hideRailOnPhone} />
    </>
  )
}
