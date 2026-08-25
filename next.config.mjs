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
        // The locked CityAge design (Ink/Cream/Brass) is the site.
        // The magazine build remains intact at its own routes for future use.
        {
          source: '/',
          destination: '/cityage-FINAL.html',
        },
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
      // Clean URLs → locked-design pages
      { source: '/home', destination: '/', permanent: false },
      { source: '/the-next-vancouver', destination: '/next-vancouver.html', permanent: false },
      { source: '/contributors', destination: '/people.html', permanent: false },
      { source: '/private-advisory', destination: '/advisory.html', permanent: false },
      { source: '/studio', destination: '/#studio', permanent: false },
      { source: '/partnerships', destination: '/partnerships.html', permanent: false },
      { source: '/forums', destination: '/#forums', permanent: false },
    ]
  },
}

export default nextConfig
