import Image from 'next/image'

export function CampaignBanner() {
  return (
    <div className="bg-[#F9F9F7] pt-5 pb-4">
      <div className="relative mx-auto w-[min(1000px,calc(100%-3rem))] h-[260px] md:h-[290px] overflow-hidden">
        <Image
          src="/vancouver-banner.jpg"
          alt=""
          fill
          className="object-cover object-[center_40%]"
          priority
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <span className="font-serif text-[22px] md:text-[28px] text-white tracking-tight leading-tight">
            The Next West.
          </span>
          <span className="font-serif italic text-[16px] md:text-[19px] text-white/80 mt-2 leading-snug">
            Coming to Vancouver, Winter 2026.
          </span>
        </div>
      </div>
    </div>
  )
}
