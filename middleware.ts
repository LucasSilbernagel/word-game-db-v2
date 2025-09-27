import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
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
    // Extract the domain without 'www.'
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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
}
