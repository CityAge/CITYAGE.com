'use client'

import Image from 'next/image'

export function CampaignBanner() {
  return (
    <a href="https://cityage.com/events/canada-europe-connect/" className="block relative w-full h-[280px] md:h-[360px] overflow-hidden group">
      <Image
        src="/ottawa-feature.jpg"
        alt="Canada–Europe Connects — Ottawa, May 26, 2026"
        fill
        className="object-cover brightness-[0.35] group-hover:brightness-[0.45] transition-all duration-700"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8">
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#C5A059] mb-4">
          Invitation Only · Ottawa · May 26, 2026
        </span>
        <h2 className="font-serif font-black text-3xl md:text-5xl lg:text-6xl text-center leading-[1.05] tracking-tight mb-4">
          Canada–Europe Connects
        </h2>
        <p className="font-serif italic text-white/70 text-base md:text-lg text-center max-w-xl mb-6">
          Defence procurement, dual-use technology, and trans-Atlantic trade corridors converge in the capital.
        </p>
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C5A059] border border-[#C5A059]/40 px-6 py-2 group-hover:bg-[#C5A059] group-hover:text-black transition-all">
          Request Access
        </span>
      </div>
    </a>
  )
}
