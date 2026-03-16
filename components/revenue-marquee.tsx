'use client'

export function RevenueMarquee() {
  return (
    <div className="bg-[#D4AF37] text-[#0D0D0D] py-4 px-8 md:px-16 font-mono text-xs md:text-sm tracking-widest uppercase font-semibold">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-1">
          <span>OTTAWA</span>
          <span className="text-[#0D0D0D]/50">•</span>
          <span>MAY 26</span>
          <span className="text-[#0D0D0D]/50">•</span>
          <span className="truncate">CANADA-EUROPE CONNECTS: DEFENSE & DUAL-USE TECH</span>
        </div>
        <a 
          href="#" 
          className="whitespace-nowrap bg-[#0D0D0D] text-[#D4AF37] px-6 py-2 rounded hover:bg-[#1a1a1a] transition-colors font-mono text-xs font-bold"
        >
          REGISTER
        </a>
      </div>
    </div>
  )
}
