export function MagazineFooter() {
  return (
    <footer className="bg-black text-white py-16 px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        <div className="md:col-span-2 space-y-4">
          <h2 className="font-serif text-3xl font-black uppercase tracking-[0.06em]">
            CityAge
          </h2>
          <p className="font-serif italic text-[16px] text-white/70 leading-snug">
            Intelligence for the urban planet.
          </p>
          <p className="font-serif text-[15px] text-white/55 leading-snug">
            Everything happens on the earth’s 2 percent.
          </p>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#C5A059] block pt-2">
            Est. 2012 — Vancouver
          </span>
        </div>

        <div className="space-y-5">
          <h3 className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">
            The House
          </h3>
          <ul className="text-[11px] space-y-3 font-medium tracking-wider uppercase text-white/60">
            <li><a href="/purpose" className="hover:text-[#C5A059] transition-colors">Purpose</a></li>
            <li><a href="/#forums" className="hover:text-[#C5A059] transition-colors">Forums</a></li>
            <li><a href="/partners" className="hover:text-[#C5A059] transition-colors">Partnerships</a></li>
            <li><a href="/partnerships.html" className="hover:text-[#C5A059] transition-colors">Knowledge Partnerships</a></li>
            <li><a href="/#studio" className="hover:text-[#C5A059] transition-colors">Studio</a></li>
            <li><a href="/#letter" className="hover:text-[#C5A059] transition-colors">The Letter</a></li>
            <li><a href="/people.html" className="hover:text-[#C5A059] transition-colors">The Network</a></li>
          </ul>
        </div>

        <div className="space-y-5">
          <h3 className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20">
            The Rooms
          </h3>
          <ul className="text-[11px] space-y-3 font-medium tracking-wider uppercase text-white/60">
            <li><a href="/northern-century.html" className="hover:text-[#C5A059] transition-colors">Northern Century</a></li>
            <li><a href="/next-vancouver.html" className="hover:text-[#C5A059] transition-colors">Next Metro Vancouver</a></li>
            <li><a href="/canada-europe-connects" className="hover:text-[#C5A059] transition-colors">Canada–Europe Connects</a></li>
            <li><a href="/dispatches" className="hover:text-[#C5A059] transition-colors">Dispatches</a></li>
          </ul>
        </div>
      </div>

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
        </div>
      </div>
    </footer>
  )
}
