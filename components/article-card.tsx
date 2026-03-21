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
}

export function ArticleCard({ id, title, vertical, tagline, excerpt, date, isLead, image, readTime }: ArticleCardProps) {
  return (
    <Link
      href={`/dispatches/${id}`}
      className="block border-b border-black group bg-[#F9F9F7] hover:bg-white transition-colors"
    >
      {/* Image for lead articles */}
      {image && (
        <div className={`w-full relative overflow-hidden bg-gray-200 ${isLead ? 'aspect-[16/10]' : 'aspect-video'}`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        </div>
      )}

      <div className={`${image ? 'px-5 py-4' : 'px-5 py-5'}`}>
        {/* Vertical + date row */}
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[9px] font-bold tracking-[0.25em] uppercase text-[#C5A059]">
            {vertical}
          </span>
        </div>

        {/* Headline */}
        <h2 className={`font-serif font-black leading-tight tracking-tight mb-2 group-hover:text-[#1A365D] transition-colors ${isLead ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
          {title}
        </h2>

        {/* Excerpt or tagline */}
        {(excerpt || tagline) && (
          <p className={`font-serif text-black/50 leading-relaxed mb-3 ${isLead ? 'text-sm' : 'text-xs'}`}>
            {excerpt || tagline}
          </p>
        )}

        {/* Footer: date + read time */}
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
