import Image from 'next/image'
import Link from 'next/link'

interface ArticleCardProps {
  id: string
  title: string
  vertical: string
  tagline: string | null
  excerpt: string | null
  date: string
  isLead?: boolean
  image?: string
  readTime?: string
  variant?: 'hero-lead' | 'hero-secondary' | 'hero-tertiary' | 'featured-card' | 'category-list' | 'default'
  linkPrefix?: string
  href?: string
}

export function ArticleCard({ id, title, vertical, tagline, excerpt, date, isLead, image, readTime, variant = 'default', linkPrefix = '/dispatches', href: hrefProp }: ArticleCardProps) {
  const href = hrefProp ?? `${linkPrefix}/${id}`

  // Instant Magazine lead — huge black hed. Photo only when a real still exists.
  if (variant === 'hero-lead') {
    return (
      <Link href={href} className="flex flex-col flex-1 group">
        <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-[#C5A059]">
          {vertical}
        </span>
        <h2
          className="font-serif font-black text-[2.6rem] md:text-[3.6rem] leading-[1.04] tracking-tight mt-3 mb-4 group-hover:text-[#1A365D] transition-colors"
          style={{ fontWeight: 900 }}
        >
          {title}
        </h2>
        {tagline && (
          <p className="font-serif text-black/60 text-[17px] leading-[1.6] mb-4">
            {tagline}
          </p>
        )}
        {image ? (
          <div
            className="ca-photo ca-photo-lead w-full relative overflow-hidden bg-gray-100 aspect-[3/4] mt-6"
            style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3 / 4' }}
          >
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="(max-width: 1023px) 92vw, 50vw"
              className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
            />
          </div>
        ) : null}
      </Link>
    )
  }

  // ── HERO SECONDARY: Medium headline with image (or placeholder) ──
  if (variant === 'hero-secondary') {
    return (
      <Link href={href} className="block group">
        {image ? (
          <div
            className="ca-photo ca-photo-well w-full relative overflow-hidden bg-gray-100 aspect-[4/3] mb-5"
            style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4 / 3' }}
          >
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 1023px) 92vw, 25vw"
              className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
            />
          </div>
        ) : (
          <div className="w-full aspect-[4/3] mb-5 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/10">Photograph</span>
          </div>
        )}
        <span className="font-mono text-[12px] font-bold tracking-[0.2em] uppercase text-[#C5A059]">
          {vertical}
        </span>
        <h3 className="font-serif font-normal text-[20px] md:text-[22px] leading-[1.28] tracking-normal mt-2 mb-4 group-hover:text-[#1A365D] transition-colors">
          {title}
        </h3>
        <span className="font-mono text-[12px] tracking-[0.12em] uppercase text-black/60">
          <span className="inline-block w-3 h-3 mr-1 align-[-2px]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></span>
          {readTime}
        </span>
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-[#C5A059] border border-[#C5A059]/40 px-6 py-2 mt-4 inline-block group-hover:bg-[#C5A059] group-hover:text-black transition-all">
          Discover More
        </span>
      </Link>
    )
  }

  // ── HERO TERTIARY: Headline-only, compact ──
  if (variant === 'hero-tertiary') {
    return (
      <Link href={href} className="flex flex-col group">
        <span className="font-mono text-[12px] font-bold tracking-[0.2em] uppercase text-[#C5A059]">
          {vertical}
        </span>
        <h3 className="font-serif font-normal text-[16px] leading-[1.3] tracking-normal mt-2 mb-2 group-hover:text-[#1A365D] transition-colors">
          {title}
        </h3>
        <span className="font-mono text-[12px] tracking-[0.12em] uppercase text-black/60 mt-auto">{readTime}</span>
      </Link>
    )
  }

  // ── FEATURED CARD: Equal-width card with image, category, headline, excerpt ──
  if (variant === 'featured-card') {
    return (
      <Link href={href} className="block group">
        {image ? (
          <div className="w-full relative overflow-hidden bg-gray-100 aspect-[4/3] mb-4">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
            />
          </div>
        ) : (
          <div className="w-full aspect-[4/3] mb-4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/10">Photograph</span>
          </div>
        )}
        <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-black/70">
          {vertical}
        </span>
        <h3 className="font-serif font-bold text-[17px] leading-snug tracking-tight mt-2 mb-2 group-hover:text-[#1A365D] transition-colors">
          {title}
        </h3>
        {(excerpt || tagline) && (
          <p className="font-serif text-black/60 text-[15px] leading-[1.7] mb-2">
            {excerpt || tagline}
          </p>
        )}
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-black/60">
          <span className="inline-block w-3 h-3 mr-1 align-[-2px]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></span>
          {readTime}
        </span>
      </Link>
    )
  }

  // ── CATEGORY LIST: Headline + read time only, very compact ──
  if (variant === 'category-list') {
    return (
      <Link href={href} className="block group">
        <h4 className="font-serif font-bold text-[16px] leading-snug tracking-tight mb-2 group-hover:text-[#1A365D] transition-colors">
          {title}
        </h4>
        <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-black/60">
          <span className="inline-block w-3 h-3 mr-1 align-[-2px]"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg></span>
          {readTime}
        </span>
      </Link>
    )
  }

  // ── DEFAULT: Original card style (fallback) ──
  return (
    <Link
      href={href}
      className="block border-b border-black/10 group bg-[#F9F9F7] hover:bg-white transition-colors"
    >
      {image && (
        <div className={`w-full relative overflow-hidden bg-gray-200 ${isLead ? 'aspect-[16/10]' : 'aspect-video'}`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
          />
        </div>
      )}

      <div className={`${image ? 'px-5 py-4' : 'px-5 py-5'}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-black/70">
            {vertical}
          </span>
        </div>

        <h2 className={`font-serif font-black leading-tight tracking-tight mb-2 group-hover:text-[#1A365D] transition-colors ${isLead ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
          {title}
        </h2>

        {(excerpt || tagline) && (
          <p className={`font-serif text-black/50 leading-relaxed mb-3 ${isLead ? 'text-sm' : 'text-xs'}`}>
            {excerpt || tagline}
          </p>
        )}

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-black/60">
            {date}
          </span>
          {readTime && (
            <>
              <span className="text-black/15 text-[8px]">·</span>
              <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-black/60">
                {readTime}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
