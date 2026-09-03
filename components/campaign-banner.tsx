import Image from 'next/image'

type CampaignBannerProps = {
  image?: string
  /** Tailwind object-position class for the crop, e.g. 'object-[center_40%]'. */
  crop?: string
  heading?: string
  italic?: string
  href?: string
  priority?: boolean
  /** Small mono line above the heading. Off by default. */
  kicker?: string
  /** Render the heading as the page h1 (franchise pages). Door plates keep a span. */
  headingAs?: 'span' | 'h1'
  /** Show the Apply for an invitation button. Door plates keep it. */
  cta?: boolean
}

/** Event plate. One treatment, one height, for every room on the door. */
export function CampaignBanner({
  image = '/vancouver-banner.jpg',
  crop = 'object-[center_40%]',
  heading = 'The Next West.',
  italic = 'Coming to Vancouver, Winter 2026.',
  href = '/the-next-west',
  priority = true,
  kicker,
  headingAs = 'span',
  cta = true,
}: CampaignBannerProps = {}) {
  const Heading = headingAs
  return (
    <div className="bg-[#F9F9F7] pt-2 pb-2 md:pt-5 md:pb-4">
      <div
        className="ca-photo ca-photo-banner relative mx-auto w-[min(1000px,calc(100%-3rem))] h-[128px] md:h-[240px] overflow-hidden"
        style={{ position: 'relative', overflow: 'hidden' }}
      >
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 1060px) calc(100vw - 3rem), 1000px"
          className={`object-cover ${crop}`}
          priority={priority}
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8">
          {kicker ? (
            <span className="font-mono text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059] mb-2 md:mb-3">
              {kicker}
            </span>
          ) : null}
          <Heading className="font-serif font-normal text-[28px] md:text-[42px] text-white tracking-tight leading-none m-0">
            {heading}
          </Heading>
          <span className="font-serif italic text-[12px] md:text-[17px] text-white/85 mt-1 md:mt-2 leading-snug">
            {italic}
          </span>
          {cta ? (
            <a
              href={href}
              className="mt-2 md:mt-3 inline-block border border-white/90 text-white px-3 py-1 md:px-4 md:py-1.5 text-[9px] md:text-[11px] font-black tracking-[0.14em] uppercase hover:bg-white hover:text-black transition-colors"
            >
              Apply for an invitation
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
