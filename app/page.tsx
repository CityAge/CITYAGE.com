import Image from 'next/image'
import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'
import { DoorSpeakersLazy } from '@/components/door-speakers-lazy'
import { ArticleCard } from '@/components/article-card'
import { HeroGrid } from '@/components/hero-grid'

export const revalidate = 60

const MILLER_HREF = '/frontiers/the-inflection-point-was-real'

const WELL_PHOTOS = [
  { src: '/magazine-images/aerial.jpg', alt: '' },
  { src: '/magazine-images/photojournalism.jpg', alt: '' },
  { src: '/vancouver-bluesky.jpg', alt: '' },
  { src: '/magazine-images/cinematic.jpg', alt: '' },
] as const

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <CampaignBanner />

      <MagazineHeader />

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
              variant="hero-lead"
              href={MILLER_HREF}
            />
          }
          sidebarColumn={
            <div className="flex flex-col gap-5">
              {WELL_PHOTOS.map((photo) => (
                <div
                  key={photo.src}
                  className="ca-photo ca-photo-well w-full relative overflow-hidden bg-gray-100 aspect-[4/3]"
                  style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4 / 3' }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 1023px) 92vw, 42vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          }
        />
      </main>

      <div style={{ minHeight: 136, background: '#120f0b' }}>
        <DoorSpeakersLazy />
      </div>
      <MagazineFooter />
    </div>
  )
}
