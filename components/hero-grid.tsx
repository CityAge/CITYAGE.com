interface HeroGridProps {
  leadColumn: React.ReactNode
  middleColumn?: React.ReactNode
  sidebarColumn: React.ReactNode
}

export function HeroGrid({ leadColumn, middleColumn, sidebarColumn }: HeroGridProps) {
  const hasMiddle = Boolean(middleColumn)

  return (
    <section className="border-b border-black/10 relative">
      {/* Desktop: 3-column Monocle well — photographs in the columns, lead sticks */}
      <div
        className={`hidden lg:grid lg:gap-0 lg:items-start max-w-[1400px] mx-auto ${
          hasMiddle ? 'lg:grid-cols-[50%_1fr_1fr]' : 'lg:grid-cols-[minmax(0,1fr)_minmax(280px,42%)]'
        }`}
      >
        <div className="sticky top-[100px] py-10 px-10">{leadColumn}</div>

        {hasMiddle && (
          <div className="border-l border-black/10 px-10 py-10">{middleColumn}</div>
        )}

        <div className="border-l border-black/10 px-8 py-10">{sidebarColumn}</div>
      </div>

      {/* Phone/tablet: two-column newspaper well, thin center rule */}
      <div className="lg:hidden grid grid-cols-2 max-w-[1400px] mx-auto">
        <div className="py-6 pl-4 pr-3 border-r border-black/15">{leadColumn}</div>
        <div className="py-6 pr-4 pl-3">
          {hasMiddle ? <div>{middleColumn}</div> : null}
          <div className={hasMiddle ? 'mt-6' : undefined}>{sidebarColumn}</div>
        </div>
      </div>
    </section>
  )
}
