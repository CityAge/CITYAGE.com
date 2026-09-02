import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { StoryBox } from '@/components/story-box'
import { fetchSectionStories, type SectionName } from '@/lib/magazine'

/**
 * Section page: one vertical's published stories, newest first, in the
 * same box as the door well. Three columns with 1px rules between columns
 * and between rows; one column on phones, rule between every story.
 */
const CELL =
  'border-t border-[#D9D7D0] py-7 first:border-t-0 first:pt-0 ' +
  'md:[&:nth-child(-n+3)]:border-t-0 md:[&:nth-child(-n+3)]:pt-0 ' +
  'md:[&:not(:nth-child(3n+1))]:border-l md:[&:not(:nth-child(3n+1))]:pl-8 md:[&:not(:nth-child(3n))]:pr-8'

export async function SectionPage({ name }: { name: SectionName }) {
  const stories = await fetchSectionStories(name)

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow max-w-[1400px] mx-auto w-full px-6 md:px-12 py-10 md:py-14">
        <div className="border-b border-black pb-6 mb-10">
          <h1 className="type-title tracking-tight">{name}</h1>
        </div>

        {stories.length === 0 ? (
          <p className="type-body text-black/60">
            No published stories in {name} yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3">
            {stories.map((story) => (
              <div key={story.id} className={CELL}>
                <StoryBox story={story} />
              </div>
            ))}
          </div>
        )}
      </main>

      <MagazineFooter />
    </div>
  )
}
