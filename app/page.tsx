import Link from 'next/link'

// Placeholder content until Supabase is wired
const featuredEssay = {
  title: 'The 3 Per Cent Problem',
  subtitle: 'Why the most consequential decisions about artificial intelligence will be made in cities — not in labs',
  date: 'March 21, 2026',
  readTime: '6 min read',
  excerpt: `Seventy per cent of global GDP is created on the 3 per cent of the Earth's surface where we live. That means the most important question about AI isn't whether it can pass a bar exam or write a sonnet. It's whether the people who govern, build, and invest in cities — the 3 per cent — will use it to make those places work better for the people who live in them. Or whether they'll let it happen to them.`,
  body: `This is the question that animates everything we publish here. Not the technical frontier — others cover that well — but the human frontier. The moment where a city council decides whether to deploy predictive policing. The moment where an infrastructure investor decides whether AI-optimized traffic modelling changes the value of a corridor. The moment where a defence ministry asks whether autonomous systems change the meaning of sovereignty.\n\nThese aren't theoretical questions. They're being answered right now, in rooms where the people making the decisions often don't have the intelligence they need to make them well.\n\nThat's what The Human Touch exists to provide.`,
}

const curatedLinks = [
  {
    source: 'MIT Technology Review',
    title: 'The cities racing to become AI capitals',
    url: '#',
    note: 'The competition isn\'t between companies anymore. It\'s between cities. And the winners are investing in infrastructure, not just talent.',
  },
  {
    source: 'Financial Times',
    title: 'Defence ministries grapple with autonomous weapons procurement',
    url: '#',
    note: 'This is the procurement story that will define the next decade of trans-Atlantic defence spending. The Ottawa summit on May 26 will address this directly.',
  },
  {
    source: 'Stratechery',
    title: 'Why enterprise AI adoption is slower than the headlines suggest',
    url: '#',
    note: 'Ben Thompson gets this right. The bottleneck isn\'t the technology. It\'s institutional readiness. Cities and governments are even further behind than enterprises.',
  },
  {
    source: 'Reuters',
    title: 'Singapore launches national AI infrastructure plan',
    url: '#',
    note: 'Singapore continues to be the most interesting city-state laboratory for AI governance. What they do in 2026 will be studied for decades.',
  },
  {
    source: 'The Economist',
    title: 'The real estate implications of AI data centre demand',
    url: '#',
    note: 'Every data centre is a land use decision, an energy decision, and a community decision. This is urban planning\'s next great challenge.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* Minimal header */}
      <header className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
              The Human Touch
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <a href="#archive" className="text-xs tracking-wide uppercase hover:opacity-60" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>
              Archive
            </a>
            <a href="#about" className="text-xs tracking-wide uppercase hover:opacity-60" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-secondary)' }}>
              About
            </a>
            <a href="#subscribe" className="text-xs tracking-wide uppercase px-4 py-1.5 hover:opacity-80" style={{ fontFamily: 'var(--font-sans)', background: 'var(--accent)', color: 'white' }}>
              Subscribe
            </a>
          </div>
        </div>
      </header>

      {/* Masthead */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ fontFamily: 'var(--font-sans)', color: 'var(--accent)' }}>
            A Weekly Journal
          </p>
          <h2 className="text-4xl md:text-5xl font-light leading-[1.15] tracking-tight mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
            AI Through a Human Lens
          </h2>
          <p className="text-base leading-relaxed max-w-lg mx-auto" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)' }}>
            What artificial intelligence means for cities, institutions, and the way we live. 
            By <strong style={{ color: 'var(--text)' }}>Miro Cernetig</strong>.
          </p>
        </div>
      </div>

      {/* Featured Essay */}
      <article className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        {/* Edition marker */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-sans)', color: 'var(--accent)' }}>
            This Week&apos;s Essay
          </span>
          <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          <span className="text-xs" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-tertiary)' }}>
            {featuredEssay.date} · {featuredEssay.readTime}
          </span>
        </div>

        {/* Essay headline */}
        <h2 className="text-3xl md:text-4xl font-semibold leading-[1.15] tracking-tight mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
          {featuredEssay.title}
        </h2>
        <p className="text-xl md:text-2xl font-light leading-snug mb-10" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-secondary)' }}>
          {featuredEssay.subtitle}
        </p>

        {/* Essay body */}
        <div className="space-y-5">
          <p className="text-base md:text-lg leading-[1.85]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>
            {featuredEssay.excerpt}
          </p>
          {featuredEssay.body.split('\n\n').map((para, i) => (
            <p key={i} className="text-base md:text-lg leading-[1.85]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>
              {para}
            </p>
          ))}
        </div>

        {/* Author sign-off */}
        <div className="mt-12 pt-8 border-t flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
          <div className="w-10 h-10 rounded-full" style={{ background: 'var(--border-strong)' }} />
          <div>
            <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-sans)' }}>Miro Cernetig</div>
            <div className="text-xs" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-tertiary)' }}>Editor & Publisher · CityAge Media</div>
          </div>
        </div>
      </article>

      {/* Subscribe CTA — mid-page */}
      <div id="subscribe" className="border-y" style={{ borderColor: 'var(--border)', background: 'var(--bg-warm)' }}>
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p className="text-xs tracking-[0.25em] uppercase mb-3" style={{ fontFamily: 'var(--font-sans)', color: 'var(--accent)' }}>
            Every Week in Your Inbox
          </p>
          <h3 className="text-2xl font-semibold mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
            Subscribe to The Human Touch
          </h3>
          <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-serif)' }}>
            One essay. Five curated links. The AI stories that matter for cities, institutions, and the way we live.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2.5 text-sm border outline-none focus:border-current"
              style={{ fontFamily: 'var(--font-sans)', borderColor: 'var(--border-strong)', background: 'white' }}
            />
            <button
              className="px-6 py-2.5 text-xs font-semibold tracking-wide uppercase"
              style={{ fontFamily: 'var(--font-sans)', background: 'var(--accent)', color: 'white' }}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Curated Links Stream */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-sans)', color: 'var(--accent)' }}>
            What&apos;s Happening
          </span>
          <span className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        </div>

        <div className="space-y-0">
          {curatedLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              className="block py-6 group border-b"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ fontFamily: 'var(--font-sans)', color: 'var(--accent)' }}>
                  {link.source}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-semibold leading-snug mb-2 group-hover:opacity-70 transition-opacity" style={{ fontFamily: 'var(--font-serif)' }}>
                {link.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-secondary)' }}>
                {link.note}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* About section */}
      <section id="about" className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-warm)' }}>
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h3 className="text-xs tracking-[0.25em] uppercase mb-6" style={{ fontFamily: 'var(--font-sans)', color: 'var(--accent)' }}>
            About
          </h3>
          <p className="text-base leading-[1.85] mb-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>
            The Human Touch is published weekly by Miro Cernetig, a Michener Award-winning journalist, 
            former Globe and Mail foreign correspondent, and founder of CityAge Media. For 15 years, 
            CityAge has convened 25,000+ leaders across 100+ events in 50+ cities to build the future 
            of the urban planet.
          </p>
          <p className="text-base leading-[1.85]" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-secondary)' }}>
            This journal applies that same lens to the most consequential technology of our time. 
            Not the technical frontier — but the human one.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-tertiary)' }}>
            © 2026 The Human Touch · Published by CityAge Media · Vancouver
          </div>
          <div className="flex items-center gap-6">
            <a href="https://cityage.com" className="text-xs hover:opacity-60" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-tertiary)' }}>
              CityAge
            </a>
            <a href="https://cityagemag.vercel.app" className="text-xs hover:opacity-60" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-tertiary)' }}>
              The Urban Planet
            </a>
            <a href="https://x.com/CityAge" className="text-xs hover:opacity-60" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-tertiary)' }}>
              X
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}
