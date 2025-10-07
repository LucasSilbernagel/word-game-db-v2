import { NextRequest, NextResponse } from 'next/server'

function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

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

  // For non-API routes, serve normally
  return NextResponse.next()
}

const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

export { config, middleware }
