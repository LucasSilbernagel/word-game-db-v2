import { getCorsHeaders } from '@/lib/constants/cors'
import { NextRequest, NextResponse } from 'next/server'

export const corsHeaders = getCorsHeaders

export const handleError = (
  error: unknown,
  message = 'Internal Server Error'
) => {
  console.error('API Error:', error)
  return NextResponse.json(
    { error: message },
    {
      status: 500,
      headers: corsHeaders(),
    }
  )
}

/**
 * Detect whether an error is caused by database connectivity/configuration
 * rather than by the request itself.
 */
export const isDatabaseError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') return false
  const name = (error as { name?: string }).name ?? ''
  const message = (error as { message?: string }).message ?? ''
  return (
    name === 'DatabaseConfigError' ||
    name.includes('MongooseServerSelection') ||
    name.includes('MongoServerSelection') ||
    name.includes('MongoNetwork') ||
    name === 'MongooseError' ||
    /mongo|econnrefused|getaddrinfo|querysrv|topology|server selection|MONGODB_URI/i.test(
      message
    )
  )
}

/**
 * Return a clear, structured 503 for database connectivity/config problems so
 * the client can render a helpful "database unavailable" state.
 */
export const handleDatabaseError = (error: unknown) => {
  console.error('Database Error:', error)
  const isConfigError =
    (error as { name?: string })?.name === 'DatabaseConfigError'
  return NextResponse.json(
    {
      error: 'Database unavailable',
      code: 'DB_UNAVAILABLE',
      message: isConfigError
        ? 'The database connection string (MONGODB_URI) is not configured. Add it in Project Settings → Vars, then try again.'
        : 'Could not connect to the database. Verify your MONGODB_URI value, that MongoDB Atlas Network Access allows this connection, and that the cluster is running.',
    },
    {
      status: 503,
      headers: corsHeaders(),
    }
  )
}

// CORS preflight handler
export const handleCors = (request: NextRequest) => {
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders(),
    })
  }
  return null
}

// Add CORS headers to response
export const addCorsHeaders = (response: NextResponse) => {
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
export const isDestructiveEndpointEnabled = () => {
  return process.env.ENABLE_DESTRUCTIVE_ENDPOINTS === 'true'
}

/**
 * Handle requests to disabled destructive endpoints
 */
export const handleDisabledEndpoint = (method: string) => {
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
