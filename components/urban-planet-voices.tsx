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
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-12">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-8">
          <h3 className="font-serif font-black text-2xl md:text-3xl text-black uppercase tracking-tight">
            Voices from The Urban Planet
          </h3>
          <a href="/voices" className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/50 hover:text-black transition-colors hidden sm:block">
            See all →
          </a>
        </div>

        {/* Scrollable strip — circles with name, title, headline */}
        <div className="flex items-start overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {voices.map((voice, i) => (
            <a
              key={voice.id}
              href={`/voices/${voice.id}`}
              className={`flex-shrink-0 snap-start group text-center w-[160px] md:w-[180px] ${i > 0 ? 'border-l border-black/15 pl-6 ml-6' : ''}`}
            >
              {/* Circle portrait */}
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto mb-3 border-2 border-black/10 group-hover:border-black transition-colors">
                {voice.photo_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={voice.photo_url}
                    alt={voice.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-black/10 flex items-center justify-center">
                    <svg className="w-8 h-8 text-black/20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Name + title */}
              <p className="font-serif font-bold text-[15px] text-black leading-tight">
                {voice.name}
              </p>
              <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-black/50 mt-1">
                {voice.title}
              </p>

              {/* Headline of their piece — the draw */}
              {voice.headline && (
                <p className="font-serif text-[13px] text-black/70 leading-snug mt-3 group-hover:text-black transition-colors">
                  {voice.headline}
                </p>
              )}
            </a>
          ))}

          {/* Scroll arrow */}
          <div className="flex-shrink-0 w-14 flex items-center justify-center ml-6">
            <div className="w-10 h-10 rounded-full border-2 border-black/20 flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
