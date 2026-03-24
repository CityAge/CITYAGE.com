import { createClient } from '@/lib/supabase/server'

export async function UrbanPlanetVoices() {
  let voices: any[] = []

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = await createClient()
      const { data } = await supabase
        .from('urban_planet_voices')
        .select('id, name, title, city, topic, linkedin_url, photo_url, content_type, headline, pull_quote, is_pinned')
        .eq('is_active', true)
        .order('is_pinned', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('published_at', { ascending: false })
        .limit(12)
      voices = data || []
    }
  } catch (e) {
    console.error('Supabase error:', e)
  }

  if (voices.length === 0) return null

  return (
    <section className="bg-[#F2D024]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12 md:py-16">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-10">
          <div>
            <h3 className="font-serif font-black text-2xl md:text-3xl text-black uppercase tracking-tight">
              Voices from The Urban Planet
            </h3>
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-black/50 mt-2 block">
              Intelligence · Insight · Influence
            </span>
          </div>
          <a href="/voices" className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/50 hover:text-black transition-colors hidden sm:block">
            See all →
          </a>
        </div>

        {/* Scrollable card strip — large Monocle-scale cards */}
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {voices.map((voice) => (
            <div
              key={voice.id}
              className="bg-white flex-shrink-0 w-[260px] md:w-[280px] snap-start group hover:shadow-lg transition-all"
            >
              {/* Large photo — square, fills card width */}
              <div className="w-full aspect-square relative overflow-hidden bg-gray-100">
                {voice.photo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={voice.photo_url}
                    alt={voice.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Card content */}
              <div className="p-5">
                <p className="font-serif font-bold text-[17px] text-black leading-tight">
                  {voice.name}
                </p>
                <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-black/50 mt-1">
                  {voice.title}
                </p>
                {voice.city && (
                  <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-black/40 mt-0.5">
                    {voice.city}
                  </p>
                )}

                {/* Pull quote */}
                {voice.pull_quote && (
                  <p className="font-serif text-[14px] text-black/70 leading-[1.6] italic mt-4 line-clamp-3">
                    &ldquo;{voice.pull_quote}&rdquo;
                  </p>
                )}

                {/* Links */}
                <div className="flex items-center gap-4 mt-4 pt-3 border-t border-black/10">
                  <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-black/60 hover:text-black transition-colors cursor-pointer">
                    Read →
                  </span>
                  {voice.linkedin_url && (
                    <a
                      href={voice.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] tracking-[0.1em] uppercase text-black/30 hover:text-black transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Scroll arrow */}
          <div className="flex-shrink-0 w-16 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border-2 border-black/20 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
