import type { Metadata } from 'next'
import Link from 'next/link'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { supabaseEnv } from '@/lib/supabase/env'

export const metadata: Metadata = { title: 'Search — CityAge', robots: { index: false } }
export const dynamic = 'force-dynamic'

type Result = {
  id: string
  headline: string
  deck: string | null
  vertical: string
  published_at: string | null
  body: string | null
}

async function searchPublished(term: string): Promise<{ results: Result[]; error: boolean }> {
  const env = supabaseEnv()
  if (!env) return { results: [], error: true }
  try {
    // A bounded published-only read avoids interpreting user text as a PostgREST filter.
    const select = 'id,headline,deck,vertical,published_at,body'
    const response = await fetch(
      `${env.url}/rest/v1/magazine?select=${select}&status=eq.published&order=published_at.desc&limit=500`,
      { headers: { apikey: env.key, Authorization: `Bearer ${env.key}` }, cache: 'no-store' },
    )
    if (!response.ok) return { results: [], error: true }
    const rows = (await response.json()) as Result[]
    if (!Array.isArray(rows)) return { results: [], error: true }
    const needle = term.toLocaleLowerCase()
    return {
      results: rows.filter((row) => [row.headline, row.deck, row.body].some((value) => value?.toLocaleLowerCase().includes(needle))).slice(0, 40),
      error: false,
    }
  } catch {
    return { results: [], error: true }
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const term = typeof q === 'string' ? q.trim().slice(0, 120) : ''
  const { results, error } = term ? await searchPublished(term) : { results: [], error: false }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />
      <main className="flex-grow w-full max-w-[900px] mx-auto px-6 py-12 md:py-16">
        <h1 className="font-serif text-[40px] font-bold leading-tight mb-8">Search CityAge</h1>
        <form action="/search" method="get" role="search" className="flex gap-3 border-b-2 border-black pb-3">
          <label htmlFor="site-search" className="sr-only">Search stories</label>
          <input id="site-search" name="q" type="search" defaultValue={term} maxLength={120} autoFocus
            placeholder="Search stories" className="min-w-0 flex-1 bg-transparent text-[18px] outline-none" />
          <button type="submit" className="bg-black text-white px-5 py-2 text-[14px] font-bold hover:bg-[#C5A059] hover:text-black">Search</button>
        </form>
        {term && (
          <div className="mt-10" aria-live="polite">
            <h2 className="text-[16px] font-semibold mb-6">{error ? 'Search is unavailable right now.' : `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${term}”`}</h2>
            {!error && results.length === 0 && <p className="text-[16px]">Try another word or phrase.</p>}
            <ol className="divide-y divide-black/15">
              {results.map((story) => (
                <li key={story.id} className="py-6">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-black/60">{story.vertical}</span>
                  <h3 className="font-serif text-[24px] font-semibold leading-snug mt-1">
                    <Link href={`/magazine/${story.id}`} className="hover:underline">{story.headline}</Link>
                  </h3>
                  {story.deck && <p className="text-[16px] leading-relaxed mt-2">{story.deck}</p>}
                </li>
              ))}
            </ol>
          </div>
        )}
      </main>
      <MagazineFooter />
    </div>
  )
}
