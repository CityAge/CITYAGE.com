import Image from '@/components/site-image'

/** Hosts listed in next.config.mjs images.remotePatterns; only these can go through the resizer. */
const RESIZABLE_HOSTS = new Set(['rniqmxpmtqmnwqtawlnz.supabase.co', 'images.unsplash.com'])

function canResize(src: string): boolean {
  if (src.startsWith('/')) return true
  try {
    return RESIZABLE_HOSTS.has(new URL(src).hostname)
  } catch {
    return false
  }
}

/**
 * A story picture that fills its (positioned, aspect-ratio) wrapper. Pictures on hosts the
 * resizer knows are served at the size the page needs; any other host falls back to a plain img.
 */
export function StoryImage({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string
  alt: string
  sizes: string
  priority?: boolean
}) {
  if (canResize(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="object-cover"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}
