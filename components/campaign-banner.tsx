'use client'

import Image from 'next/image'

export function CampaignBanner() {
  return (
    <div className="bg-[#F9F9F7] pt-5 pb-0">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <a href="/canada-europe-connects" className="block relative w-full h-[220px] md:h-[340px] overflow-hidden group">
          <Image
            src="/ottawa-feature.jpg"
            alt="Canada–Europe Connects — Ottawa, May 26, 2026"
            fill
            className="object-cover brightness-[0.45] group-hover:brightness-[0.55] transition-all duration-700"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8">
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-[#C5A059] mb-3">
              Invitation Only · Ottawa · May 26, 2026
            </span>
            <h2 className="font-serif font-black text-2xl md:text-5xl text-center leading-[1.05] tracking-tight mb-3">
              Canada–Europe Connects
            </h2>
            <p className="font-serif italic text-white/60 text-sm md:text-base text-center max-w-lg mb-4 hidden md:block">
              Defence procurement, dual-use technology, and trans-Atlantic trade corridors.
            </p>
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C5A059] border border-[#C5A059]/40 px-6 py-2 group-hover:bg-[#C5A059] group-hover:text-black transition-all">
              Discover More
            </span>
          </div>
        </a>
      </div>
    </div>
  )
}
