'use client'

import type { ComponentProps } from 'react'
import { imageDelivery } from '@/lib/image-delivery'

type StaticImage = { src: string; width: number; height: number }
type SiteImageProps = Omit<ComponentProps<'img'>, 'src' | 'srcSet'> & {
  src: string | StaticImage | { default: StaticImage }
  fill?: boolean
  priority?: boolean
  quality?: number
}

/** Native image output only. Resizing belongs to Supabase, never Vercel. */
export default function SiteImage({
  src, fill = false, priority = false, quality, width, height, sizes,
  loading, fetchPriority, decoding = 'async', style, alt = '', ...props
}: SiteImageProps) {
  const asset = typeof src === 'string' ? undefined : 'default' in src ? src.default : src
  const intrinsicWidth = width ?? asset?.width
  const intrinsicHeight = height ?? asset?.height
  const delivery = imageDelivery(typeof src === 'string' ? src : asset!.src, {
    width: fill ? undefined : Number(intrinsicWidth) || undefined,
    quality,
  })

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      {...delivery}
      sizes={delivery.srcSet ? sizes ?? (fill || !intrinsicWidth ? '100vw' : `${intrinsicWidth}px`) : undefined}
      width={fill ? undefined : intrinsicWidth}
      height={fill ? undefined : intrinsicHeight}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      fetchPriority={fetchPriority ?? (priority ? 'high' : undefined)}
      decoding={decoding}
      style={fill ? {
        position: 'absolute', inset: 0, width: '100%', height: '100%', ...style,
      } : style}
    />
  )
}
