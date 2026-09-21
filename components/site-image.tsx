"use client"

import NextImage, { type ImageProps } from 'next/image'

/** Already transformed Supabase images must bypass the Next/Vercel optimizer. */
export default function SiteImage(props: ImageProps) {
  const transformed = typeof props.src === 'string' &&
    props.src.includes('/storage/v1/render/image/')
  return <NextImage {...props} unoptimized={transformed || props.unoptimized} />
}
