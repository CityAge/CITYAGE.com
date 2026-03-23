export function MagazineFooter() {
  return (
    <footer className="bg-black text-white py-24 px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20">
        <div className="md:col-span-2 space-y-10">
          <h2 className="font-serif text-5xl font-black uppercase tracking-tighter monocle-wordmark">
            CITYAGE
          </h2>
          <p className="text-sm text-white/40 leading-relaxed max-w-md font-medium uppercase tracking-[0.15em]">
            The primary intelligence source for global urban leadership. 
            25,000+ decision-makers across infrastructure, space, energy, defence, and food systems.
          </p>
          <div className="flex space-x-6">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-[#C5A059]">
              Est. 2012 — Vancouver
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20">
            The Network
          </h3>
          <ul className="text-[11px] space-y-4 font-bold tracking-widest uppercase">
            <li><a href="/dispatches" className="hover:text-[#C5A059] transition-all">Dispatches</a></li>
            <li><a href="/canada-europe-connects" className="hover:text-[#C5A059] transition-all">Canada–Europe Connects</a></li>
            <li><a href="https://cityage.com/events" className="hover:text-[#C5A059] transition-all">Events 2026</a></li>
            <li><a href="/past-events" className="hover:text-[#C5A059] transition-all">Past Events</a></li>
            <li><a href="/partners" className="hover:text-[#C5A059] transition-all">Knowledge Partners</a></li>
            <li><a href="https://orbit.cityage.com" className="hover:text-[#C5A059] transition-all">Orbit — Space Economy</a></li>
          </ul>
        </div>

        <div className="space-y-8">
          <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/20">
            Contact
          </h3>
          <address className="text-[11px] not-italic text-white/40 leading-relaxed font-bold tracking-widest uppercase">
            CityAge Media<br />
            Vancouver, BC<br />
            <a href="mailto:info@cityage.com" className="hover:text-[#C5A059] transition-colors">info@cityage.com</a>
          </address>
          <div className="flex gap-4 pt-2">
            <a href="https://x.com/CityAge" className="text-[10px] font-bold tracking-widest uppercase text-white/30 hover:text-[#C5A059] transition-colors">X</a>
            <a href="https://www.linkedin.com/company/cityage/" className="text-[10px] font-bold tracking-widest uppercase text-white/30 hover:text-[#C5A059] transition-colors">LinkedIn</a>
            <a href="https://youtube.com/@cityagemedia7043" className="text-[10px] font-bold tracking-widest uppercase text-white/30 hover:text-[#C5A059] transition-colors">YouTube</a>
          </div>
        </div>
      </div>

      {/* ─── AI & EDITORIAL POLICY ─── */}
      <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-white/10">
        <div className="max-w-2xl">
          <h3 className="font-serif font-black text-lg tracking-tight mb-1">
            <a href="/ai-policy" className="hover:text-[#C5A059] transition-colors">TheHumanTouch.AI</a>
          </h3>
          <a href="/ai-policy" className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#C5A059] hover:text-white transition-colors">Read Our Full AI &amp; Editorial Policy →</a>
          <p className="font-serif text-white/50 text-[15px] leading-[1.8] mt-5 mb-4">
            CityAge is built on human insight, human intuition, and the spark of human creation. We produce our own journalism and original content, building on our founder's decades of experience working at the top levels of media nationally and internationally. Everything we publish is directed, shaped, and approved by people.
          </p>
          <p className="font-serif text-white/50 text-[15px] leading-[1.8] mb-4">
            We use AI tools extensively — for research, data analysis, drafting, and image generation — because we believe they are among the most powerful instruments ever created for journalism and intelligence work. But the instruments do not play themselves. We direct the AI we use.
          </p>
          <p className="font-serif text-white/50 text-[15px] leading-[1.8] mb-4">
            We also credit and value the human-generated content we build upon. We do not go behind paywalls. We respect copyright. We link to original sources whenever possible, because we respect the journalists, researchers, and creators whose work informs ours. Their labour makes what we do possible, and we honour it.
          </p>
          <p className="font-serif text-white/50 text-[15px] leading-[1.8] mb-4">
            We are transparent. Every piece of content has a human in the loop. When we make mistakes — and we will — we correct them as quickly as we can.
          </p>
          <p className="font-serif text-white/50 text-[15px] leading-[1.8] mb-4">
            That is the essence of <a href="https://thehumantouch.ai" className="text-[#C5A059] hover:text-white transition-colors">TheHumanTouch.AI</a>.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-mono text-[10px] text-white/20 tracking-wider uppercase">
          © 2026 CityAge Media. All Rights Reserved.
        </span>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="font-mono text-[10px] text-white/20 tracking-wider uppercase hover:text-[#C5A059] transition-colors">
            Privacy Policy
          </a>
          <span className="text-white/10">·</span>
          <span className="font-mono text-[10px] text-white/20 tracking-wider uppercase">
            100+ Convenings · 50+ Cities · 15 Years
          </span>
        </div>
      </div>
    </footer>
  )
}
