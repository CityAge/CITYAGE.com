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
      ],
    }
  },
  async redirects() {
    return [
      { source: '/people', destination: '/people.html', permanent: false },
      { source: '/contributors', destination: '/people.html', permanent: false },
      { source: '/northern-century', destination: '/northern-century.html', permanent: false },
      { source: '/next-vancouver', destination: '/next-vancouver.html', permanent: false },
      { source: '/the-next-vancouver', destination: '/next-vancouver.html', permanent: false },
      { source: '/partnerships', destination: '/partnerships.html', permanent: false },
    ]
  },
}

export default nextConfig
