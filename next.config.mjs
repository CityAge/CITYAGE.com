/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
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
        { source: '/northern-century', destination: '/northern-century.html' },
        { source: '/next-vancouver', destination: '/next-vancouver.html' },
        { source: '/advisory', destination: '/advisory.html' },
        { source: '/contact', destination: '/contact.html' },
      ],
    }
  },
  async redirects() {
    return [
      // Clean URLs → locked-design pages
      { source: '/home', destination: '/', permanent: false },
      { source: '/the-next-vancouver', destination: '/next-vancouver', permanent: false },
      { source: '/contributors', destination: '/people', permanent: false },
      { source: '/private-advisory', destination: '/advisory', permanent: false },
    ]
  },
}

export default nextConfig
