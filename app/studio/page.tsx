import { Metadata } from 'next'
import { MagazineHeader } from '@/components/magazine-header'
import { MagazineFooter } from '@/components/magazine-footer'

export const metadata: Metadata = {
  title: 'Studio — CityAge',
  description: 'CityAge Studio: end-to-end storytelling. Facing Saddam, Solar Earth, Giltrude’s Dwelling.',
}

const FILMS = [
  {
    title: 'Facing Saddam',
    deck: "A sobering depiction of the 'Butcher of Baghdad', cast in the hollows of the impressions he left on survivors of both his terror and his love.",
    media: null as null | { kind: 'hosted' | 'youtube'; src: string },
  },
  {
    title: 'Solar Earth',
    deck: 'Corporate Video for Solar Earth Canada',
    media: {
      kind: 'hosted' as const,
      src: 'https://cityage.com/wp-content/uploads/Solar-Earth.mp4',
    },
  },
  {
    title: "Giltrude's Dwelling",
    deck: 'Orphaned at the age of 11, Giltrude, an interdimensional shut-in, has waited 15 years for her parents to come home. When a life or death dilemma comes knocking, Giltrude must look beyond her front door and face the outside universe.',
    media: {
      kind: 'youtube' as const,
      src: 'https://www.youtube.com/embed/WHe2jtngaSY',
    },
  },
]

const SERVICES = [
  'CityAge Events + Campaigns',
  'Brand Creation',
  'Teaser Reels',
  'Documentaries',
  'Earned Media Strategy',
  'Original Content (Video + Written)',
]

export default function StudioPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />

      <main className="flex-grow max-w-[1400px] mx-auto w-full bg-[#F9F9F7]">
        <section className="border-b border-black/10 px-6 md:px-10 py-14 md:py-20">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-black/40 block mb-6">
            Studio
          </span>
          <h1 className="font-serif font-black text-[2.2rem] md:text-[3.4rem] leading-[1.08] tracking-tight max-w-[18ch] mb-8">
            CityAge Studio: End-to-End Storytelling.
          </h1>
          <div className="max-w-[680px] space-y-5">
            <p className="font-serif text-[17px] leading-[1.72] text-black/70">
              CityAge Studio combines cutting-edge AI tools with the creative expertise of professionals who have worked with some of the world’s top brands. Every piece of content we produce—whether documentaries, teaser reels, or thought leadership materials—is original and crafted by humans.
            </p>
            <p className="font-serif text-[17px] leading-[1.72] text-black/70">
              We also host events that engage a network of more than 25,000 leaders and excel at earned media, with our work featured in The New York Times, The Wall Street Journal, The Globe and Mail, the BBC, CBC, National Geographic, The Economist, 60 Minutes, and many other leading outlets.
            </p>
          </div>

          <div className="mt-12 max-w-[900px] bg-black">
            <video
              className="w-full aspect-video object-cover"
              src="https://cityage.com/wp-content/uploads/CA-studio.mp4"
              poster="https://cityage.com/wp-content/uploads/CAstudio-vid.png"
              controls
              playsInline
              preload="metadata"
            >
              CityAge Studio
            </video>
          </div>
        </section>

        <section className="border-b border-black/10 px-6 md:px-10 py-14 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {FILMS.map((film, i) => (
              <article
                key={film.title}
                className={`${i > 0 ? 'lg:border-l border-black/10 lg:pl-10 mt-12 pt-12 border-t border-black/10 lg:mt-0 lg:pt-0 lg:border-t-0' : ''} ${i === 1 ? 'lg:px-10' : ''} ${i === 2 ? '' : 'lg:pr-10'}`}
              >
                <h2 className="font-serif font-black text-[1.7rem] leading-[1.12] tracking-tight mb-4">
                  {film.title}
                </h2>
                <p className="font-serif text-[15px] leading-[1.7] text-black/65 mb-6">
                  {film.deck}
                </p>
                {film.media?.kind === 'hosted' && (
                  <video
                    className="w-full aspect-video object-cover bg-black"
                    src={film.media.src}
                    controls
                    playsInline
                    preload="metadata"
                  >
                    {film.title}
                  </video>
                )}
                {film.media?.kind === 'youtube' && (
                  <div className="relative w-full aspect-video bg-black">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={film.media.src}
                      title={`${film.title} trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="px-6 md:px-10 py-14 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12 items-start">
            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-black/30 block mb-5">
                Our Services
              </span>
              <ul className="divide-y divide-black/10 border-y border-black/10">
                {SERVICES.map((item) => (
                  <li key={item} className="font-serif text-[16px] py-3 text-black/80">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-black/30 block mb-5">
                Contact
              </span>
              <a
                href="mailto:info@cityage.com"
                className="font-mono text-[10px] font-black tracking-[0.15em] uppercase text-black hover:text-[#C5A059] transition-colors"
              >
                info@cityage.com
              </a>
            </div>
          </div>
        </section>
      </main>

      <MagazineFooter />
    </div>
  )
}
