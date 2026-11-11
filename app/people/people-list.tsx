import type { SpeakerFace } from '@/lib/speakers'

/**
 * Everyone on the CityAge stage, A to Z, as plain text under the reels.
 * The reels show faces a few at a time; this is the whole list in one place,
 * for readers who want to scroll it and for Google, which reads names here
 * that it cannot read off a moving reel. Rendered on the server.
 */
export function PeopleList({ speakers }: { speakers: SpeakerFace[] }) {
  // One line per person: skip test rows, and fold "AARON LEIBTAG" into "Aaron Leibtag".
  const byName = new Map<string, SpeakerFace>()
  for (const speaker of speakers) {
    const name = speaker.name.trim()
    if (!name || /^[_\W]/.test(name.normalize('NFD'))) continue
    const key = name.toLowerCase().replace(/\s+/g, ' ')
    const kept = byName.get(key)
    if (!kept || (kept.name === kept.name.toUpperCase() && name !== name.toUpperCase())) byName.set(key, speaker)
  }
  const sorted = [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }))
  const groups = new Map<string, SpeakerFace[]>()
  for (const speaker of sorted) {
    // "Émeline" files under E.
    const first = speaker.name.trim().normalize('NFD').charAt(0).toUpperCase()
    const letter = /[A-Z]/.test(first) ? first : '#'
    groups.set(letter, [...(groups.get(letter) ?? []), speaker])
  }
  const letters = [...groups.keys()]
  if (letters.length === 0) return null

  return (
    <section id="people-list" aria-labelledby="people-list-heading" className="bg-[#F9F9F7] border-t border-black">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-14 md:py-20">
        <span className="type-kicker block mb-4">A to Z</span>
        <h2 id="people-list-heading" className="type-title tracking-tight text-black mb-6">
          Everyone on the CityAge stage.
        </h2>
        <nav aria-label="Jump to a letter" className="flex flex-wrap gap-x-4 gap-y-2 border-y border-[#D9D7D0] py-4 mb-10">
          {letters.map((letter) => (
            <a key={letter} href={`#people-${letter === '#' ? 'other' : letter}`} className="type-meta text-black hover:underline underline-offset-4">
              {letter}
            </a>
          ))}
        </nav>
        {letters.map((letter) => (
          <div key={letter} id={`people-${letter === '#' ? 'other' : letter}`} className="mb-12 scroll-mt-32">
            <h3 className="type-section text-black border-b border-black pb-2 mb-5">{letter}</h3>
            <ul className="columns-1 sm:columns-2 lg:columns-3 gap-x-10">
              {groups.get(letter)!.map((speaker) => (
                <li key={speaker.id} className="break-inside-avoid py-1.5 font-serif text-[16px] leading-[1.4] text-black">
                  {speaker.linkedin_url ? (
                    <a href={speaker.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
                      {speaker.name}
                    </a>
                  ) : (
                    speaker.name
                  )}
                  {speaker.organisation ? <span className="text-black/55">, {speaker.organisation}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
