import dynamic from 'next/dynamic'
import { CampaignBanner } from '@/components/campaign-banner'
import { MagazineHeader } from '@/components/magazine-header'
import { ArticleCard } from '@/components/article-card'
import { MagazineFooter } from '@/components/magazine-footer'
import { HeroGrid } from '@/components/hero-grid'

const DoorSpeakersStrip = dynamic(
  () => import('@/components/door-speakers-strip').then((m) => m.DoorSpeakersStrip),
  { ssr: false, loading: () => null },
)

export const revalidate = 60

const MAGAZINE_STORY = '/magazine/41365717-a9f4-4d51-b3ff-6b7ed72b938d'

const LOREM = {
  lead: {
    id: 'lorem-lead',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    vertical: 'Money',
    tagline: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    excerpt: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    date: 'Lorem',
    readTime: '4 min read',
    image: '/vancouver-bluesky.jpg',
  },
  secondary: [
    {
      id: 'lorem-secondary-1',
      title: 'Ut enim ad minim veniam quis nostrud',
      vertical: 'Cities',
      tagline: null,
      excerpt: null,
      date: 'Ipsum',
      readTime: '3 min read',
      image: '/magazine-images/aerial.png',
    },
    {
      id: 'lorem-secondary-2',
      title: 'Duis aute irure dolor in reprehenderit',
      vertical: 'Power',
      tagline: null,
      excerpt: null,
      date: 'Dolor',
      readTime: '5 min read',
      image: '/magazine-images/photojournalism.png',
    },
    {
      id: 'lorem-secondary-3',
      title: 'Excepteur sint occaecat cupidatat non proident',
      vertical: 'Frontiers',
      tagline: null,
      excerpt: null,
      date: 'Sit',
      readTime: '4 min read',
      image: '/magazine-images/cinematic.png',
    },
    {
      id: 'lorem-secondary-4',
      title: 'Sunt in culpa qui officia deserunt mollit',
      vertical: 'Culture',
      tagline: null,
      excerpt: null,
      date: 'Amet',
      readTime: '6 min read',
      image: '/harbour-air-thumb.jpg',
    },
  ],
  tertiary: [
    {
      id: 'lorem-tertiary-1',
      title: 'Nemo enim ipsam voluptatem quia voluptas',
      vertical: 'Power',
      tagline: null,
      excerpt: null,
      date: 'Consectetur',
      readTime: '2 min read',
    },
    {
      id: 'lorem-tertiary-2',
      title: 'Neque porro quisquam est qui dolorem',
      vertical: 'Money',
      tagline: null,
      excerpt: null,
      date: 'Adipiscing',
      readTime: '3 min read',
    },
    {
      id: 'lorem-tertiary-3',
      title: 'Temporibus autem quibusdam et aut officiis',
      vertical: 'Cities',
      tagline: null,
      excerpt: null,
      date: 'Elit',
      readTime: '4 min read',
    },
  ],
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <CampaignBanner />

      <MagazineHeader />

      <main className="flex-grow max-w-[1400px] mx-auto w-full bg-[#F9F9F7]">
        <HeroGrid
          leadColumn={
            <ArticleCard
              id={LOREM.lead.id}
              title={LOREM.lead.title}
              vertical={LOREM.lead.vertical}
              tagline={LOREM.lead.tagline}
              excerpt={LOREM.lead.excerpt}
              date={LOREM.lead.date}
              isLead={true}
              image={LOREM.lead.image}
              readTime={LOREM.lead.readTime}
              variant="hero-lead"
              href={MAGAZINE_STORY}
            />
          }
          middleColumn={
            <div className="flex flex-col">
              {LOREM.secondary.map((article, i) => (
                <div key={article.id} className={`${i > 0 ? 'border-t border-black/10 pt-10 mt-10' : ''}`}>
                  <ArticleCard
                    id={article.id}
                    title={article.title}
                    vertical={article.vertical}
                    tagline={article.tagline}
                    excerpt={article.excerpt}
                    date={article.date}
                    image={article.image}
                    readTime={article.readTime}
                    variant="hero-secondary"
                    href={MAGAZINE_STORY}
                  />
                </div>
              ))}
            </div>
          }
          sidebarColumn={
            <>
              <div className="bg-black text-white p-8 flex flex-col">
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
              </div>

              <div className="pt-8 space-y-6">
                {LOREM.tertiary.map((article, i) => (
                  <div key={article.id} className={`${i > 0 ? 'border-t border-black/10 pt-6' : ''}`}>
                    <ArticleCard
                      id={article.id}
                      title={article.title}
                      vertical={article.vertical}
                      tagline={null}
                      excerpt={null}
                      date={article.date}
                      readTime={article.readTime}
                      variant="hero-tertiary"
                      href={MAGAZINE_STORY}
                    />
                  </div>
                ))}
              </div>
            </>
          }
        />
      </main>

      <div style={{ minHeight: 136, background: '#120f0b', borderTop: '1px solid #2a2218' }}>
        <DoorSpeakersStrip />
      </div>
      <MagazineFooter />
    </div>
  )
}
