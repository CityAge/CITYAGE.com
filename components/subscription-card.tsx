export function SubscriptionCard() {
  return (
    <div className="bg-black text-white px-6 md:px-10 py-14">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="md:max-w-md">
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#C5A059] uppercase font-bold">
            Join 25,000+ Leaders
          </span>
          <h3 className="font-serif font-black text-2xl md:text-3xl leading-tight mt-3 mb-3">
            The Influence Letter
          </h3>
          <p className="font-serif text-white/50 text-sm leading-relaxed">
            Daily intelligence briefs on infrastructure, defence, space, energy, and food systems. 
            Delivered before markets open.
          </p>
        </div>

        <div className="w-full md:w-auto">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-[280px] bg-white/10 border border-white/20 px-4 py-2.5 font-mono text-[11px] tracking-wider text-white placeholder-white/30 uppercase outline-none focus:border-[#C5A059] transition-colors"
            />
            <button className="bg-[#C5A059] text-black px-6 py-2.5 font-mono text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white transition-colors shrink-0">
              Join
            </button>
          </div>
          <p className="font-mono text-[8px] tracking-[0.15em] text-white/20 uppercase mt-3">
            Est. 2012 — 100+ Convenings — 50+ Cities
          </p>
        </div>
      </div>
    </div>
  )
}
