import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export async function UrbanPlanetVoices() {
  const supabase = await createClient()

  const { data: voices } = await supabase
    .from('urban_planet_voices')
    .select('id, name, title, city, topic, linkedin_url, photo_url, content_type, headline, pull_quote, is_pinned')
    .eq('is_active', true)
    .order('is_pinned', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false })
    .limit(12)

  if (!voices || voices.length === 0) return null

  const badgeLabel = (type: string) => {
    switch (type) {
      case 'qa_interview': return 'Q&A'
      case 'linkedin_post': return 'LinkedIn Post'
      case 'essay': return 'Essay'
      case 'column': return 'Column'
      default: return 'Opinion'
    }
  }

  return (
    <section className="bg-[#2C2C2A]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h3 className="font-serif font-black text-xl md:text-2xl text-white uppercase tracking-tight">
              Voices from The Urban Planet
            </h3>
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C5A059] mt-1 block">
              Intelligence · Insight · Influence
            </span>
          </div>
          <a href="/voices" className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#C5A059] hover:text-white transition-colors hidden sm:block">
            See all →
          </a>
        </div>

        {/* Scrollable card strip */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {voices.map((voice) => (
            <div
              key={voice.id}
              className="bg-[#3d3d3a] rounded flex-shrink-0 w-[220px] md:w-[240px] snap-start group hover:bg-[#4a4a47] transition-colors"
            >
              {/* Card inner — link to voices page */}
              <div className="p-5 flex flex-col h-full">
                {/* Top: photo + name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full border-[2px] border-[#C5A059] p-[2px] flex-shrink-0">
                    {voice.photo_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={voice.photo_url}
                        alt={voice.name}
                        className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#555]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-[12px] text-white leading-tight truncate">
                      {voice.name}
                    </p>
                    <p className="font-mono text-[7px] tracking-[0.1em] uppercase text-white/50 mt-0.5 truncate">
                      {voice.title}
                    </p>
                    <p className="font-mono text-[7px] tracking-[0.1em] uppercase text-[#C5A059] truncate">
                      {voice.city} · {voice.topic}
                    </p>
                  </div>
                </div>

                {/* Pull quote */}
                {voice.pull_quote && (
                  <p className="font-serif text-[12px] text-white/75 leading-[1.6] italic mb-4 line-clamp-4">
                    &ldquo;{voice.pull_quote}&rdquo;
                  </p>
                )}

                {/* Bottom: Read more + badge */}
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="font-mono text-[8px] tracking-[0.15em] uppercase text-[#C5A059] hover:text-white transition-colors cursor-pointer">
                    Read more →
                  </span>
                  <span className="font-mono text-[7px] tracking-[0.15em] uppercase text-white/30">
                    {badgeLabel(voice.content_type)}
                  </span>
                </div>

                {/* LinkedIn link */}
                {voice.linkedin_url && (
                  <a
                    href={voice.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[7px] tracking-[0.1em] uppercase text-white/20 hover:text-[#C5A059] transition-colors mt-3 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          ))}

          {/* Scroll indicator */}
          <div className="flex-shrink-0 w-16 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border border-[#C5A059]/40 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#C5A059]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
