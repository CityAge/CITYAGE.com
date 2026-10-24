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
          <div className="border-l border-[#D9D7D0] px-10 py-10">{middleColumn}</div>
        )}

        <div className="border-l border-[#D9D7D0] px-8 py-10">{sidebarColumn}</div>
      </div>

      {/* Phone: one column, lead first. Tablet: two-column newspaper well, thin center rule */}
      <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 max-w-[1400px] mx-auto">
        <div className="pt-6 pb-7 px-4 border-b border-[#D9D7D0] md:pb-6 md:pl-4 md:pr-3 md:border-b-0 md:border-r">{leadColumn}</div>
        <div className="py-6 px-4 md:pr-4 md:pl-3">
          {hasMiddle ? <div>{middleColumn}</div> : null}
          <div className={hasMiddle ? 'mt-7 pt-7 border-t border-[#D9D7D0]' : undefined}>{sidebarColumn}</div>
        </div>
      </div>
    </section>
  )
}
