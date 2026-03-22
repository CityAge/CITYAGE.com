'use client'

const sections = [
  { name: 'Power', sub: ['Defence', 'Trade', 'Governance', 'Diplomacy'] },
  { name: 'Money', sub: ['Markets', 'Investment', 'Real Estate', 'Infrastructure Finance'] },
  { name: 'Cities', sub: ['Mobility', 'Infrastructure', 'Housing', 'Architecture'] },
  { name: 'Frontiers', sub: ['Space', 'AI & Tech', 'Energy', 'Oceans', 'Health'] },
  { name: 'Culture', sub: ['Design', 'Urban Life', 'Film & Media', 'Food', 'Tourism'] },
]

export function Navigation() {
  return (
    <nav className="border-b border-black/20 bg-[#F9F9F7] overflow-x-auto">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 flex items-center justify-start md:justify-center gap-0 min-w-max md:min-w-0">
        {sections.map((section, i) => (
          <div key={section.name} className="relative group">
            <a
              href={`#${section.name.toLowerCase()}`}
              className={`flex items-center gap-1 px-4 md:px-6 py-3 text-[11px] font-black tracking-[0.25em] uppercase hover:text-[#C5A059] transition-colors ${i === sections.length - 1 ? 'text-[#C5A059]' : 'text-black/70'}`}
            >
              {section.name}
              {section.sub && (
                <svg className="w-2.5 h-2.5 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </a>
            {/* Dropdown */}
            {section.sub && (
              <div className="absolute top-full left-0 bg-white border border-black shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[180px]">
                {section.sub.map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-5 py-2.5 text-[11px] tracking-[0.15em] uppercase text-black/60 hover:text-[#C5A059] hover:bg-[#F9F9F7] transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  )
}
