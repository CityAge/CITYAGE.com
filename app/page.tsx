import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'
import { ArticleCard } from '@/components/article-card'
import { MagazineFooter } from '@/components/magazine-footer'
import { UrbanPlanetVoices } from '@/components/urban-planet-voices'
import { HeroGrid } from '@/components/hero-grid'

export const revalidate = 60
export const dynamic = 'force-dynamic'

// Door stories are real rooms already in the repo — not invented breaking news.
const DOOR_LEAD = {
  id: 'northern-century',
  href: '/northern-century',
  title: 'The Northern Century',
  vertical: 'Frontiers',
  tagline: 'Ideas and investments in the new geography of power.',
  excerpt: 'The Arctic is not the edge of the map. It is the next frontier — where capital, sovereignty, and infrastructure converge.',
  date: 'The Room',
  image: '/northern-century-tile.jpg',
  readTime: 'Read the manifesto',
}

const DOOR_SECONDARY = [
  {
    id: 'next-vancouver',
    href: '/next-vancouver',
    title: 'The Next Metro Vancouver: The A.I. Edition',
    vertical: 'Cities',
    tagline: 'Where can this region actually win?',
    excerpt: 'Metro Vancouver has an AI advantage — but only in the sectors where this region already leads the world.',
    date: 'Coming this fall',
    image: '/vancouver-banner.jpg',
    readTime: 'The A.I. Edition',
  },
  {
    id: 'influence-letter',
    href: '/influence/canada-europe-connects',
    title: 'The Influence Letter — Canada–Europe Connects',
    vertical: 'Power',
    tagline: 'Defence procurement, dual-use technology, and trans-Atlantic trade corridors.',
    excerpt: 'Ottawa is the room where three converging forces are being decided by the people who will actually sign the papers.',
    date: 'May 26, 2026',
    image: '/parliament-sunset.jpg',
    readTime: 'The Letter',
  },
  {
    id: 'purpose',
    href: '/purpose',
    title: 'We live on the urban planet.',
    vertical: 'Cities',
    tagline: 'Two percent of Earth. Everything happens here.',
    excerpt: 'CityAge is the small rooms, drawn from 20,000 leaders. Come do the work.',
    date: 'The Thesis',
    image: '/earth-lights.jpg',
    readTime: 'Purpose',
  },
  {
    id: 'partners',
    href: '/partners',
    title: 'Knowledge Partners',
    vertical: 'Money',
    tagline: 'The organisations that have built the rooms with CityAge.',
    excerpt: 'Technology, finance, infrastructure, government, and design — in the room, not in the audience.',
    date: 'The Network',
    image: '/cityage-hero.png',
    readTime: 'Partners',
  },
]

const DOOR_TERTIARY = [
  {
    id: 'cec',
    href: '/canada-europe-connects',
    title: 'Canada–Europe Connects',
    vertical: 'Power',
    date: 'Ottawa',
    readTime: 'The Room',
  },
  {
    id: 'advisory',
    href: '/advisory.html',
    title: 'Private Advisory',
    vertical: 'Money',
    date: 'Vancouver',
    readTime: 'Enquire',
  },
  {
    id: 'contact',
    href: '/contact.html',
    title: 'Write to the room',
    vertical: 'Cities',
    date: 'Vancouver',
    readTime: 'Contact',
  },
]

export default async function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      {/* Campaign banner — full width event promotion */}
      <CampaignBanner />

      {/* Masthead (includes vertical nav) */}
      <MagazineHeader />

      {/* Locked public line */}
      <div className="border-b border-black/10 px-6 md:px-12 bg-[#F9F9F7]">
        <div className="max-w-[1400px] mx-auto py-5 md:py-6 text-center">
          <p className="font-serif text-[15px] md:text-[18px] text-black/75 leading-relaxed">
            We live on the urban planet. Two percent of Earth. Everything happens here.
          </p>
          <p className="font-serif italic text-[13px] md:text-[15px] text-black/50 mt-2">
            CityAge is the small rooms, drawn from 20,000 leaders. Come do the work.
          </p>
        </div>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-grow max-w-[1400px] mx-auto w-full bg-[#F9F9F7]">
        <HeroGrid
          leadColumn={
            <ArticleCard
              id={DOOR_LEAD.id}
              href={DOOR_LEAD.href}
              title={DOOR_LEAD.title}
              vertical={DOOR_LEAD.vertical}
              tagline={DOOR_LEAD.tagline}
              excerpt={DOOR_LEAD.excerpt}
              date={DOOR_LEAD.date}
              isLead={true}
              image={DOOR_LEAD.image}
              readTime={DOOR_LEAD.readTime}
              variant="hero-lead"
            />
          }
          middleColumn={
            <div className="flex flex-col">
              {DOOR_SECONDARY.map((article, i) => (
                <div key={article.id} className={`${i > 0 ? 'border-t border-black/10 pt-10 mt-10' : ''}`}>
                  <ArticleCard
                    id={article.id}
                    href={article.href}
                    title={article.title}
                    vertical={article.vertical}
                    tagline={article.tagline}
                    excerpt={article.excerpt}
                    date={article.date}
                    image={article.image}
                    readTime={article.readTime}
                    variant="hero-secondary"
                  />
                </div>
              ))}
            </div>
          }
          sidebarColumn={
            <>
              {/* Influence Letter — black box */}
              <div id="subscribe" className="bg-black text-white p-8 flex flex-col">
                <h3 className="font-serif font-black text-lg uppercase tracking-tight mb-1">
                  The Influence Letter
                </h3>
                <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C5A059] mb-6">
                  Daily Intelligence Brief
                </span>

                <p className="font-serif text-white/50 text-[13px] leading-relaxed mb-6">
                  Intelligence on infrastructure, defence, space, energy, and food systems. Delivered before markets open.
                </p>

                <div className="mb-6">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-white/10 border border-white/20 px-4 py-2.5 font-mono text-[11px] tracking-wider text-white placeholder-white/30 uppercase outline-none focus:border-[#C5A059] transition-colors mb-2"
                  />
                  <button className="w-full bg-[#C5A059] text-black py-2.5 font-mono text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white transition-colors">
                    Subscribe Free
                  </button>
                </div>

                <div className="border-t border-white/10 pt-6 mt-auto">
                  <span className="font-mono text-[8px] tracking-[0.3em] uppercase text-white/25 block mb-4">
                    The Rooms
                  </span>
                  <div className="space-y-4">
                    <a href="/northern-century" className="block group">
                      <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#C5A059]">Frontiers · The North</span>
                      <span className="font-serif font-bold text-sm block mt-1 group-hover:text-[#C5A059] transition-colors">The Northern Century</span>
                    </a>
                    <a href="/next-vancouver" className="block group">
                      <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#C5A059]">Cities · Coming this fall</span>
                      <span className="font-serif font-bold text-sm block mt-1 group-hover:text-[#C5A059] transition-colors">The Next Vancouver</span>
                    </a>
                    <a href="/influence/canada-europe-connects" className="block group">
                      <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#C5A059]">The Letter · Ottawa</span>
                      <span className="font-serif font-bold text-sm block mt-1 group-hover:text-[#C5A059] transition-colors">Canada–Europe Connects</span>
                    </a>
                  </div>
                </div>
              </div>

              {DOOR_TERTIARY.length > 0 && (
                <div className="pt-8 space-y-6">
                  {DOOR_TERTIARY.map((article, i) => (
                    <div key={article.id} className={`${i > 0 ? 'border-t border-black/10 pt-6' : ''}`}>
                      <ArticleCard
                        id={article.id}
                        href={article.href}
                        title={article.title}
                        vertical={article.vertical}
                        tagline={null}
                        excerpt={null}
                        date={article.date}
                        readTime={article.readTime}
                        variant="hero-tertiary"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          }
        />

        {/* Voices strip stays in the magazine clothes; it renders nothing when empty. */}
        <UrbanPlanetVoices />
      </main>

      <MagazineFooter />
    </div>
  )
}
