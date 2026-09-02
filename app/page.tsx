import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { StageBand } from '@/components/stage-band'
import { ArticleCard } from '@/components/article-card'
import { HeroGrid } from '@/components/hero-grid'
import { StoryBox } from '@/components/story-box'
import { fetchWellStories, type SectionStory } from '@/lib/magazine'
import { fetchDoorSpeakerFaces, shuffle } from '@/lib/speakers'

export const revalidate = 60

const MILLER_HREF = '/frontiers/the-inflection-point-was-real'
/** ceil(words / 220) of the Miller page text; it is a static page, not a magazine row. */
const MILLER_READ_MIN = 1

/** One column of the well: stacked boxes with a rule between each. */
function WellColumn({ stories }: { stories: SectionStory[] }) {
  return (
    <div className="flex flex-col divide-y divide-[#D9D7D0]">
      {stories.map((story) => (
        <div key={story.id} className="py-7 first:pt-0 last:pb-0">
          <StoryBox story={story} />
        </div>
      ))}
    </div>
  )
}

export default async function Home() {
  const [stories, doorFaces] = await Promise.all([
    fetchWellStories(9),
    fetchDoorSpeakerFaces(),
  ])
  const readyDoor = shuffle(doorFaces).slice(0, 48)
  const doorMid = Math.ceil(readyDoor.length / 2)
  const doorTop = readyDoor.slice(0, doorMid)
  const doorBottom = readyDoor.slice(doorMid)
  // Nine beside the lead, alternating between the two side columns.
  const columnTwo = stories.filter((_, i) => i % 2 === 0)
  const columnThree = stories.filter((_, i) => i % 2 === 1)

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <CampaignBanner />

      <MagazineHeader hideRailOnPhone />

      <main className="flex-grow max-w-[1400px] mx-auto w-full bg-[#F9F9F7]">
        <span id="power" className="paper-anchor" />
        <span id="money" className="paper-anchor" />
        <span id="cities" className="paper-anchor" />
        <span id="frontiers" className="paper-anchor" />
        <span id="culture" className="paper-anchor" />

        <HeroGrid
          leadColumn={
            <ArticleCard
              id="miller"
              title="The inflection point was real"
              vertical="Frontiers"
              tagline="Charles Miller, who spoke at CityAge Orbit in Washington, on the commercialization of space."
              excerpt={null}
              date=""
              readTime={`${MILLER_READ_MIN} min read`}
              isLead
              image="/vancouver-bluesky.jpg"
              variant="hero-lead"
              href={MILLER_HREF}
            />
          }
          middleColumn={<WellColumn stories={columnTwo} />}
          sidebarColumn={<WellColumn stories={columnThree} />}
        />
      </main>

      <CampaignBanner
        image="/northern-century-earth.jpg"
        crop="object-top"
        heading="The Northern Century."
        italic="Washington and Ottawa. Alternating editions."
        href="/northern-century"
        priority={false}
      />

      <StageBand top={doorTop} bottom={doorBottom} />
      <MagazineFooter />
    </div>
  )
}
