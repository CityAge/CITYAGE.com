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
}

export function ArticleCard({ id, title, vertical, tagline, excerpt, date, isLead, image, readTime, variant = 'default' }: ArticleCardProps) {

  // ── HERO LEAD: Large headline, excerpt, prominent image ──
  if (variant === 'hero-lead') {
    return (
      <Link href={`/dispatches/${id}`} className="block group">
        <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">
          {vertical}
        </span>
        <h2 className="font-serif font-black text-2xl md:text-3xl leading-tight tracking-tight mt-3 mb-4 group-hover:text-[#1A365D] transition-colors">
          {title}
        </h2>
        {(excerpt || tagline) && (
          <p className="font-serif text-black/50 text-sm leading-relaxed mb-5">
            {excerpt || tagline}
          </p>
        )}
        {image && (
          <div className="w-full relative overflow-hidden bg-gray-100 aspect-[16/10] mb-5">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
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

  // ── HERO SECONDARY: Medium headline with optional image ──
  if (variant === 'hero-secondary') {
    return (
      <Link href={`/dispatches/${id}`} className="block group">
        {image && (
          <div className="w-full relative overflow-hidden bg-gray-100 aspect-video mb-4">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        )}
        <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">
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
      <Link href={`/dispatches/${id}`} className="block group flex flex-col">
        <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">
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
      <Link href={`/dispatches/${id}`} className="block group">
        {image && (
          <div className="w-full relative overflow-hidden bg-gray-100 aspect-[4/3] mb-4">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        )}
        <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">
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
      <Link href={`/dispatches/${id}`} className="block group">
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
      href={`/dispatches/${id}`}
      className="block border-b border-black/10 group bg-[#F9F9F7] hover:bg-white transition-colors"
    >
      {image && (
        <div className={`w-full relative overflow-hidden bg-gray-200 ${isLead ? 'aspect-[16/10]' : 'aspect-video'}`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
        </div>
      )}

      <div className={`${image ? 'px-5 py-4' : 'px-5 py-5'}`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">
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
