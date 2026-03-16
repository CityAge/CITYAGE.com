'use client'

export function SignalResponse() {
  return (
    <section className="bg-[#0D0D0D] py-16 md:py-24 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
          {/* Left Block: The Signal (60%) */}
          <div className="lg:col-span-2 bg-[#1a1a1a] border border-[#D4AF37]/20 p-8 md:p-12">
            <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-8 uppercase tracking-wide">
              Urban Planet Brain: Live Signals
            </h2>
            
            <div className="space-y-4 font-mono text-xs md:text-sm leading-relaxed text-[#888888]">
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-[#D4AF37]/10">
                <span className="text-[#D4AF37]">[09:47 UTC]</span>
                <span className="flex-1">CAD-EU bilateral trade volume surge +12.4% YoY. Specialty metals & defense contracts</span>
                <span className="text-[#D4AF37]">▲</span>
              </div>
              
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-[#D4AF37]/10">
                <span className="text-[#D4AF37]">[09:23 UTC]</span>
                <span className="flex-1">Orbital density index: 847 active assets. Low-earth orbit congestion nominal.</span>
                <span className="text-[#D4AF37]">●</span>
              </div>
              
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-[#D4AF37]/10">
                <span className="text-[#D4AF37]">[08:54 UTC]</span>
                <span className="flex-1">Vancouver tech hub: 247 emerging companies in dual-use sector. Capital inflow: $3.2B</span>
                <span className="text-[#D4AF37]">▲</span>
              </div>
              
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-[#D4AF37]/10">
                <span className="text-[#D4AF37]">[07:41 UTC]</span>
                <span className="flex-1">LATAM urban intelligence: Mexico City planning authority signals tech-forward infrastructure mandate</span>
                <span className="text-[#D4AF37]">★</span>
              </div>
              
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#D4AF37]">[07:12 UTC]</span>
                <span className="flex-1">EuroTech corridor: Berlin-Amsterdam-Rotterdam logistics efficiency +8.7%. Supply chain normalization.</span>
                <span className="text-[#D4AF37]">◆</span>
              </div>
            </div>

            <div className="mt-8 text-[10px] text-[#D4AF37]/60 font-mono uppercase tracking-wider">
              LIVE FEED — UPDATING EVERY 60 SECONDS
            </div>
          </div>

          {/* Right Block: The Response (40%) */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="bg-[#FDFCF8] text-[#0D0D0D] p-8 md:p-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xs md:text-sm font-mono uppercase tracking-widest text-[#D4AF37] font-semibold mb-6">
                  The Human Response
                </h3>
                <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 leading-tight">
                  Canada-Europe Connects
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-[#0D0D0D]/80">
                  May 26. Ottawa. Where institutional intelligence meets human judgment. Defense, dual-use technology, and the future of the North Atlantic economic corridor.
                </p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#D4AF37]/30">
                <p className="text-xs font-mono uppercase tracking-widest text-[#888888] mb-3">
                  For Institutional Members
                </p>
                <a 
                  href="#" 
                  className="inline-block bg-[#0D0D0D] text-[#FDFCF8] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1a1a1a] transition-colors"
                >
                  Full Brief →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
