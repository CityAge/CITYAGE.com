interface HeroGridProps {
  leadColumn: React.ReactNode
  middleColumn?: React.ReactNode
  sidebarColumn: React.ReactNode
}

export function HeroGrid({ leadColumn, middleColumn, sidebarColumn }: HeroGridProps) {
  const hasMiddle = Boolean(middleColumn)

  return (
    <section className="border-b border-black/10 relative">
      {/* First issue is two plates (lead + letter). Keep the three-col well if a middle stack returns. */}
      <div
        className={`hidden lg:grid lg:gap-0 lg:items-start max-w-[1400px] mx-auto ${
          hasMiddle ? 'lg:grid-cols-[50%_1fr_1fr]' : 'lg:grid-cols-[minmax(0,1fr)_380px]'
        }`}
      >
        <div className="sticky top-[100px] py-10 px-10">
          {leadColumn}
        </div>

        {hasMiddle && (
          <div className="border-l border-black/10 px-10 py-10">
            {middleColumn}
          </div>
        )}

        <div className="border-l border-black/10 px-8 py-10">
          {sidebarColumn}
        </div>
      </div>

      <div className="lg:hidden px-6">
        <div className="py-8">{leadColumn}</div>
        {hasMiddle && <div className="py-4">{middleColumn}</div>}
        <div className="py-4">{sidebarColumn}</div>
      </div>
    </section>
  )
}
