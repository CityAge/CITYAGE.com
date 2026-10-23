/** Strip legacy optimizer wrappers, including URLs supplied by content. */
export function directImageSource(source: string): string {
  let src = source
  for (let i = 0; i < 5; i++) {
    let url: URL
    try { url = new URL(src, 'https://cityagemag.vercel.app') } catch { return src }
    if (url.pathname !== '/_next/image') return src
    const original = url.searchParams.get('url')
    if (!original || original === src) return ''
    src = original
  }
  return ''
}

/**
 * Only public Supabase originals are transformed. Existing transforms (notably
 * 220×264 speaker crops), signed URLs, SVG/GIF, local and other remote assets
 * retain their direct URL. No uploads or alternative storage locations assumed.
 */
export function imageDelivery(
  source: string,
  { width, quality = 70 }: { width?: number; quality?: number } = {},
): { src: string; srcSet?: string } {
  const src = directImageSource(source)
  let url: URL
  try { url = new URL(src) } catch { return { src } }
  if (!url.hostname.endsWith('.supabase.co') ||
      !url.pathname.startsWith('/storage/v1/object/public/') ||
      /\.(svg|gif)$/i.test(url.pathname)) return { src }

  url.pathname = url.pathname.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/')
  const clamp = (n: number) => Math.min(2500, Math.max(1, Math.round(n)))
  const fixed = width && Number.isFinite(width) && width > 0 ? clamp(width) : undefined
  const widths = fixed ? [...new Set([fixed, clamp(fixed * 2)])] : [320, 640, 960, 1280, 1600]
  url.searchParams.set('quality', String(Math.min(100, Math.max(20, Math.round(quality)))))
  const atWidth = (w: number) => {
    url.searchParams.set('width', String(w))
    return url.toString()
  }
  return {
    src: atWidth(fixed ?? 960),
    srcSet: widths.map((w) => `${atWidth(w)} ${w}w`).join(', '),
  }
}
