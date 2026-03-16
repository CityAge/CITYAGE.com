import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

// Mock articles data — replace with Supabase later
const articles: Record<string, {
  slug: string
  category: string
  location: string
  headline: string
  deck: string
  author: string
  authorTitle: string
  date: string
  readTime: string
  heroImage: string
  body: string[]
  pullQuote?: string
  relatedSlugs: string[]
}> = {
  'vertical-forest-singapore': {
    slug: 'vertical-forest-singapore',
    category: 'FABRIC',
    location: 'FROM SINGAPORE',
    headline: 'The Vertical Forest: Reimagining Singapore\'s Skyline',
    deck: 'How biophilic architecture is reshaping the future of urban density in Southeast Asia\'s most ambitious city-state.',
    author: 'Eleanor Vance',
    authorTitle: 'Urban Systems Editor',
    date: 'March 2026',
    readTime: '8 min read',
    heroImage: '/ottawa-feature.jpg',
    body: [
      'Singapore has always been a laboratory for urban innovation. From its founding as a trading post to its emergence as a global financial hub, the city-state has consistently reimagined what dense urban living can look like. Now, it is pioneering a new frontier: the vertical forest.',
      'The concept is deceptively simple. Instead of treating buildings as inert structures that consume resources and generate heat, architects are designing towers that function as living ecosystems. Every balcony becomes a garden. Every facade becomes a habitat. The building breathes.',
      'At the forefront of this movement is the Oasia Hotel Downtown, a 27-storey tower wrapped in a living skin of 21 species of creepers and vines. From a distance, the building appears to be a red and green pillar of vegetation rising from the urban grid. Up close, the effect is even more striking: birds nest in the foliage, insects pollinate the flowers, and the air feels measurably cooler.',
      'The implications extend far beyond aesthetics. Singapore\'s Urban Redevelopment Authority estimates that if 80% of new buildings incorporated vertical greenery, the city could reduce its ambient temperature by 2-3 degrees Celsius. In a tropical climate where air conditioning accounts for over 40% of energy consumption, this represents a massive reduction in carbon emissions.',
      'But the vertical forest is more than an environmental strategy. It is a statement about the future of human habitation. As cities around the world grapple with the twin pressures of population growth and climate change, Singapore is demonstrating that density and nature are not mutually exclusive.',
      'The next generation of projects is even more ambitious. The upcoming Tengah "Forest Town" will be Singapore\'s first car-free neighborhood, with automated vehicles running underground and the surface given over entirely to pedestrians, cyclists, and greenery. Every residential block will be required to incorporate vertical gardens, and a continuous green corridor will connect the development to the surrounding nature reserves.',
      'For city planners watching from Jakarta, Mumbai, and Lagos, Singapore\'s experiment offers both inspiration and caution. The vertical forest requires significant investment in maintenance and specialized expertise. Not every climate can support the same species mix. And the benefits accrue most visibly to those who can afford premium real estate.',
      'Yet the underlying principle is universally applicable: cities must learn to work with nature, not against it. The vertical forest is one answer to that imperative. As Singapore continues to build upward, it is also building a new vision of what the 21st-century city can become.'
    ],
    pullQuote: 'Cities must learn to work with nature, not against it. The vertical forest is one answer to that imperative.',
    relatedSlugs: ['hydrogen-corridors', 'soft-infrastructure-cities']
  },
  'hydrogen-corridors': {
    slug: 'hydrogen-corridors',
    category: 'TRANSIT',
    location: 'FROM ROTTERDAM',
    headline: 'Hydrogen Corridors: The New Silk Road?',
    deck: 'Examining the massive shift in transit logistics as the world moves away from petroleum-based shipping routes.',
    author: 'Samaire Armstrong',
    authorTitle: 'Energy & Infrastructure Correspondent',
    date: 'March 2026',
    readTime: '12 min read',
    heroImage: '/ottawa-feature.jpg',
    body: [
      'The port of Rotterdam has always been Europe\'s gateway to the world. For centuries, goods have flowed through its docks, from spices and textiles to oil and automobiles. Now, the port is preparing for a new commodity: hydrogen.',
      'The shift is already underway. In 2025, Rotterdam opened Europe\'s first dedicated hydrogen import terminal, capable of receiving shipments from production facilities in Australia, Chile, and the Middle East. By 2030, the port expects hydrogen to account for 20% of its total energy throughput.',
      'This is not merely a change in cargo. It represents a fundamental restructuring of global trade routes. The petroleum era created a geography of dependency, with shipping lanes oriented around the Gulf states and their vast oil reserves. The hydrogen era will create new corridors, new dependencies, and new centers of power.',
      'Australia, with its abundant solar resources and vast empty spaces, is positioning itself as the Saudi Arabia of hydrogen. Chile, blessed with the world\'s best wind resources in Patagonia, is not far behind. Even countries like Namibia and Morocco are attracting investment from European utilities eager to secure future supply.',
      'For Rotterdam, the transition is existential. The port\'s entire infrastructure was built for the fossil fuel age. Its refineries, storage tanks, and pipeline networks are all optimized for oil and gas. Converting this infrastructure to hydrogen will require tens of billions of euros in investment.',
      'Yet the alternative is obsolescence. As Europe\'s carbon regulations tighten and shipping companies face pressure to decarbonize, ports that cannot handle hydrogen will lose business to those that can. Rotterdam is betting that first-mover advantage will be decisive.',
      'The geopolitical implications are equally profound. Hydrogen pipelines could bind Europe more closely to North Africa, creating new patterns of interdependence. Maritime shipping routes could shift toward the Southern Hemisphere, where most renewable hydrogen will be produced. And countries that master hydrogen production technology could find themselves wielding new forms of leverage.',
      'For now, these are projections. The hydrogen economy remains nascent, and many technical and economic hurdles must be overcome. But the direction of travel is clear. The silk roads of the 21st century will carry not silk or oil, but the lightest element in the universe.'
    ],
    pullQuote: 'The silk roads of the 21st century will carry not silk or oil, but the lightest element in the universe.',
    relatedSlugs: ['vertical-forest-singapore', 'soft-infrastructure-cities']
  },
  'soft-infrastructure-cities': {
    slug: 'soft-infrastructure-cities',
    category: 'SYSTEM',
    location: 'FROM COPENHAGEN',
    headline: 'Why Soft Infrastructure is the Future of Global Cities',
    deck: 'The digital layer of governance is moving from simple data collection to empathetic citizen-centric response systems.',
    author: 'Marcus Chen',
    authorTitle: 'Digital Governance Editor',
    date: 'February 2026',
    readTime: '10 min read',
    heroImage: '/ottawa-feature.jpg',
    body: [
      'When Copenhagen launched its "City Data Exchange" in 2024, city officials expected modest efficiency gains. What they got was a revolution in how citizens interact with their government.',
      'The platform aggregates data from sensors, mobile phones, and city services to create a real-time picture of urban life. Traffic patterns, energy consumption, waste collection, air quality—all are visible on a single dashboard. But the true innovation lies in how this data is used.',
      'Rather than simply monitoring and reporting, the system learns. It predicts where problems will emerge and routes resources proactively. A spike in noise complaints in one neighborhood triggers automatic adjustments to garbage collection schedules. A pattern of emergency room visits suggests the need for a new clinic.',
      'Copenhagen calls this "anticipatory governance." The city responds to problems before citizens need to complain. In a sense, the city has developed a form of empathy—an ability to sense the collective mood and respond accordingly.',
      'The implications extend beyond efficiency. When government becomes proactive, the nature of citizenship changes. Danes report feeling more connected to their city, more confident that their needs are understood. Trust in local government has risen to levels not seen in decades.',
      'Other cities are watching closely. Singapore has deployed similar systems with characteristic thoroughness. Amsterdam is experimenting with AI-powered citizen engagement. Even cities with fewer resources, like Medellín and Kigali, are finding ways to incorporate soft infrastructure into their planning.',
      'Critics warn of surveillance and manipulation. If the city can predict behavior, can it also shape it? The line between service and control is thin. Copenhagen has addressed these concerns through radical transparency—all algorithms are published, all data is anonymized, and citizens can opt out of collection.',
      'Yet the deeper question is philosophical. What does it mean to live in a city that knows you? As soft infrastructure spreads, urban residents will need to develop new frameworks for thinking about privacy, agency, and the social contract. The smart city is not just a technical project. It is a new form of political community.'
    ],
    pullQuote: 'What does it mean to live in a city that knows you? The smart city is not just a technical project. It is a new form of political community.',
    relatedSlugs: ['vertical-forest-singapore', 'hydrogen-corridors']
  }
}

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles[slug]
  if (!article) return { title: 'Article Not Found' }
  
  return {
    title: `${article.headline} | CityAge`,
    description: article.deck,
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = articles[slug]
  
  if (!article) {
    notFound()
  }

  const relatedArticles = article.relatedSlugs
    .map(s => articles[s])
    .filter(Boolean)

  return (
    <main className="min-h-screen bg-[#FDFCF8]">
      {/* Header bar */}
      <header className="bg-[#050505] py-4 px-8 md:px-16">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif font-black text-white text-xl md:text-2xl tracking-tight hover:text-[#D4AF37] transition-colors">
            CITYAGE
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {['Dispatches', 'Intelligence', 'Events', 'Purpose'].map((item) => (
              <a
                key={item}
                href={`/#${item.toLowerCase()}`}
                className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#888888] hover:text-[#D4AF37] transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Article header */}
      <article>
        <div className="max-w-4xl mx-auto px-8 md:px-16 pt-16 pb-8">
          {/* Category & Location */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-mono text-[11px] tracking-[0.3em] text-[#D4AF37] uppercase font-semibold">
              {article.category}
            </span>
            <span className="text-black/20">|</span>
            <span className="font-mono text-[11px] tracking-[0.2em] text-black/50 uppercase">
              {article.location}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif font-black text-black text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-6">
            {article.headline}
          </h1>

          {/* Deck */}
          <p className="font-serif text-xl md:text-2xl text-black/70 leading-relaxed mb-8 max-w-3xl">
            {article.deck}
          </p>

          {/* Author & Meta */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-8 border-b border-black/10">
            <div>
              <p className="font-mono text-[11px] tracking-[0.15em] text-black uppercase font-semibold">
                {article.author}
              </p>
              <p className="font-mono text-[10px] tracking-[0.1em] text-black/50 uppercase">
                {article.authorTitle}
              </p>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <span className="font-mono text-[10px] tracking-[0.15em] text-black/40 uppercase">
                {article.date}
              </span>
              <span className="font-mono text-[10px] tracking-[0.15em] text-black/40 uppercase">
                {article.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Hero image */}
        <div className="max-w-5xl mx-auto px-8 md:px-16 mb-12">
          <div className="aspect-[16/9] relative bg-black/5">
            <Image
              src={article.heroImage}
              alt={article.headline}
              fill
              className="object-cover grayscale"
              priority
            />
          </div>
        </div>

        {/* Body content */}
        <div className="max-w-3xl mx-auto px-8 md:px-16 pb-20">
          {article.body.map((paragraph, idx) => (
            <div key={idx}>
              {/* Insert pull quote after 4th paragraph */}
              {idx === 4 && article.pullQuote && (
                <blockquote className="my-12 py-8 border-t border-b border-[#D4AF37]/30">
                  <p className="font-serif italic text-2xl md:text-3xl text-black/80 leading-relaxed text-center">
                    "{article.pullQuote}"
                  </p>
                </blockquote>
              )}
              <p className={`font-serif text-lg md:text-xl text-black/80 leading-[1.8] mb-6 ${idx === 0 ? 'first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none' : ''}`}>
                {paragraph}
              </p>
            </div>
          ))}

          {/* Author sign-off */}
          <div className="mt-16 pt-8 border-t border-black/10">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase mb-2">
              Written by
            </p>
            <p className="font-serif font-semibold text-black text-lg">
              {article.author}
            </p>
            <p className="font-mono text-[11px] tracking-[0.1em] text-black/50 uppercase">
              {article.authorTitle} — CityAge
            </p>
          </div>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-[#050505] py-16 px-8 md:px-16">
            <div className="max-w-5xl mx-auto">
              <h2 className="font-mono text-[11px] tracking-[0.3em] text-[#D4AF37] uppercase mb-8">
                Continue Reading
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/article/${related.slug}`}
                    className="group block"
                  >
                    <div className="aspect-[16/9] relative bg-white/5 mb-4 overflow-hidden">
                      <Image
                        src={related.heroImage}
                        alt={related.headline}
                        fill
                        className="object-cover grayscale group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="font-mono text-[10px] tracking-[0.25em] text-[#D4AF37] uppercase mb-2">
                      {related.category}
                    </p>
                    <h3 className="font-serif font-bold text-white text-xl md:text-2xl leading-tight group-hover:text-[#D4AF37] transition-colors">
                      {related.headline}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      {/* Footer */}
      <footer className="bg-[#050505] py-12 px-8 md:px-16 border-t border-[#D4AF37]/20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-serif font-black text-white text-lg hover:text-[#D4AF37] transition-colors">
            CITYAGE
          </Link>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#888888] uppercase">
            © 2026 CityAge. Intelligence for the 3 per cent.
          </p>
        </div>
      </footer>
    </main>
  )
}
