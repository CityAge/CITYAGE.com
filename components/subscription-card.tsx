export function SubscriptionCard() {
  return (
    <div className="border-b border-black p-6 md:p-8 bg-black text-white">
      <div className="mb-4">
        <span className="font-mono text-[10px] tracking-[0.3em] text-[#C5A059] uppercase font-bold">
          Join 25,000+ Leaders
        </span>
      </div>
      
      <h3 className="font-serif font-black text-2xl md:text-3xl leading-tight mb-4">
        The Influence Letter
      </h3>
      
      <p className="font-serif text-white/60 text-sm leading-relaxed mb-6">
        Daily intelligence briefs on infrastructure, defence, space, energy, and food systems. 
        Delivered before markets open.
      </p>

      <div className="flex gap-2">
        <input
          type="email"
          placeholder="your@email.com"
          className="flex-1 bg-white/10 border border-white/20 px-4 py-2.5 font-mono text-[11px] tracking-wider text-white placeholder-white/30 uppercase outline-none focus:border-[#C5A059] transition-colors"
        />
        <button className="bg-[#C5A059] text-black px-6 py-2.5 font-mono text-[10px] font-black tracking-[0.2em] uppercase hover:bg-white transition-colors shrink-0">
          Join
        </button>
      </div>

      <p className="font-mono text-[8px] tracking-[0.15em] text-white/20 uppercase mt-3">
        Est. 2012 — 100+ Convenings — 50+ Cities
      </p>
    </div>
  )
}
