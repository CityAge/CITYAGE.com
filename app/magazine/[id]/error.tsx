'use client'

import Link from 'next/link'

/**
 * Shown when the database could not answer for a story (a network blip), so a real story
 * never turns into "page not found". The site header and footer are server components,
 * so this page keeps to a plain frame with a way back.
 */
export default function StoryError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <header className="border-b border-black/10">
        <div className="max-w-[1400px] mx-auto px-6 py-6 text-center">
          <Link href="/" aria-label="CityAge home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-ca-black.png" alt="CityAge" className="h-10 w-auto mx-auto" />
          </Link>
        </div>
      </header>
      <main className="flex-grow max-w-[640px] mx-auto px-6 py-20 text-center">
        <h1 className="type-lead-h text-black mb-5">This story is temporarily unavailable.</h1>
        <p className="type-deck text-black/60 mb-10">Please try again in a moment.</p>
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-black text-white px-8 py-3 text-[11px] font-black tracking-[0.15em] uppercase hover:bg-[#C5A059] hover:text-black transition-colors"
          >
            Try again
          </button>
          <Link href="/" className="type-meta text-black underline underline-offset-4">
            Go to the homepage
          </Link>
        </div>
      </main>
    </div>
  )
}
