import Image from 'next/image'
import Link from 'next/link'

interface ArticleCardProps {
  id: string
  title: string
  vertical: string
  tagline: string | null
  date: string
  isFirstInColumn?: boolean
  image?: string
}

export function ArticleCard({ id, title, vertical, tagline, date, isFirstInColumn, image }: ArticleCardProps) {
  return (
    <Link
      href={`/dispatches/${id}`}
      className="block border-b border-black p-6 md:p-8 hover:bg-white transition-colors group bg-[#F9F9F7]"
    >
      {/* Vertical label */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase text-black/40">
          {vertical}
        </span>
        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/25">
          {date}
        </span>
      </div>

      {/* Image for first card in column */}
      {isFirstInColumn && image && (
        <div className="w-full aspect-video relative overflow-hidden bg-gray-200 mb-5">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        </div>
      )}

      {/* Headline */}
      <h2 className={`font-serif font-black leading-tight tracking-tight mb-3 group-hover:text-[#1A365D] transition-colors ${isFirstInColumn ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
        {title}
      </h2>

      {/* Tagline */}
      {tagline && (
        <p className="font-serif italic text-black/50 text-sm leading-relaxed mb-4">
          {tagline}
        </p>
      )}

      {/* Read CTA */}
      <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#C5A059] group-hover:underline">
        Read Dispatch →
      </span>
    </Link>
  )
}
