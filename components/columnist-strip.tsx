'use client'

import Image from 'next/image'

const columnists = [
  { name: 'Miro Cernetig', role: 'Editor & Publisher', image: '/editor-portrait.jpg' },
  { name: 'Guest Columnist', role: 'Defence & Trade', image: '/guest-portrait.jpg' },
  { name: 'Contributing Editor', role: 'Space Economy', image: '/editor-portrait.jpg' },
]

export function ColumnistStrip() {
  return (
    <div className="border-b border-black/10 bg-[#F9F9F7] py-4 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 overflow-x-auto">
          <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-black/25 shrink-0 hidden md:block">
            Contributors
          </span>
          <span className="text-black/10 text-[8px] hidden md:block">|</span>
          {columnists.map((c, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0 cursor-pointer group">
              <div className="w-8 h-8 relative overflow-hidden rounded-full bg-gray-200">
                <Image src={c.image} alt={c.name} fill className="object-cover group-hover:grayscale-0 transition-all" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.1em] uppercase block leading-tight group-hover:text-[#C5A059] transition-colors">{c.name}</span>
                <span className="text-[8px] font-mono tracking-[0.1em] uppercase text-black/30">{c.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
