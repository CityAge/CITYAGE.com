import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 60 // refresh every 60 seconds

export default async function DispatchesPage() {
  const supabase = await createClient()

  const { data: briefs } = await supabase
    .from('briefs')
    .select('id, title, vertical, published_at, body')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="px-8 md:px-16 py-12 border-b border-[#D4AF37]/20">
        <Link href="/" className="font-mono text-[10px] tracking-[0.35em] text-[#D4AF37] uppercase hover:text-[#D4AF37]/80">
          ← CityAge Home
        </Link>
        <h1 className="font-serif font-black text-4xl md:text-5xl mt-6 tracking-tight">
          Dispatches
        </h1>
        <p className="font-serif text-[#FDFCF8]/50 text-lg mt-3">
          Intelligence briefs from the urban planet brain.
        </p>
      </div>

      {/* Brief list */}
      <div className="px-8 md:px-16 py-10">
        {briefs && briefs.length > 0 ? (
          <div className="space-y-0">
            {briefs.map((brief) => {
              const date = new Date(brief.published_at).toLocaleDateString('en-CA', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'America/Toronto'
              })

              // Extract tagline from body (the italic line after the dateline)
              const tagline = brief.body
                ?.split('\n')
                .find((line: string) => line.startsWith('*') && line.endsWith('*'))
                ?.replace(/\*/g, '')
                ?.trim()

              return (
                <Link
                  key={brief.id}
                  href={`/dispatches/${brief.id}`}
                  className="block py-8 border-b border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase">
                      {brief.vertical}
                    </span>
                    <span className="w-6 h-px bg-[#D4AF37]/30" />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase">
                      {date}
                    </span>
                  </div>

                  <h2 className="font-serif font-bold text-xl md:text-2xl text-white group-hover:text-[#D4AF37] transition-colors leading-tight mb-2">
                    {brief.title}
                  </h2>

                  {tagline && (
                    <p className="font-serif text-[#FDFCF8]/40 text-base italic">
                      {tagline}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="font-serif text-[#FDFCF8]/40 text-lg">
            No published dispatches yet.
          </p>
        )}
      </div>
    </main>
  )
}
