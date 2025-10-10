import type { NextConfig } from 'next'

// CORS configuration for API routes
// Note: These are defined here instead of imported because next.config.ts
// is compiled separately and has different module resolution
const CORS_HEADERS = [
  {
    key: 'Access-Control-Allow-Origin',
    value: '*',
  },
  {
    key: 'Access-Control-Allow-Methods',
    value: 'GET, POST, PUT, DELETE, OPTIONS',
  },
  {
    key: 'Access-Control-Allow-Headers',
    value: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  },
  {
    key: 'Access-Control-Max-Age',
    value: '86400',
  },
  {
    key: 'Access-Control-Allow-Credentials',
    value: 'false',
  },
]

const nextConfig: NextConfig = {
  // External packages that should be handled by the server
  serverExternalPackages: ['mongoose'],

  experimental: {
    optimizeCss: true,
  },

  // Configure security headers and performance optimizations
  async headers() {
    return [
      // CORS headers for API routes
      {
        source: '/api/(.*)',
        headers: CORS_HEADERS,
      },
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
          // Performance headers
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
      // Cache static assets
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache images
      {
        source: '/:path*.(png|jpg|jpeg|gif|webp|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default nextConfig
