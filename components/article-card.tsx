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
}

export function ArticleCard({ id, title, vertical, tagline, excerpt, date, isLead, image, readTime, variant = 'default', linkPrefix = '/dispatches' }: ArticleCardProps) {
  const href = `${linkPrefix}/${id}`

  // ── HERO LEAD: Large headline, image, then excerpt ──
  if (variant === 'hero-lead') {
    return (
      <Link href={href} className="block group">
        <span className="font-mono text-[10px] font-bold tracking-[0.25em] uppercase text-black/70">
          {vertical}
        </span>
        <h2 className="font-serif font-black text-2xl md:text-[2.5rem] leading-[1.1] tracking-tight mt-3 mb-4 group-hover:text-[#1A365D] transition-colors">
          {title}
        </h2>
        {(excerpt || tagline) && (
          <p className="font-serif text-black/50 text-[15px] leading-[1.6] mb-5">
            {excerpt || tagline}
          </p>
        )}
        {image ? (
          <div className="w-full relative overflow-hidden bg-gray-100 aspect-[16/9] mb-4">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
            />
          </div>
        ) : (
          <div className="w-full aspect-[16/9] mb-4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/10">Photograph</span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">{date}</span>
          {readTime && (
            <>
              <span className="text-black/15 text-[8px]">·</span>
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">{readTime}</span>
            </>
          )}
        </div>
      </Link>
    )
  }

  // ── HERO SECONDARY: Medium headline with image (or placeholder) ──
  if (variant === 'hero-secondary') {
    return (
      <Link href={href} className="block group">
        {image ? (
          <div className="w-full relative overflow-hidden bg-gray-100 aspect-video mb-4">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
            />
          </div>
        ) : (
          <div className="w-full aspect-video mb-4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/10">Photograph</span>
          </div>
        )}
        <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-black/70">
          {vertical}
        </span>
        <h3 className="font-serif font-bold text-lg leading-snug tracking-tight mt-2 mb-3 group-hover:text-[#1A365D] transition-colors">
          {title}
        </h3>
        {(excerpt || tagline) && (
          <p className="font-serif text-black/45 text-[13px] leading-relaxed mb-3">
            {excerpt || tagline}
          </p>
        )}
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">{readTime}</span>
      </Link>
    )
  }

  // ── HERO TERTIARY: Headline-only, compact ──
  if (variant === 'hero-tertiary') {
    return (
      <Link href={href} className="flex flex-col group">
        <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-black/70">
          {vertical}
        </span>
        <h3 className="font-serif font-bold text-base leading-snug tracking-tight mt-2 mb-2 group-hover:text-[#1A365D] transition-colors">
          {title}
        </h3>
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30 mt-auto">{readTime}</span>
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
              className="object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
            />
          </div>
        ) : (
          <div className="w-full aspect-[4/3] mb-4 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/10">Photograph</span>
          </div>
        )}
        <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-black/70">
          {vertical}
        </span>
        <h3 className="font-serif font-bold text-[15px] leading-snug tracking-tight mt-2 mb-2 group-hover:text-[#1A365D] transition-colors">
          {title}
        </h3>
        {(excerpt || tagline) && (
          <p className="font-serif text-black/45 text-xs leading-relaxed mb-2">
            {(excerpt || tagline || '').slice(0, 100)}{(excerpt || tagline || '').length > 100 ? '…' : ''}
          </p>
        )}
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">{readTime}</span>
      </Link>
    )
  }

  // ── CATEGORY LIST: Headline + read time only, very compact ──
  if (variant === 'category-list') {
    return (
      <Link href={href} className="block group">
        <h4 className="font-serif font-bold text-[15px] leading-snug tracking-tight mb-2 group-hover:text-[#1A365D] transition-colors">
          {title}
        </h4>
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">{readTime}</span>
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
            className="object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
          />
        </div>
      )}

      <div className={`${image ? 'px-5 py-4' : 'px-5 py-5'}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-black/70">
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
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">
            {date}
          </span>
          {readTime && (
            <>
              <span className="text-black/15 text-[8px]">·</span>
              <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/30">
                {readTime}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
