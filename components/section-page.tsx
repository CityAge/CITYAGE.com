import Link from 'next/link'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { fetchSectionStories, type SectionName } from '@/lib/magazine'

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Date(iso)
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase()
}

/** Section page: one vertical's published stories, newest first. Well typography. */
export async function SectionPage({ name }: { name: SectionName }) {
  const stories = await fetchSectionStories(name)

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow max-w-[1400px] mx-auto w-full px-6 md:px-12 py-10 md:py-14">
        <div className="border-b border-black pb-6 mb-2">
          <h1 className="font-serif font-black text-4xl md:text-5xl tracking-tight">{name}</h1>
        </div>

        {stories.length === 0 ? (
          <p className="font-serif text-black/60 text-[17px] md:text-[19px] leading-[1.65] pt-10">
            No published stories in {name} yet.
          </p>
        ) : (
          <div className="max-w-[800px]">
            {stories.map((story, i) => (
              <div key={story.id} className={i > 0 ? 'border-t border-black/10 pt-10 mt-10' : 'pt-10'}>
                <Link href={`/magazine/${story.id}`} className="block group">
                  {story.image_url ? (
                    <div
                      className="ca-photo ca-photo-well w-full relative overflow-hidden bg-gray-100 aspect-[4/3] mb-5"
                      style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4 / 3' }}
                    >
                      <img
                        src={story.image_url}
                        alt=""
                        className="object-cover lg:grayscale lg:group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : null}
                  <span className="font-mono text-[12px] font-bold tracking-[0.2em] uppercase text-[#C5A059]">
                    {story.vertical}
                  </span>
                  <h2 className="font-serif font-normal text-[20px] md:text-[22px] leading-[1.28] tracking-normal mt-2 group-hover:text-[#1A365D] transition-colors">
                    {story.headline}
                  </h2>
                  {story.deck ? (
                    <p className="font-serif text-black/60 text-[15px] md:text-[17px] leading-[1.6] mt-3">
                      {story.deck}
                    </p>
                  ) : null}
                  <div className="font-mono text-[9px] tracking-[0.22em] uppercase text-black/40 mt-4">
                    {formatDate(story.published_at)}
                    {story.published_at ? ' · ' : ''}
                    {story.read_time || 5} Min Read
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>

      <MagazineFooter />
    </div>
  )
}
