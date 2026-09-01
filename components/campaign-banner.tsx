import Image from 'next/image'

const INVITE_HREF = '/the-next-west'

export function CampaignBanner() {
  return (
    <div className="bg-[#F9F9F7] pt-2 pb-2 md:pt-5 md:pb-4">
      <div
        className="ca-photo ca-photo-banner relative mx-auto w-[min(1000px,calc(100%-3rem))] h-[128px] md:h-[240px] overflow-hidden"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <Image
          src="/vancouver-banner.jpg"
          alt=""
          fill
          sizes="(max-width: 1060px) calc(100vw - 3rem), 1000px"
          className="object-cover object-[center_40%]"
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8">
          <span className="font-serif text-[28px] md:text-[42px] text-white tracking-tight leading-none">
            The Next West.
          </span>
          <span className="font-serif italic text-[12px] md:text-[17px] text-white/85 mt-1 md:mt-2 leading-snug">
            Coming to Vancouver, Winter 2026.
          </span>
          <a
            href={INVITE_HREF}
            className="mt-2 md:mt-3 inline-block border border-white/90 text-white px-3 py-1 md:px-4 md:py-1.5 text-[9px] md:text-[11px] font-black tracking-[0.14em] uppercase hover:bg-white hover:text-black transition-colors"
          >
            Apply for an invitation
          </a>
        </div>
      </div>
    </div>
  )
}
