export function CampaignBanner() {
  return (
    <div className="bg-[#F9F9F7] px-8 md:px-16 lg:px-20 pt-6 pb-5">
      <div className="max-w-[1400px] mx-auto bg-[#E8E6E1] border border-black/10 px-10 md:px-16 py-16 md:py-20 min-h-[200px] md:min-h-[228px] flex flex-col items-center justify-center text-center">
        <span className="font-serif text-[22px] md:text-[28px] text-black tracking-tight leading-tight block">
          The Next West.
        </span>
        <span className="font-serif italic text-[16px] md:text-[19px] text-black/55 mt-3 leading-snug block">
          Coming to Vancouver, Winter 2026.
        </span>
      </div>
    </div>
  )
}
