/** @type {import('next').NextConfig} */
/**
 * The old WordPress site lives on at archive.cityage.com (Hostinger). Any address
 * the new site does not have is fetched from there behind the scenes, so every old
 * page, image and PDF keeps its cityage.com address. Old pages name cityage.com as
 * their official address, so Google sees no duplicate.
 */
const ARCHIVE = 'https://archive.cityage.com'

/** New pages: an old-style address with a trailing slash goes to the clean one. */
const NEW_PAGES = 'power|money|cities|frontiers|culture|people|the-next-west|studio|partners|purpose|subscribe|contact|privacy|search|ai-policy'

const nextConfig = {
  // Old addresses end in "/". Keep them exactly as they are, so they reach the archive unchanged.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rniqmxpmtqmnwqtawlnz.supabase.co',
        pathname: '/storage/v1/**',
      },
    ],
    imageSizes: [48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  async rewrites() {
    return {
      afterFiles: [
        // Legacy static pages in public/ served at clean URLs
        { source: '/next-vancouver', destination: '/next-vancouver.html' },
      ],
      // Only when nothing on the new site matches: the old page, from the archive.
      fallback: [
        // First the frozen copy saved on Vercel (public/__archive), so visitors and Google
        // never wait on Hostinger; only pages missing from the copy are fetched live.
        { source: '/:path+/', destination: '/__archive/:path+/index.html' },
        { source: '/:path+/', destination: `${ARCHIVE}/:path+/` },
        { source: '/:path+', destination: `${ARCHIVE}/:path+` },
      ],
    }
  },
  // Old pages pass through Vercel; keep a copy at Vercel's edge for a day so Hostinger
  // is asked once, not on every visit (Hostinger throttles bursts from Vercel).
  async headers() {
    return [
      // The frozen copy is only meant to be seen at the old addresses, never at /__archive.
      {
        source: '/__archive/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
      },
      {
        source: '/:path+/',
        headers: [{ key: 'Vercel-CDN-Cache-Control', value: 's-maxage=86400, stale-while-revalidate=604800' }],
      },
    ]
  },
  async redirects() {
    return [
      // The old pages' images, styles and scripts load straight from the archive, not through
      // Vercel: one old page needs ~60 files, and Hostinger refuses bursts from Vercel's servers.
      { source: '/wp-content/:path*', destination: `${ARCHIVE}/wp-content/:path*`, permanent: false },
      { source: '/wp-includes/:path*', destination: `${ARCHIVE}/wp-includes/:path*`, permanent: false },

      // Clean URLs → locked-design pages
      { source: '/home', destination: '/', permanent: false },
      { source: '/the-next-vancouver', destination: '/next-vancouver', permanent: false },
      { source: '/contributors', destination: '/people', permanent: false },

      // Old pages that the new site replaces: forwarded permanently, so their Google standing moves across.
      { source: '/about-us/purpose/', destination: '/purpose', permanent: true },
      { source: '/about-us/', destination: '/purpose', permanent: true },
      { source: '/cityage-studio/', destination: '/studio', permanent: true },
      { source: '/knowledge-partners/', destination: '/partners', permanent: true },
      { source: '/privacy-policy/', destination: '/privacy', permanent: true },
      { source: '/events/the-next-vancouver/', destination: '/the-next-west', permanent: true },
      { source: '/forms/speakers/', destination: '/contact', permanent: true },
      { source: '/forms/', destination: '/contact', permanent: true },
      { source: '/do-you-want-to-do-something-knowledge-partner-inquiry/', destination: '/contact', permanent: true },
      { source: '/home-news/', destination: '/', permanent: true },

      // A trailing slash on a new page or story goes to the clean address.
      { source: `/:page(${NEW_PAGES})/`, destination: '/:page', permanent: true },
      { source: '/magazine/:slug/', destination: '/magazine/:slug', permanent: true },
      { source: '/frontiers/:slug/', destination: '/frontiers/:slug', permanent: true },
    ]
  },
}

export default nextConfig
