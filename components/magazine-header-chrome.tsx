// Compact sticky: masthead(py-2) + nav. Used as a swap after the large mark is gone.
export const HEADER_COMPRESSED_HEIGHT = 124

/** One CITYAGE drawing — door and Studio share this. No second face. */
export const WORDMARK_TYPE =
  'font-serif font-black uppercase monocle-wordmark tracking-[0.035em] leading-[0.85]'

export const WORDMARK_LARGE = `${WORDMARK_TYPE} text-black text-[2.25rem] md:text-[4rem] lg:text-[5.5rem] xl:text-[6rem]`
export const WORDMARK_COMPACT = `${WORDMARK_TYPE} text-black text-2xl md:text-3xl`

/** Same compact mark as the door, white on ink. */
export const WORDMARK_COMPACT_ON_INK = `${WORDMARK_TYPE} text-white text-2xl md:text-3xl`

export function VerticalNav() {
  return (
    <div className="border-b-2 border-black px-4 md:px-12">
      <div className="max-w-[1400px] mx-auto flex items-center justify-center overflow-x-auto md:overflow-visible">
        {['Power', 'Money', 'Cities', 'Frontiers', 'Culture'].map((name, i) => (
          <div key={name} className="flex items-center shrink-0">
            {i > 0 && <span className="text-black/60 mx-4 md:mx-6 text-base font-normal">|</span>}
            <a
              href={`#${name.toLowerCase()}`}
              className="px-3 md:px-5 py-4 text-[14px] md:text-[16px] font-black tracking-[0.15em] uppercase text-black hover:opacity-50 transition-opacity"
            >
              {name}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
