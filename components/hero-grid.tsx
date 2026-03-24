interface HeroGridProps {
  leadColumn: React.ReactNode
  middleColumn: React.ReactNode
  sidebarColumn: React.ReactNode
}

export function HeroGrid({ leadColumn, middleColumn, sidebarColumn }: HeroGridProps) {
  return (
    <section className="border-b border-black/10 relative">
      {/* Desktop: 3-column Monocle layout — col 1 sticks, cols 2+3 scroll */}
      <div className="hidden lg:grid lg:grid-cols-[38%_1fr_280px] lg:gap-0 max-w-[1400px] mx-auto">
        
        {/* Column 1: lead feature — sticky, pins below compressed header */}
        <div className="relative">
          <div className="sticky top-[124px] py-10 px-10 self-start">
            {leadColumn}
          </div>
        </div>

        {/* Column 2: secondary stories — scrolls naturally */}
        <div className="border-l border-black/10 px-10 py-10">
          {middleColumn}
        </div>

        {/* Column 3: sidebar — Influence Letter + tertiary stories */}
        <div className="border-l border-black/10 px-8 py-10">
          {sidebarColumn}
        </div>
      </div>

      {/* Mobile: stacked, no sticky behaviour */}
      <div className="lg:hidden px-6">
        <div className="py-8">{leadColumn}</div>
        <div className="py-4">{middleColumn}</div>
        <div className="py-4">{sidebarColumn}</div>
      </div>
    </section>
  )
}
