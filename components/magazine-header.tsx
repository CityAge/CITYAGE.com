import {
  WORDMARK_LARGE,
  VerticalNav,
} from '@/components/magazine-header-chrome'
import { MagazineUtilityBar } from '@/components/magazine-header-menu'
import { MagazineStickyHeader } from '@/components/magazine-header-sticky'

export { HEADER_COMPRESSED_HEIGHT } from '@/components/magazine-header-chrome'
export {
  WORDMARK_TYPE,
  WORDMARK_LARGE,
  WORDMARK_COMPACT,
  WORDMARK_COMPACT_ON_INK,
} from '@/components/magazine-header-chrome'

export function MagazineHeader() {
  return (
    <>
      <header className="bg-[#F9F9F7]">
        <MagazineUtilityBar />

        <div className="border-b border-black px-6 md:px-12 py-10 md:py-16">
          <div className="max-w-[1400px] mx-auto relative flex items-center justify-center">
            <div className="flex flex-col items-center">
              <a id="cityage-masthead" href="/" className={WORDMARK_LARGE}>
                CITYAGE
              </a>
            </div>
          </div>
        </div>

        <VerticalNav />
      </header>

      <MagazineStickyHeader />
    </>
  )
}
