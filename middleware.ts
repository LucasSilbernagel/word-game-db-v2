import { NextRequest, NextResponse } from 'next/server'

function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const response = NextResponse.next()

  // Security Headers - Apply to all routes
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // Prevent clickjacking attacks
  response.headers.set('X-Frame-Options', 'DENY')

  // Enable XSS protection (legacy but still useful for older browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer Policy - only send origin when navigating to same origin
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions Policy - restrict potentially dangerous browser features
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )

  // Content Security Policy - restrict resource loading
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https:; " +
      "frame-ancestors 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self';"
  )

  // For API routes, add CORS headers to support cross-origin requests
  if (pathname.startsWith('/api/')) {
    // Add CORS headers for API requests
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
    )
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    response.headers.set('Access-Control-Max-Age', '86400')
    response.headers.set('Access-Control-Allow-Credentials', 'false')
  }

  return response
}

const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

export { config, middleware }
