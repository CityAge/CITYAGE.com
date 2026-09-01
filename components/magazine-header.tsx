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
          <div className="max-w-[1400px] mx-auto relative flex items-center justify-center">
            <div className="flex flex-col items-center">
              <CityAgeMark id="cityage-masthead" tone="cream" size="large" />
            </div>
          </div>
        </div>

        <VerticalNav hideOnPhone={hideRailOnPhone} />
      </header>

      <MagazineStickyHeader hideRailOnPhone={hideRailOnPhone} />
    </>
  )
}
