export function MagazineFooter() {
  return (
    <footer className="bg-black text-white py-16 px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="md:col-span-2 space-y-5">
          <h2 className="font-serif text-3xl font-black uppercase tracking-tighter">
            CityAge
          </h2>
          <p className="text-[12px] text-white/40 leading-relaxed uppercase tracking-[0.15em]">
            Intelligence for The Urban Planet
          </p>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059]">
            Est. 2012 — Vancouver
          </span>
        </div>

        {/* Network */}
        <div className="space-y-5">
          <h3 className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">
            The Network
          </h3>
          <ul className="text-[11px] space-y-3 font-medium tracking-wider uppercase text-white/60">
            <li><a href="/dispatches" className="hover:text-[#C5A059] transition-colors">Dispatches</a></li>
            <li><a href="/canada-europe-connects" className="hover:text-[#C5A059] transition-colors">Canada–Europe Connects</a></li>
            <li><a href="https://cityage.com/events" className="hover:text-[#C5A059] transition-colors">Events 2026</a></li>
            <li><a href="https://cityage.com/past-events/" target="_blank" rel="noopener" className="hover:text-[#C5A059] transition-colors">Past Events</a></li>
            <li><a href="https://cityage.com/knowledge-partners/" target="_blank" rel="noopener" className="hover:text-[#C5A059] transition-colors">Knowledge Partners</a></li>
            <li><a href="https://orbit.cityage.com" className="hover:text-[#C5A059] transition-colors">Orbit — Space Economy</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-5">
          <h3 className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">
            Contact
          </h3>
          <address className="text-[11px] not-italic text-white/50 leading-loose tracking-wider uppercase">
            CityAge Media<br />
            Vancouver, BC<br />
            <a href="mailto:info@cityage.com" className="hover:text-[#C5A059] transition-colors">info@cityage.com</a>
          </address>
          <div className="flex gap-4">
            <a href="https://x.com/CityAge" className="text-[10px] font-bold tracking-widest uppercase text-white/30 hover:text-[#C5A059] transition-colors">X</a>
            <a href="https://www.linkedin.com/company/cityage/" className="text-[10px] font-bold tracking-widest uppercase text-white/30 hover:text-[#C5A059] transition-colors">LinkedIn</a>
            <a href="https://youtube.com/@cityagemedia7043" className="text-[10px] font-bold tracking-widest uppercase text-white/30 hover:text-[#C5A059] transition-colors">YouTube</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <span className="font-mono text-[9px] text-white/20 tracking-wider uppercase">
          © 2026 CityAge Media. All Rights Reserved.
        </span>
        <div className="flex items-center gap-4">
          <a href="/ai-policy" className="font-mono text-[9px] text-white/20 tracking-wider uppercase hover:text-[#C5A059] transition-colors">
            AI & Editorial Policy
          </a>
          <span className="text-white/10">·</span>
          <a href="/privacy" className="font-mono text-[9px] text-white/20 tracking-wider uppercase hover:text-[#C5A059] transition-colors">
            Privacy
          </a>
          <span className="text-white/10">·</span>
          <span className="font-mono text-[9px] text-white/20 tracking-wider uppercase">
            100+ Convenings · 50+ Cities · 15 Years
          </span>
        </div>
      </div>
    </footer>
  )
}
