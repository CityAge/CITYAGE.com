/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        // dubai.cityage.com → /daybreak/dubai
        {
          source: '/',
          has: [{ type: 'host', value: 'dubai.cityage.com' }],
          destination: '/daybreak/dubai',
        },
        // Future city subdomains follow the same pattern:
        // westvan.cityage.com → /daybreak/westvan
        // beverlyhills.cityage.com → /daybreak/beverlyhills

        // ── FRONT DOOR ──
        // / is the headline front (app/page.tsx).
        // The locked Ink/Cream/Brass build remains at /cityage-FINAL.html.
        // Purpose: locked-design page (overrides the magazine app route)
        {
          source: '/purpose',
          destination: '/purpose.html',
        },
      ],
    }
  },
  async redirects() {
    return [
      // Clean URLs → existing room / locked-design pages
      { source: '/home', destination: '/', permanent: false },
      { source: '/the-next-vancouver', destination: '/next-vancouver.html', permanent: false },
      { source: '/next-vancouver', destination: '/next-vancouver.html', permanent: false },
      { source: '/northern-century', destination: '/northern-century.html', permanent: false },
      { source: '/contributors', destination: '/people.html', permanent: false },
      { source: '/private-advisory', destination: '/advisory.html', permanent: false },
    ]
  },
}

export default nextConfig
