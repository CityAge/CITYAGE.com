export function CampaignBanner() {
  return (
    <div className="w-full border-b border-black/10 bg-[#F0EEE9]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-3 md:py-3.5 flex items-baseline justify-center gap-4 md:gap-8">
        <span className="font-serif font-bold text-[15px] md:text-[17px] text-black tracking-tight">
          The Next West.
        </span>
        <span className="font-serif italic text-[13px] md:text-[15px] text-black/55">
          Coming to Vancouver, Winter 2026.
        </span>
      </div>
    </div>
  )
}
