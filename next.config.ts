import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable experimental features for better domain handling
  experimental: {
    // This helps with domain-based routing
    serverComponentsExternalPackages: ['mongoose'],
  },

  // Configure headers for better domain handling
  async headers() {
    return [
      {
        // Apply headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Configure redirects for www to non-www (backup to middleware)
  // This will work for any domain dynamically
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.(?<domain>.*)',
          },
        ],
        destination: 'https://:domain/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
