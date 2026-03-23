import { MagazineHeader } from '@/components/magazine-header'
import { Navigation } from '@/components/navigation'
import { MagazineFooter } from '@/components/magazine-footer'
import Image from 'next/image'

export const metadata = {
  title: 'TheHumanTouch.AI — Our Editorial Philosophy | CityAge',
  description: 'How CityAge uses AI tools directed by human insight, intuition, and decades of editorial experience to produce original intelligence journalism.',
}

export default function AIPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F7]">
      <MagazineHeader />
      <Navigation />

      <main className="flex-grow">
        {/* Hero image — hands on keyboard, human craft */}
        <div className="w-full h-[340px] md:h-[440px] relative overflow-hidden bg-black">
          <Image
            src="https://images.unsplash.com/photo-1504711434969-e33886168d3c?w=1400&q=80"
            alt="Human hands at work"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-[#C5A059] mb-4">
              Our AI &amp; Editorial Philosophy
            </span>
            <h1 className="font-serif font-black text-4xl md:text-6xl text-white tracking-tight">
              TheHumanTouch.AI
            </h1>
          </div>
        </div>

        {/* Policy content */}
        <article className="max-w-[680px] mx-auto px-6 py-16 md:py-24">

          <p className="font-serif text-[19px] leading-[1.85] text-black/80 mb-8">
            CityAge is built on human insight, human intuition, and the spark of human creation. We produce our own journalism and original content, building on our founder&apos;s decades of experience working at the top levels of media nationally and internationally. Everything we publish is directed, shaped, and approved by people.
          </p>

          <p className="font-serif text-[19px] leading-[1.85] text-black/80 mb-8">
            We use AI tools extensively — for research, data analysis, drafting, and image generation — because we believe they are among the most powerful instruments ever created for journalism and intelligence work. But the instruments do not play themselves. We direct the AI we use.
          </p>

          <p className="font-serif text-[19px] leading-[1.85] text-black/80 mb-8">
            We also credit and value the human-generated content we build upon. We do not go behind paywalls. We respect copyright. We link to original sources whenever possible, because we respect the journalists, researchers, and creators whose work informs ours. Their labour makes what we do possible, and we honour it.
          </p>

          <p className="font-serif text-[19px] leading-[1.85] text-black/80 mb-8">
            We are transparent. Every piece of content has a human in the loop. When we make mistakes — and we will — we correct them as quickly as we can.
          </p>

          <div className="border-t border-black/10 pt-10 mt-10">
            <p className="font-serif text-[19px] leading-[1.85] text-black/80 mb-10">
              That is the essence of TheHumanTouch.AI.
            </p>
          </div>

          {/* Principles summary */}
          <div className="bg-black text-white p-8 md:p-12 mt-6">
            <h2 className="font-serif font-black text-xl tracking-tight mb-8">Our Commitments</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#C5A059] mb-2">Human Direction</h3>
                <p className="font-serif text-white/60 text-[15px] leading-[1.8]">Every article, every editorial decision, every published piece is directed and approved by people. AI assists. Humans lead.</p>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#C5A059] mb-2">Original Journalism</h3>
                <p className="font-serif text-white/60 text-[15px] leading-[1.8]">We produce our own content built on decades of editorial experience in national and international media. We are not an aggregator.</p>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#C5A059] mb-2">Transparency</h3>
                <p className="font-serif text-white/60 text-[15px] leading-[1.8]">We use AI tools and we say so. We believe transparency builds trust, and trust is the foundation of good journalism.</p>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#C5A059] mb-2">Respect for Sources</h3>
                <p className="font-serif text-white/60 text-[15px] leading-[1.8]">We do not go behind paywalls. We respect copyright. We link to original sources because the journalists, researchers, and creators whose work informs ours deserve recognition.</p>
              </div>
              
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#C5A059] mb-2">Accountability</h3>
                <p className="font-serif text-white/60 text-[15px] leading-[1.8]">When we make mistakes, we correct them as quickly as we can. If you spot an error, contact us at <a href="mailto:info@cityage.com" className="text-[#C5A059] hover:text-white transition-colors">info@cityage.com</a>.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-black/10 text-center">
            <a href="/" className="font-mono text-[10px] tracking-[0.2em] uppercase text-black/40 hover:text-[#C5A059] transition-colors">
              ← Back to CityAge
            </a>
          </div>

        </article>
      </main>

      <MagazineFooter />
    </div>
  )
}
