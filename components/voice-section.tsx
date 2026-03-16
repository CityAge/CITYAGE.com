'use client'

import Image from 'next/image'

export function VoiceSection() {
  const cards = [
    {
      id: 'editor',
      label: "Editor's Dispatch",
      name: 'The Editor',
      image: '/editor-portrait.jpg',
      quote: 'The 3% isn\'t just a stat; it\'s a strategic mandate.',
      context: 'On the convergence of capital, infrastructure, and influence in the urban century.'
    },
    {
      id: 'guest',
      label: 'Guest Contributor',
      name: 'Ambassador of Trade',
      image: '/guest-portrait.jpg',
      quote: 'Ottawa represents the intersection of North American strategy and transatlantic ambition.',
      context: 'Reflecting on the Defence, Dual-Use, and Trade implications of the May 26 Summit.'
    },
    {
      id: 'archive',
      label: 'Voice from the Archive',
      name: 'CityAge Speaker',
      image: '/editor-portrait.jpg',
      quote: 'Global wealth is concentrated, but opportunity is distributed across emerging urban nodes.',
      context: 'From a past CityAge discourse, still resonant with today\'s geopolitical landscape.'
    }
  ]

  return (
    <section className="bg-[#FBFBFB] py-20 px-8 md:px-16 border-t border-[#333333]/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#050505] mb-6 leading-tight">
            Voices From The Urban Planet
          </h2>
          <div className="w-24 h-px bg-[#333333]/40"></div>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className={`px-6 py-8 flex flex-col ${
                idx < cards.length - 1 ? 'md:border-r border-[#333333]/20' : ''
              }`}
            >
              {/* Portrait */}
              <div className="mb-6 aspect-square relative overflow-hidden bg-[#E8E8E8]">
                <Image
                  src={card.image}
                  alt={card.name}
                  fill
                  className="object-cover grayscale"
                />
              </div>

              {/* Label */}
              <p className="font-mono text-xs tracking-widest uppercase text-[#888888] mb-4">
                {card.label}
              </p>

              {/* Quote */}
              <p className="text-lg md:text-xl font-serif italic text-[#050505] mb-4 leading-snug">
                "{card.quote}"
              </p>

              {/* Context */}
              <p className="text-sm text-[#666666] mb-8 leading-relaxed flex-grow">
                {card.context}
              </p>

              {/* Postmark CTA */}
              <a
                href="#"
                className="inline-block px-4 py-2 border border-[#333333]/60 border-dashed font-mono text-[10px] tracking-[0.2em] uppercase text-[#333333] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                style={{
                  transform: 'rotate(-2deg)',
                  borderRadius: '2px',
                }}
              >
                Read the Full Perspective
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
