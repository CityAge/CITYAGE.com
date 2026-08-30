export function CampaignBanner() {
  return (
    <div className="bg-[#F9F9F7] pt-5 pb-4">
      <div className="mx-auto w-[min(1000px,calc(100%-3rem))] h-[260px] md:h-[290px] bg-[#E8E6E1] border border-black/10 flex flex-col items-center justify-center text-center px-8">
        <span className="font-serif text-[22px] md:text-[28px] text-black tracking-tight leading-tight">
          The Next West.
        </span>
        <span className="font-serif italic text-[16px] md:text-[19px] text-black/55 mt-2 leading-snug">
          Coming to Vancouver, Winter 2026.
        </span>
      </div>
    </div>
  )
}
