import Image from 'next/image'
import Link from 'next/link'

export type HouseEntry = {
  image: string
  headline: string
  body: string
  cta: string
  href: string
}

/**
 * The house tile at the top of column three. Every entry is in the HTML;
 * an inline script picks one before first paint so the tile rotates per
 * page load with no hydration mismatch and no layout shift. Without JS
 * the first entry shows.
 */
export function HouseTile({ entries }: { entries: HouseEntry[] }) {
  const id = 'house-tile'
  const pick = `(function(){var n=${entries.length};var e=document.getElementById('${id}');if(e)e.setAttribute('data-pick',String(Math.floor(Math.random()*n)));})();`

  return (
    <div id={id} data-pick="0" className="house-tile border border-[#D9D7D0] p-6">
      <style>{`
        .house-tile > article { display: none; }
        ${entries.map((_, i) => `.house-tile[data-pick="${i}"] > article:nth-of-type(${i + 1}) { display: block; }`).join('\n        ')}
      `}</style>
      {entries.map((entry) => (
        <article key={entry.href}>
          <span className="type-kicker block">From CityAge</span>
          <Link href={entry.href} className="block mt-4" tabIndex={-1} aria-hidden="true">
            <div
              className="ca-photo relative w-full overflow-hidden bg-[#EFEDE6] aspect-[16/10]"
              style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16 / 10' }}
            >
              <Image src={entry.image} alt="" fill sizes="(max-width: 1023px) 50vw, 25vw" className="object-cover" />
            </div>
          </Link>
          <h3 className="type-rail-h mt-4">{entry.headline}</h3>
          <p className="font-serif text-[15px] leading-[1.5] text-black/80 mt-2">{entry.body}</p>
          <Link href={entry.href} className="story-link inline-block font-serif text-[12px] leading-none uppercase tracking-[0.12em] mt-4">
            {entry.cta}
          </Link>
        </article>
      ))}
      <script dangerouslySetInnerHTML={{ __html: pick }} />
    </div>
  )
}
