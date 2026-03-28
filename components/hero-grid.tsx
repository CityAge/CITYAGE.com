interface HeroGridProps {
  leadColumn: React.ReactNode
  middleColumn: React.ReactNode
  sidebarColumn: React.ReactNode
}

export function HeroGrid({ leadColumn, middleColumn, sidebarColumn }: HeroGridProps) {
  return (
    <section className="border-b border-black/10 relative">
      {/* Desktop: 3-column Monocle layout — col 1 sticks, cols 2+3 scroll */}
      <div className="hidden lg:grid lg:grid-cols-[44%_1fr_260px] lg:gap-0 lg:items-start max-w-[1400px] mx-auto">
        
        {/* Column 1: lead feature — sticky, natural height, no forced full-screen */}
        <div className="sticky top-[100px] py-10 px-10">
          {leadColumn}
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
