import { NextRequest, NextResponse } from 'next/server'

function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Skip redirects for localhost and IP addresses (development)
  if (
    hostname.startsWith('localhost') ||
    hostname.startsWith('127.0.0.1') ||
    hostname.startsWith('0.0.0.0') ||
    /^\d+\.\d+\.\d+\.\d+/.test(hostname)
  ) {
    return NextResponse.next()
  }

  // Check if the hostname is the non-www version (redirect to www)
  if (hostname === 'wordgamedb.com') {
    // Redirect non-www to www (primary domain)
    const url = request.nextUrl.clone()
    url.hostname = 'www.wordgamedb.com'
    return NextResponse.redirect(url, 301)
  }

  // Check if the hostname starts with 'www.' (primary domain)
  if (hostname.startsWith('www.')) {
    // For API routes, add CORS headers to support cross-origin requests
    if (pathname.startsWith('/api/')) {
      const response = NextResponse.next()

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

      return response
    }

    // For non-API routes, serve normally (www is now primary)
    return NextResponse.next()
  }

  // Allow requests to proceed normally for non-www domains
  return NextResponse.next()
}

const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

export { config, middleware }
