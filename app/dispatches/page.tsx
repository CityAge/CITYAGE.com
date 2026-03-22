import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'

export const revalidate = 60

export default async function DispatchesPage() {
  const supabase = await createClient()

  const { data: briefs } = await supabase
    .from('briefs')
    .select('id, title, vertical, published_at, body')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(30)

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <CampaignBanner />
      <MagazineHeader />

      <main className="flex-grow max-w-[900px] mx-auto w-full px-6 md:px-12 py-12">
        {/* Page header */}
        <div className="border-b border-black pb-8 mb-10">
          <Link href="/" className="font-mono text-[10px] tracking-[0.3em] text-[#C5A059] uppercase hover:text-black transition-colors">
            ← CityAge Home
          </Link>
          <h1 className="font-serif font-black text-4xl md:text-5xl mt-6 tracking-tight">
            Dispatches
          </h1>
          <p className="font-serif italic text-black/50 text-lg mt-3">
            Intelligence briefs from the Urban Planet.
          </p>
        </div>

        {/* Brief list */}
        {briefs && briefs.length > 0 ? (
          <div>
            {briefs.map((brief) => {
              const date = new Date(brief.published_at).toLocaleDateString('en-CA', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                timeZone: 'America/Toronto'
              })
              const tagline = brief.body
                ?.split('\n')
                .find((line: string) => line.startsWith('*') && line.endsWith('*'))
                ?.replace(/\*/g, '')
                ?.trim()

              return (
                <Link
                  key={brief.id}
                  href={`/dispatches/${brief.id}`}
                  className="block py-8 border-b border-black/10 hover:border-black/30 transition-colors group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <span className="font-mono text-[10px] font-bold tracking-[0.3em] text-[#C5A059] uppercase">
                      {brief.vertical}
                    </span>
                    <span className="w-6 h-px bg-black/20" />
                    <span className="font-mono text-[10px] tracking-[0.2em] text-black/40 uppercase">
                      {date}
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-xl md:text-2xl text-black group-hover:text-[#1A365D] transition-colors leading-tight mb-2">
                    {brief.title}
                  </h2>
                  {tagline && (
                    <p className="font-serif italic text-black/40 text-base">
                      {tagline}
                    </p>
                  )}
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="font-serif italic text-black/30 text-lg">
            No published dispatches yet.
          </p>
        )}
      </main>

      <MagazineFooter />
    </div>
  )
}
