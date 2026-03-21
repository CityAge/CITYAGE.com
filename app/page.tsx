export const revalidate = 60

export default async function Home() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-[#FFFFF8]">

      {/* Top accent rule */}
      <div className="w-full h-[2px] bg-[#C62828]" />

      {/* Masthead */}
      <header className="max-w-[680px] mx-auto px-6 pt-12 pb-8">
        <div className="text-center">
          <a href="/">
            <h1 className="font-black text-[2.6rem] md:text-[3.2rem] tracking-tight leading-none text-[#1a1a1a]" style={{ fontFamily: 'var(--font-display)' }}>
              The Human Touch
            </h1>
          </a>
          <div className="mt-3 flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-[#E8E4DD]" />
            <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#999]">
              AI Through a Human Lens
            </span>
            <div className="h-px w-12 bg-[#E8E4DD]" />
          </div>
        </div>
      </header>

      {/* Nav */}
      <nav className="max-w-[680px] mx-auto px-6 pb-8">
        <div className="flex items-center justify-center gap-8 border-y border-[#E8E4DD] py-3">
          {['Essays', 'The Feed', 'The Conversation', 'About'].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-[12px] tracking-[0.15em] uppercase text-[#999] hover:text-[#C62828] transition-colors">
              {item}
            </a>
          ))}
          <span className="text-[#E8E4DD]">|</span>
          <a href="#subscribe" className="text-[12px] tracking-[0.15em] uppercase text-[#C62828] hover:text-[#1a1a1a] transition-colors font-semibold">
            Subscribe
          </a>
        </div>
      </nav>

      {/* Date */}
      <div className="max-w-[680px] mx-auto px-6 mb-10">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#ccc]">{currentDate}</span>
      </div>

      {/* Featured Essay */}
      <article className="max-w-[680px] mx-auto px-6 mb-16">
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#C62828] font-semibold">
          This Week&apos;s Essay
        </span>

        <h2 className="text-[2rem] md:text-[2.5rem] leading-[1.12] tracking-tight font-bold mt-6 mb-6" style={{ fontFamily: 'var(--font-display)' }}>
          The Machine Doesn&apos;t Know What It&apos;s Looking At. That&apos;s the Point.
        </h2>

        <p className="text-lg md:text-xl leading-relaxed text-[#1a1a1a]/60 mb-8 italic">
          On the difference between intelligence that processes and intelligence that understands — and why the gap matters more than the AI industry wants to admit.
        </p>

        <div className="text-[17px] leading-[1.9] text-[#1a1a1a]/75 space-y-6">
          <p>
            <span className="font-bold text-[#1a1a1a] text-4xl float-left mr-3 mt-1 leading-none" style={{ fontFamily: 'var(--font-display)' }}>T</span>here
            is a moment in every conversation about artificial intelligence where someone says the word &ldquo;understands&rdquo; and someone
            else flinches. The flinch is important. It marks the border between two entirely different conceptions of what
            we&apos;re building — and what it means for the cities, institutions, and systems that will have to live with the consequences.
          </p>
          <p>
            This week, OpenAI released yet another model. The benchmarks improved. The capabilities expanded. The demos were impressive.
            But the question that hangs over all of it — the question that should concern every mayor, every investor, every policy maker reading this —
            remains unanswered: does the improvement in capability correspond to an improvement in judgment?
          </p>
          <p>
            We have spent the past year building an intelligence system — we call it the Urban Brain — that processes
            thousands of data points daily across defence, infrastructure, space, and energy. It scans. It synthesizes.
            It produces briefs that our subscribers tell us are genuinely useful. But we never pretend that the system <em>understands</em> what
            it&apos;s reading. It finds patterns. The understanding comes from us — from 30 years of journalism, from being in the rooms
            where these decisions get made, from knowing which patterns matter and which are noise.
          </p>
          <p>
            That&apos;s the human touch. And it&apos;s not a limitation. It&apos;s the product.
          </p>
        </div>

        {/* Author */}
        <div className="mt-10 pt-6 border-t border-[#E8E4DD] flex items-center gap-4">
          <div className="w-11 h-11 rounded-full bg-[#E8E4DD] overflow-hidden">
            <img src="/editor-portrait.jpg" alt="Miro Cernetig" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="text-[14px] font-semibold block">Miro Cernetig</span>
            <span className="text-[11px] text-[#999]">Editor & Publisher · CityAge Media</span>
          </div>
        </div>
      </article>

      {/* Section divider */}
      <div className="max-w-[680px] mx-auto px-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-[#E8E4DD]" />
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#ccc]">The Feed</span>
          <div className="h-px flex-1 bg-[#E8E4DD]" />
        </div>
      </div>

      {/* Curated Links */}
      <section className="max-w-[680px] mx-auto px-6 mb-16">
        <p className="text-[15px] text-[#999] italic mb-10 leading-relaxed">
          What caught our attention this week. Each link carries an editorial note — why it matters, what it means, what to watch.
        </p>

        {[
          {
            source: 'MIT Technology Review', tag: 'Infrastructure',
            title: 'The Hidden Cost of AI Infrastructure',
            note: 'Everyone talks about compute costs. Nobody talks about the water. This piece maps the actual physical footprint of AI data centres on municipal water systems. If you run a city, read this.',
          },
          {
            source: 'Financial Times', tag: 'Defence',
            title: 'Defence Ministries Turn to AI for Procurement — With Mixed Results',
            note: 'The UK and Canadian defence departments are both piloting AI-driven procurement systems. Early results suggest the technology is better at finding inefficiencies than at making decisions. The human touch, it turns out, still matters.',
          },
          {
            source: 'Stratechery', tag: 'AI Industry',
            title: 'Anthropic\'s Quiet Bet on Enterprise',
            note: 'While OpenAI chases consumers and Google chases developers, Anthropic is building something more interesting — an enterprise intelligence layer. Sound familiar?',
          },
          {
            source: 'Bloomberg', tag: 'Policy',
            title: 'Singapore\'s AI Governance Framework Is Becoming the Global Default',
            note: 'When we talk about AI regulation, we tend to look at Brussels or Washington. But Singapore\'s lighter-touch, principle-based framework is quietly being adopted across Asia. For anyone building AI products for institutional clients, this is the standard to watch.',
          },
          {
            source: 'The Guardian', tag: 'Cities',
            title: 'A Small Town in Norway Is Using AI to Predict Avalanches',
            note: 'This is the kind of AI story that gets buried under the noise of model releases and funding rounds. A municipality of 4,000 people, using machine learning to save lives. That\'s the human touch.',
          },
        ].map((item, i) => (
          <div key={i} className="mb-10 pb-10 border-b border-[#E8E4DD] last:border-0 last:pb-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#C62828] font-semibold">{item.tag}</span>
              <span className="text-[#ddd]">·</span>
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[#bbb]">{item.source}</span>
            </div>
            <h3 className="text-[1.35rem] md:text-[1.5rem] leading-[1.2] font-bold mb-3 hover:text-[#C62828] transition-colors cursor-pointer" style={{ fontFamily: 'var(--font-display)' }}>
              {item.title}
            </h3>
            <p className="text-[15px] leading-[1.85] text-[#1a1a1a]/65">
              {item.note}
            </p>
          </div>
        ))}
      </section>

      {/* Subscribe */}
      <section id="subscribe" className="max-w-[680px] mx-auto px-6 mb-20">
        <div className="bg-[#1a1a1a] px-8 md:px-12 py-14 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            The Human Touch
          </h3>
          <p className="text-white/50 text-[15px] italic mb-1">
            AI through a human lens.
          </p>
          <p className="text-white/30 text-xs mb-8">
            A weekly journal on artificial intelligence and its impact on how we live, build, and govern.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input type="email" placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#C62828] transition-colors" />
            <button className="bg-[#C62828] text-white px-6 py-3 text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#a02020] transition-colors shrink-0">
              Subscribe
            </button>
          </div>
          <p className="text-white/15 text-[10px] mt-5 tracking-wider uppercase">
            By Miro Cernetig · Published by CityAge Media · Weekly
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-[680px] mx-auto px-6 pb-16">
        <div className="border-t border-[#E8E4DD] pt-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>The Human Touch</span>
              <span className="text-[#999] text-xs ml-2">by Miro Cernetig</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="https://cityage.com" className="text-[10px] tracking-[0.15em] uppercase text-[#999] hover:text-[#C62828] transition-colors">CityAge Media</a>
              <a href="https://cityagemag.vercel.app" className="text-[10px] tracking-[0.15em] uppercase text-[#999] hover:text-[#C62828] transition-colors">The Urban Planet</a>
              <a href="https://x.com/CityAge" className="text-[10px] tracking-[0.15em] uppercase text-[#999] hover:text-[#C62828] transition-colors">X</a>
            </div>
          </div>
          <p className="text-[10px] text-[#ccc] mt-6">© 2026 CityAge Media. Vancouver, BC.</p>
        </div>
      </footer>

      {/* Bottom accent rule */}
      <div className="w-full h-[2px] bg-[#C62828]" />
    </div>
  )
}
