import { ArrowUpRight } from "lucide-react"

const dispatches = [
  {
    location: "FROM OTTAWA",
    date: "MAR 12, 2026",
    headline: "Federal Infrastructure Bill Signals New Era for Northern Corridors",
    excerpt: "The proposed $42B investment in transportation networks marks a strategic pivot toward climate-resilient urban planning.",
    category: "POLICY",
  },
  {
    location: "FROM ROTTERDAM",
    date: "MAR 11, 2026",
    headline: "Port Authority Unveils Autonomous Cargo Systems at Scale",
    excerpt: "Europe's largest port achieves 94% automation in container handling, setting new benchmarks for global trade efficiency.",
    category: "LOGISTICS",
  },
  {
    location: "FROM SINGAPORE",
    date: "MAR 10, 2026",
    headline: "Vertical Farming Networks Reach Commercial Viability",
    excerpt: "City-state's urban agriculture initiative now supplies 30% of leafy vegetables, challenging traditional supply chain models.",
    category: "AGRICULTURE",
  },
  {
    location: "FROM NAIROBI",
    date: "MAR 09, 2026",
    headline: "Digital Payment Rails Transform East African Commerce",
    excerpt: "Cross-border transaction volumes surge 340% as mobile-first infrastructure bypasses traditional banking limitations.",
    category: "FINANCE",
  },
  {
    location: "FROM TOKYO",
    date: "MAR 08, 2026",
    headline: "Earthquake-Resilient Construction Standards Adopted Globally",
    excerpt: "Japanese engineering protocols become international template following successful deployment across Pacific Ring nations.",
    category: "ENGINEERING",
  },
  {
    location: "FROM SÃO PAULO",
    date: "MAR 07, 2026",
    headline: "Carbon Credit Markets Mature in Latin American Megacities",
    excerpt: "Municipal trading platforms enable neighborhood-level environmental accounting, creating new asset classes.",
    category: "CLIMATE",
  },
]

export function Dispatches() {
  return (
    <section id="dispatches" className="py-24 bg-dark-elevated">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12 pb-6 border-b border-gold/20">
          <div>
            <span className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-2 block">
              Intelligence Briefings
            </span>
            <h3 className="text-cream text-3xl md:text-4xl font-bold">
              The Dispatches
            </h3>
          </div>
          <div className="hidden md:block font-mono text-xs text-cream/40 tracking-wider">
            UPDATED DAILY AT 06:00 UTC
          </div>
        </div>
        
        {/* Dispatches Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dispatches.map((dispatch, index) => (
            <article 
              key={index}
              className="group bg-dark border border-border hover:border-gold/40 transition-colors p-6 flex flex-col"
            >
              {/* Location Tag */}
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-gold font-semibold tracking-wider">
                  {dispatch.location}
                </span>
                <span className="font-mono text-[10px] text-cream/40 tracking-wider">
                  {dispatch.date}
                </span>
              </div>
              
              {/* Headline */}
              <h4 className="text-cream text-lg font-semibold leading-tight mb-3 group-hover:text-gold transition-colors">
                {dispatch.headline}
              </h4>
              
              {/* Excerpt */}
              <p className="text-cream/60 text-sm leading-relaxed mb-4 flex-grow">
                {dispatch.excerpt}
              </p>
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="font-mono text-[10px] text-gold/60 tracking-widest">
                  {dispatch.category}
                </span>
                <ArrowUpRight className="w-4 h-4 text-cream/40 group-hover:text-gold transition-colors" />
              </div>
            </article>
          ))}
        </div>
        
        {/* View All */}
        <div className="mt-12 text-center">
          <button className="font-mono text-xs text-gold tracking-widest uppercase hover:text-gold/80 transition-colors inline-flex items-center gap-2">
            View All Dispatches
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </section>
  )
}
