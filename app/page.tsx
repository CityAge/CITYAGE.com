import { MagazineHeader } from '@/components/magazine-header'
import { ArticleCard } from '@/components/article-card'
import { MagazineFooter } from '@/components/magazine-footer'
import { HeroGrid } from '@/components/hero-grid'
import { SpeakersReel } from '@/components/speakers-reel'
import { InfluenceLetterForm } from '@/components/influence-letter-form'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function Home() {
  const nextWestLead = {
    id: 'next-west',
    title: 'The Next West',
    vertical: 'Cities',
    tagline: 'The next room in the west.',
    excerpt: 'The A.I. Edition — where this region can actually win.',
    date: 'Nov 2026',
    image: '/vancouver-banner.jpg',
    readTime: 'The room',
    href: '/',
  }

  // SAMPLE_COPY — dummy plates to fill the first-issue well. Urban planet, not geopolitics.
  const samplePlates = [
    {
      id: 'sample-shade',
      title: 'Shade Is Infrastructure',
      vertical: 'Frontiers',
      tagline: 'The next street tree is a civic decision.',
      excerpt: null,
      date: 'The street',
      readTime: 'The street',
      href: '/',
    },
    {
      id: 'sample-ground-floor',
      title: 'Who Owns the Ground Floor',
      vertical: 'Money',
      tagline: 'The shop, the lobby, and the rent that decide a street.',
      excerpt: null,
      date: 'The lobby',
      readTime: 'The lobby',
      href: '/',
    },
    {
      id: 'sample-after-dark',
      title: 'The City After Dark',
      vertical: 'Culture',
      tagline: 'Night streets still write the first draft of a place.',
      excerpt: null,
      date: 'The night',
      readTime: 'The night',
      href: '/',
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <SpeakersReel />

      <main className="flex-grow max-w-[1400px] mx-auto w-full bg-[#F9F9F7]">
        <span id="power" className="paper-anchor" />
        <span id="money" className="paper-anchor" />
        <span id="cities" className="paper-anchor" />
        <span id="frontiers" className="paper-anchor" />
        <span id="culture" className="paper-anchor" />

        <HeroGrid
          leadColumn={
            <ArticleCard
              id={nextWestLead.id}
              title={nextWestLead.title}
              vertical={nextWestLead.vertical}
              tagline={nextWestLead.tagline}
              excerpt={nextWestLead.excerpt}
              date={nextWestLead.date}
              isLead={true}
              image={nextWestLead.image}
              readTime={nextWestLead.readTime}
              variant="hero-lead"
              href={nextWestLead.href}
            />
          }
          middleColumn={
            <div className="flex flex-col">
              {samplePlates.slice(0, 2).map((plate, i) => (
                <div key={plate.id} className={i > 0 ? 'border-t border-black/10 pt-10 mt-10' : ''}>
                  <ArticleCard
                    id={plate.id}
                    title={plate.title}
                    vertical={plate.vertical}
                    tagline={plate.tagline}
                    excerpt={plate.excerpt}
                    date={plate.date}
                    readTime={plate.readTime}
                    variant="hero-secondary"
                    href={plate.href}
                  />
                </div>
              ))}
            </div>
          }
          sidebarColumn={
            <div className="pt-0">
              <ArticleCard
                id={samplePlates[2].id}
                title={samplePlates[2].title}
                vertical={samplePlates[2].vertical}
                tagline={samplePlates[2].tagline}
                excerpt={samplePlates[2].excerpt}
                date={samplePlates[2].date}
                readTime={samplePlates[2].readTime}
                variant="hero-tertiary"
                href={samplePlates[2].href}
              />
            </div>
          }
        />

        <section id="subscribe" className="border-b border-black/10 px-6 md:px-10 py-10">
          <div className="max-w-[420px]">
            <h3 className="font-serif font-black text-lg uppercase tracking-tight mb-2">
              The Influence Letter
            </h3>
            <p className="font-serif text-black/50 text-[14px] leading-relaxed mb-5">
              Intelligence on infrastructure, defence, space, energy, and food systems.
            </p>
            <InfluenceLetterForm />
          </div>
        </section>
      </main>

      <MagazineFooter />
    </div>
  )
}
