import { NextRequest, NextResponse } from 'next/server'

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers':
      'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  }
}

export function handleError(error: unknown, message = 'Internal Server Error') {
  console.error('API Error:', error)
  return NextResponse.json(
    { error: message },
    {
      status: 500,
      headers: corsHeaders(),
    }
  )
}

// CORS preflight handler
export function handleCors(request: NextRequest) {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders(),
    })
  }
  return null
}

// Add CORS headers to response
export function addCorsHeaders(response: NextResponse) {
  const headers = corsHeaders()
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value)
  }
  return response
}

/**
 * Check if destructive endpoints (POST, PUT, DELETE) are enabled
 * Based on environment variables for production safety
 */
export function isDestructiveEndpointEnabled() {
  return process.env.ENABLE_DESTRUCTIVE_ENDPOINTS === 'true'
}

/**
 * Handle requests to disabled destructive endpoints
 */
export function handleDisabledEndpoint(method: string) {
  return NextResponse.json(
    {
      error: `${method} endpoint is disabled in production`,
      message:
        'This endpoint is disabled to protect the production database. To enable it locally, set ENABLE_DESTRUCTIVE_ENDPOINTS=true in your .env.local file.',
      documentation:
        'See README.md for setup instructions to run locally with full functionality.',
    },
    {
      status: 403,
      headers: corsHeaders(),
    }
  )
}
