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
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-10 md:py-14">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-10">
          <h3 className="font-serif font-black text-2xl md:text-3xl text-black uppercase tracking-tight">
            Voices from The Urban Planet
          </h3>
          <a href="/voices" className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/50 hover:text-black transition-colors hidden sm:block">
            See all →
          </a>
        </div>

        {/* Carousel: exactly 4 visible at a time on desktop */}
        <div className="relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {voices.map((voice, i) => (
              <a
                key={voice.id}
                href={`/voices/${voice.id}`}
                className={`flex-shrink-0 snap-start group text-center w-[75vw] sm:w-[45vw] lg:w-[calc(25%-18px)] px-6 ${i > 0 ? 'border-l border-black/15' : ''}`}
              >
                {/* Circle portrait — large */}
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden mx-auto mb-4 border-3 border-black/10 group-hover:border-black transition-colors">
                  {voice.photo_url ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={voice.photo_url}
                      alt={voice.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-black/10 flex items-center justify-center">
                      <svg className="w-10 h-10 text-black/20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Name */}
                <p className="font-serif font-bold text-[17px] text-black leading-tight">
                  {voice.name}
                </p>
                {/* Title */}
                <p className="font-mono text-[10px] tracking-[0.12em] uppercase text-black/50 mt-1">
                  {voice.title}
                </p>

                {/* Headline — the reason to click */}
                {voice.headline && (
                  <p className="font-serif text-[14px] text-black/65 leading-snug mt-4 group-hover:text-black transition-colors line-clamp-3">
                    {voice.headline}
                  </p>
                )}
              </a>
            ))}
          </div>

          {/* Scroll arrow — positioned right edge */}
          {voices.length > 4 && (
            <div className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10">
              <div className="w-12 h-12 rounded-full border-2 border-black/20 bg-[#F2D024] flex items-center justify-center hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
