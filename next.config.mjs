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
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'rniqmxpmtqmnwqtawlnz.supabase.co',
        pathname: '/storage/v1/render/image/public/**',
      },
    ],
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
      { source: '/cityage-studio', destination: '/studio', permanent: false },
      { source: '/cityage-studio/', destination: '/studio', permanent: false },
    ]
  },
}

export default nextConfig
