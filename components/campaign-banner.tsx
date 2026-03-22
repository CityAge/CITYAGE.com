'use client'

import Image from 'next/image'

export function CampaignBanner() {
  return (
    <a href="https://cityage.com/events/canada-europe-connect/" className="block relative w-full h-[180px] md:h-[220px] overflow-hidden group">
      <Image
        src="/ottawa-feature.jpg"
        alt="Canada–Europe Connects — Ottawa, May 26, 2026"
        fill
        className="object-cover brightness-[0.3] group-hover:brightness-[0.4] transition-all duration-700"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center text-white px-8">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
          <div className="text-center md:text-left">
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#C5A059] mb-2 block">
              Invitation Only · Ottawa · May 26, 2026
            </span>
            <h2 className="font-serif font-black text-2xl md:text-4xl leading-[1.05] tracking-tight">
              Canada–Europe Connects
            </h2>
          </div>
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C5A059] border border-[#C5A059]/40 px-6 py-2 group-hover:bg-[#C5A059] group-hover:text-black transition-all shrink-0">
            Request Access
          </span>
        </div>
      </div>
    </a>
  )
}
