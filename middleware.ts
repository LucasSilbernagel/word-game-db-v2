import { NextRequest, NextResponse } from 'next/server'

function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  // Skip redirects for localhost and IP addresses (development)
  if (
    hostname.startsWith('localhost') ||
    hostname.startsWith('127.0.0.1') ||
    hostname.startsWith('0.0.0.0') ||
    /^\d+\.\d+\.\d+\.\d+/.test(hostname)
  ) {
    return NextResponse.next()
  }

  // Check if the hostname starts with 'www.'
  if (hostname.startsWith('www.')) {
    // Extract the domain without 'www.'. This is to handle the www.wordgamedb.com redirect.
    const domainWithoutWww = hostname.slice(4) // Remove 'www.'

    // Create redirect URL to non-www version
    const url = request.nextUrl.clone()
    url.hostname = domainWithoutWww

    // Preserve the full path and query parameters
    return NextResponse.redirect(url, 301)
  }

  // Allow requests to proceed normally for non-www domains
  return NextResponse.next()
}

const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

export { config, middleware }
