interface HeroGridProps {
  leadColumn: React.ReactNode
  middleColumn: React.ReactNode
  sidebarColumn: React.ReactNode
}

export function HeroGrid({ leadColumn, middleColumn, sidebarColumn }: HeroGridProps) {
  return (
    <section className="border-b border-black/10 relative">
      <div className="max-w-[1400px] mx-auto lg:grid lg:grid-cols-[50%_1fr_1fr] lg:gap-0 lg:items-start">
        <div className="px-6 py-8 lg:sticky lg:top-[100px] lg:py-10 lg:px-10">
          {leadColumn}
        </div>
        <div className="px-6 py-4 lg:border-l lg:border-black/10 lg:px-10 lg:py-10">
          {middleColumn}
        </div>
        <div className="px-6 py-4 lg:border-l lg:border-black/10 lg:px-8 lg:py-10">
          {sidebarColumn}
        </div>
      </div>
    </section>
  )
}
