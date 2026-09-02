// Compact sticky: masthead(py-2) + nav. Used as a swap after the large mark is gone.
export const HEADER_COMPRESSED_HEIGHT = 124

/** Official drawn mark — C and A stand taller. Not a web-font CITYAGE. */
export const LOGO_BLACK = '/logo-ca-black.png'
export const LOGO_WHITE = '/logo-ca-white.png'

const LOGO_LARGE_CLASS =
  'block h-auto w-[min(63vw,31.5rem)] lg:w-[min(88vw,31.5rem)]'
const LOGO_COMPACT_CLASS = 'block h-7 w-auto md:h-8'

export function CityAgeMark({
  tone,
  size,
  id,
}: {
  tone: 'cream' | 'ink'
  size: 'large' | 'compact'
  id?: string
}) {
  const src = tone === 'cream' ? LOGO_BLACK : LOGO_WHITE
  return (
    <a id={id} href="/" className="inline-flex items-center justify-center">
      <img
        src={src}
        alt="CITYAGE"
        width={517}
        height={119}
        className={size === 'large' ? LOGO_LARGE_CLASS : LOGO_COMPACT_CLASS}
        decoding="async"
        fetchPriority={size === 'large' ? 'high' : 'low'}
      />
    </a>
  )
}

export function VerticalNav({ hideOnPhone = false }: { hideOnPhone?: boolean } = {}) {
  return (
    <div className={`border-b-2 border-black${hideOnPhone ? ' max-lg:hidden' : ''}`}>
      <div className="ca-rail max-w-[1400px] mx-auto flex items-center justify-start lg:justify-center overflow-x-auto lg:overflow-visible px-4 md:px-12">
        {['Power', 'Money', 'Cities', 'Frontiers', 'Culture'].map((name, i) => (
          <div key={name} className="flex items-center shrink-0">
            {i > 0 && <span className="text-black/60 mx-2.5 md:mx-6 text-base font-normal">|</span>}
            <a
              href={`/${name.toLowerCase()}`}
              className="px-2.5 md:px-5 py-4 text-[13px] md:text-[16px] font-black tracking-[0.15em] uppercase text-black hover:opacity-50 transition-opacity"
            >
              {name}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
