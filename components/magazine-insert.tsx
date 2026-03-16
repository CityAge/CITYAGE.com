export function MagazineInsert() {
  return (
    <section
      id="urban-planet"
      className="bg-[#FDFCF0] px-8 md:px-16 py-16 md:py-24"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      <div className="max-w-7xl mx-auto">

        {/* Masthead bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2a2a2a] mb-2">
          <div className="flex flex-col gap-1">
            {/* Primary masthead */}
            <h2
              className="font-serif font-black text-[#1a1a1a] text-2xl md:text-3xl tracking-tight uppercase"
            >
              The Urban Planet
            </h2>
            <span className="font-mono text-[10px] tracking-[0.35em] text-[#2a2a2a]/60 uppercase">
              An Intelligence Journal for the 3%
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#2a2a2a]/40 uppercase">
              Live Feed &mdash; Vol. I
            </span>
            <span className="font-mono text-[8px] tracking-[0.25em] text-[#2a2a2a]/30 uppercase">
              Updated in real-time
            </span>
          </div>
        </div>

        {/* Issue rule */}
        <div className="h-[2px] bg-[#2a2a2a] mb-10" />

        {/* Grand headline spanning all columns */}
        <h2
          className="font-serif font-black text-[#1a1a1a] text-3xl md:text-4xl lg:text-5xl leading-[1.08] tracking-tight text-balance mb-3"
        >
          The 3% Thesis: Why the Urban Planet<br className="hidden md:block" /> is the Frontier of Global Wealth.
        </h2>

        {/* Deck line */}
        <p className="font-mono text-[11px] tracking-[0.25em] text-[#2a2a2a]/50 uppercase mb-8">
          A deep read on capital, infrastructure, and the 3% of Earth that generates 70% of its GDP.
        </p>

        <div className="h-px bg-[#2a2a2a]/20 mb-10" />

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">

          {/* ── COL 1: Deep-read intro ── */}
          <div className="md:pr-8 md:border-r border-[#2a2a2a]/20 pb-8 md:pb-0">
            <p className="font-mono text-[10px] tracking-[0.35em] text-[#2a2a2a]/50 uppercase mb-4">
              The CityAge Philosophy
            </p>
            {/* Drop-cap paragraph */}
            <p className="font-serif text-[#1a1a1a] text-sm md:text-[15px] leading-[1.75] text-pretty mb-5">
              <span
                className="font-serif font-black text-[#1a1a1a] float-left leading-none mr-2"
                style={{ fontSize: "3.8rem", lineHeight: "0.8", marginTop: "0.12em" }}
              >
                T
              </span>
              he planet has a geography of wealth that maps perfectly onto its geography of density. Three percent of Earth's landmass — its cities, ports, and corridors — accounts for seventy percent of global GDP. This is not an accident of history. It is the natural outcome of proximity, infrastructure, and the compounding returns of human coordination.
            </p>
            <p className="font-serif text-[#1a1a1a]/70 text-sm leading-[1.75] text-pretty mb-5">
              For a century, capital has followed this logic quietly. Today, as supply chains fracture, climate forces adaptation, and a new era of strategic competition reshapes the global order, that logic is being tested — and reinforced — simultaneously. The cities that win this decade will be the ones that attract the next layer of institutional investment, defence-adjacent infrastructure, and deep-tech employment.
            </p>
            <p className="font-serif text-[#1a1a1a]/70 text-sm leading-[1.75] text-pretty">
              CityAge was founded to serve the people building that future. Our intelligence is not analytical noise — it is curated signal for decision-makers who operate at the intersection of place, capital, and power.
            </p>

            <div className="h-px bg-[#2a2a2a]/20 mt-8 mb-5" />

            {/* Inline stat */}
            <div className="flex items-baseline gap-3">
              <span className="font-mono font-bold text-[#1a1a1a] text-2xl leading-none">70%</span>
              <span className="font-mono text-[10px] text-[#2a2a2a]/50 uppercase tracking-widest leading-snug">
                of global GDP<br />from 3% of land
              </span>
            </div>
          </div>

          {/* ── COL 2: Trade-Space Nexus sidebar ── */}
          <div className="md:px-8 md:border-r border-[#2a2a2a]/20 py-8 md:py-0 border-t md:border-t-0 border-[#2a2a2a]/20">
            <p className="font-mono text-[10px] tracking-[0.35em] text-[#2a2a2a]/50 uppercase mb-4">
              Focus: The Trade-Space Nexus
            </p>
            <h3 className="font-serif font-bold text-[#1a1a1a] text-xl md:text-2xl leading-[1.2] mb-4 text-balance">
              Dual-Use, Defence, and the New Trans-Atlantic Architecture
            </h3>

            <div className="h-px bg-[#2a2a2a]/20 mb-5" />

            <p className="font-serif text-[#1a1a1a]/70 text-sm leading-[1.75] text-pretty mb-4">
              The most consequential infrastructure being built today operates in the overlap between commercial and strategic. Satellite constellations that serve both logistics and surveillance. Ports that process trade and signal deterrence. Data centres that power AI and underpin command networks.
            </p>
            <p className="font-serif text-[#1a1a1a]/70 text-sm leading-[1.75] text-pretty mb-4">
              Trans-Atlantic trade in this era is no longer simply about tariffs and access. It is about building resilient, trusted supply chains for goods and technologies that matter to national security. Canada and Europe, as mid-size powers with complementary strengths, are uniquely positioned to define the rules of this new nexus.
            </p>

            {/* Ruled theme list */}
            <div className="mt-6 space-y-0">
              {[
                { tag: "Defence", desc: "Allied procurement and interoperability" },
                { tag: "Dual-Use", desc: "Space, AI, advanced materials" },
                { tag: "Trade Corridors", desc: "Port infrastructure and logistics" },
                { tag: "Energy Security", desc: "LNG, critical minerals, grid resilience" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-3 border-t border-[#2a2a2a]/15"
                >
                  <span className="font-mono text-[10px] tracking-widest uppercase text-[#2a2a2a] font-semibold mt-0.5 shrink-0 w-20">
                    {item.tag}
                  </span>
                  <span className="font-serif text-[#1a1a1a]/60 text-[13px] leading-snug">
                    {item.desc}
                  </span>
                </div>
              ))}
              <div className="border-t border-[#2a2a2a]/15" />
            </div>
          </div>

          {/* ── COL 3: From the Editor ── */}
          <div className="md:pl-8 pt-8 md:pt-0 border-t md:border-t-0 border-[#2a2a2a]/20">
            <p className="font-mono text-[10px] tracking-[0.35em] text-[#2a2a2a]/50 uppercase mb-4">
              From the Editor
            </p>

            {/* Editor note box — slight warm tint inset */}
            <div className="border border-[#2a2a2a]/15 bg-[#F5F0E4]/60 p-5">
              <p className="font-serif text-[#1a1a1a]/80 text-sm leading-[1.8] text-pretty mb-4">
                I started CityAge because I believed — and still believe — that the most important decisions in the global economy are made in specific places, by specific people, about specific infrastructure.
              </p>
              <p className="font-serif text-[#1a1a1a]/70 text-sm leading-[1.8] text-pretty mb-4">
                The intelligence industry had become very good at describing the world at altitude. Macroeconomics. Geopolitics. Trend lines. What it was not producing was ground-level institutional clarity: who is building what, where, and why it matters strategically.
              </p>
              <p className="font-serif text-[#1a1a1a]/70 text-sm leading-[1.8] text-pretty">
                That is the gap The Human Touch fills. The 3% Thesis is not a metaphor — it is an operational framework for allocating attention and capital in a world where place still determines outcome.
              </p>

              {/* Signature */}
              <div className="mt-6 pt-4 border-t border-[#2a2a2a]/15">
                <div className="font-serif font-bold text-[#1a1a1a] text-sm italic mb-0.5">
                  The Editor
                </div>
                <div className="font-mono text-[10px] tracking-[0.25em] text-[#2a2a2a]/50 uppercase">
                  thehumantouch.ai
                </div>
              </div>
            </div>

            {/* Archive CTA */}
            <div className="mt-6">
              <a
                href="#"
                className="flex items-center justify-between w-full border border-[#2a2a2a] px-5 py-3 group hover:bg-[#2a2a2a] transition-colors duration-200"
              >
                <span className="font-mono text-[11px] tracking-[0.25em] text-[#2a2a2a] uppercase group-hover:text-[#FDFCF0] transition-colors">
                  Enter the Archive
                </span>
                <span className="font-mono text-[11px] text-[#2a2a2a] group-hover:text-[#FDFCF0] transition-colors">
                  &rarr;
                </span>
              </a>
              <p className="font-mono text-[9px] text-[#2a2a2a]/40 tracking-wider uppercase mt-2 pl-1">
                Reports, Dispatches &amp; Intelligence Briefs
              </p>
            </div>
          </div>

        </div>

        {/* Footer rule */}
        <div className="h-[2px] bg-[#2a2a2a] mt-12 mb-4" />
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-[0.35em] text-[#2a2a2a]/40 uppercase">
            thehumantouch.ai &mdash; The Urban Planet &mdash; Intelligence Journal
          </span>
          <span className="font-mono text-[9px] tracking-[0.25em] text-[#2a2a2a]/40 uppercase">
            cityage.com
          </span>
        </div>

      </div>
    </section>
  )
}
