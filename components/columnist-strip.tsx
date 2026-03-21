'use client'

import Image from 'next/image'

const columnists = [
  { name: 'Miro Cernetig', role: 'Editor & Publisher', image: '/editor-portrait.jpg' },
  { name: 'Guest Columnist', role: 'Defence & Trade', image: '/guest-portrait.jpg' },
  { name: 'Contributing Editor', role: 'Space Economy', image: '/editor-portrait.jpg' },
]

export function ColumnistStrip() {
  return (
    <div className="border-b border-black bg-[#F9F9F7] py-3 px-6 md:px-12">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6 overflow-x-auto">
          {columnists.map((c, i) => (
            <div key={i} className="flex items-center gap-3 shrink-0">
              <div className="w-8 h-8 relative overflow-hidden rounded-full bg-gray-200">
                <Image src={c.image} alt={c.name} fill className="object-cover grayscale" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-[0.15em] uppercase block leading-tight">{c.name}</span>
                <span className="text-[9px] font-mono tracking-[0.1em] uppercase text-black/40">{c.role}</span>
              </div>
            </div>
          ))}
        </div>
        <span className="hidden md:block text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-black/30">
          Today&apos;s Contributors
        </span>
      </div>
    </div>
  )
}
