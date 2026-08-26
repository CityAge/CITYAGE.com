import { MagazineHeader } from '@/components/magazine-header'
import { ArticleCard } from '@/components/article-card'
import { MagazineFooter } from '@/components/magazine-footer'
import { HeroGrid } from '@/components/hero-grid'
import { SpeakersReel } from '@/components/speakers-reel'
import { InfluenceLetterForm } from '@/components/influence-letter-form'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function Home() {
  // First issue: one lead on the plate. Do not fill dummy geopolitics to look busy.
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
          sidebarColumn={
            <div id="subscribe" className="bg-black text-white p-8 flex flex-col">
              <span id="letter" className="sr-only">The Influence Letter</span>
              <h3 className="font-serif font-black text-lg uppercase tracking-tight mb-1">
                The Influence Letter
              </h3>
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C5A059] mb-6">
                Daily Intelligence Brief
              </span>

              <p className="font-serif text-white/50 text-[13px] leading-relaxed mb-6">
                Intelligence on infrastructure, defence, space, energy, and food systems. Delivered before markets open.
              </p>

              <InfluenceLetterForm />
            </div>
          }
        />
      </main>

      <MagazineFooter />
    </div>
  )
}
