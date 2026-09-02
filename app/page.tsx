import Image from 'next/image'
import Link from 'next/link'
import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { DoorSpeakersStrip } from '@/components/door-speakers-strip'
import { ArticleCard } from '@/components/article-card'
import { HeroGrid } from '@/components/hero-grid'
import { fetchDoorSpeakerFaces, shuffle } from '@/lib/speakers'
import { supabaseEnv } from '@/lib/supabase/env'

export const revalidate = 60

const MILLER_HREF = '/frontiers/the-inflection-point-was-real'

/** f9v02snor well plates — house photographs, not dummy heds. */
const WELL_PLATES = [
  { src: '/magazine-images/aerial.png', vertical: 'Cities' },
  { src: '/magazine-images/photojournalism.png', vertical: 'Power' },
  { src: '/magazine-images/cinematic.png', vertical: 'Frontiers' },
  { src: '/vancouver-banner.jpg', vertical: 'Culture' },
] as const

type WellStory = {
  id: string
  headline: string
  vertical: string
}

async function fetchWellStories(): Promise<WellStory[]> {
  const env = supabaseEnv()
  if (!env) return []
  const { url, key } = env

  try {
    const res = await fetch(
      `${url}/rest/v1/magazine?select=id,headline,vertical,featured,published_at&status=eq.published&order=featured.desc,published_at.desc&limit=16`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
        next: { revalidate: 60 },
      },
    )
    if (!res.ok) return []
    const rows = (await res.json()) as Array<{
      id: string
      headline: string
      vertical: string
    }>
    if (!Array.isArray(rows)) return []
    return rows
      .filter((row) => row.id && row.headline && row.vertical)
      .map((row) => ({
        id: row.id,
        headline: row.headline,
        vertical: row.vertical,
      }))
  } catch {
    return []
  }
}

function WellPhotoTile({
  src,
  vertical,
  title,
  href,
}: {
  src: string
  vertical: string
  title?: string
  href?: string
}) {
  const body = (
    <>
      <div
        className="ca-photo ca-photo-well w-full relative overflow-hidden bg-gray-100 aspect-[4/3] mb-5"
        style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4 / 3' }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 1023px) 92vw, 25vw"
          className="object-cover lg:grayscale lg:group-hover:grayscale-0 lg:hover:grayscale-0 hover:scale-[1.02] group-hover:scale-[1.02] transition-all duration-700"
        />
      </div>
      <span className="type-kicker">
        {vertical}
      </span>
      {title ? (
        <h3 className="type-rail-h tracking-normal mt-2 group-hover:text-[#1A365D] transition-colors">
          {title}
        </h3>
      ) : null}
    </>
  )

  if (href) {
    return (
      <Link href={href} className="block group">
        {body}
      </Link>
    )
  }

  return <div className="block">{body}</div>
}

export default async function Home() {
  const [stories, doorFaces] = await Promise.all([
    fetchWellStories(),
    fetchDoorSpeakerFaces(),
  ])
  const readyDoor = shuffle(doorFaces).slice(0, 48)
  const doorMid = Math.ceil(readyDoor.length / 2)
  const doorTop = readyDoor.slice(0, doorMid)
  const doorBottom = readyDoor.slice(doorMid)
  const used = new Set<string>()
  const photoTiles = WELL_PLATES.map((plate) => {
    const story = stories.find((s) => s.vertical === plate.vertical && !used.has(s.id))
    if (story) used.add(story.id)
    return {
      src: plate.src,
      vertical: plate.vertical,
      title: story?.headline,
      href: story ? `/magazine/${story.id}` : undefined,
    }
  })
  const sidebarStories = stories.filter((s) => !used.has(s.id)).slice(0, 3)

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
              isLead
              image="/vancouver-bluesky.jpg"
              variant="hero-lead"
              href={MILLER_HREF}
            />
          }
          middleColumn={
            <div className="flex flex-col">
              {photoTiles.map((tile, i) => (
                <div
                  key={tile.src}
                  className={i > 0 ? 'border-t border-black/10 pt-10 mt-10 max-lg:pt-4 max-lg:mt-4' : ''}
                >
                  <WellPhotoTile
                    src={tile.src}
                    vertical={tile.vertical}
                    title={tile.title}
                    href={tile.href}
                  />
                </div>
              ))}
            </div>
          }
          sidebarColumn={
            <div className="pt-0 space-y-6">
              {sidebarStories.map((story, i) => (
                <div
                  key={story.id}
                  className={i > 0 ? 'border-t border-black/10 pt-6' : ''}
                >
                  <ArticleCard
                    id={story.id}
                    title={story.headline}
                    vertical={story.vertical}
                    tagline={null}
                    excerpt={null}
                    date=""
                    variant="hero-tertiary"
                    href={`/magazine/${story.id}`}
                  />
                </div>
              ))}
            </div>
          }
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

      <div style={{ minHeight: 136, background: '#120f0b' }}>
        <DoorSpeakersStrip top={doorTop} bottom={doorBottom} />
      </div>
      <MagazineFooter />
    </div>
  )
}
