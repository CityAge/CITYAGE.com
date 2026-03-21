'use client'

const navItems = ['Dispatches', 'Space', 'Defence', 'Energy', 'Food Systems', 'Events', 'Partners']

export function Navigation() {
  return (
    <nav className="border-b border-black bg-[#F9F9F7] overflow-x-auto">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex items-center justify-center gap-6 md:gap-10 py-3">
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-[10px] font-black tracking-[0.25em] uppercase text-black/70 hover:text-[#C5A059] transition-colors whitespace-nowrap"
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  )
}
