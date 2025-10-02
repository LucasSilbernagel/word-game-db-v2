import {
  addCorsHeaders,
  handleCors,
  handleDisabledEndpoint,
  handleError,
  isDestructiveEndpointEnabled,
} from '@/lib/middleware'
import connectDB from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

type ApiHandler = (
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any
) => Promise<NextResponse> | NextResponse

type ApiWrapperOptions = {
  requiresAuth?: boolean
  isDestructive?: boolean
  method?: string
}

/**
 * Generic API route wrapper that handles common concerns:
 * - CORS handling
 * - Database connection
 * - Destructive endpoint checks
 * - Error handling
 * - Response headers
 */
export function withApiWrapper(
  handler: ApiHandler,
  options: ApiWrapperOptions = {}
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (request: NextRequest, context?: any) => {
    // Handle CORS preflight
    const corsResponse = handleCors(request)
    if (corsResponse) return corsResponse

    // Check if destructive endpoints are enabled
    if (options.isDestructive && !isDestructiveEndpointEnabled()) {
      return handleDisabledEndpoint(options.method || request.method)
    }

    try {
      // Connect to database
      await connectDB()

      // Call the actual handler
      const response = await handler(request, context)

      // Add CORS headers to the response
      return addCorsHeaders(response)
    } catch (error) {
      // Handle errors consistently
      const errorMessage = `Failed to ${options.method?.toLowerCase() || 'process'} request`
      return handleError(error, errorMessage)
    }
  }
}

/**
 * Convenience wrapper for GET requests
 */
export function withGetWrapper(handler: ApiHandler) {
  return withApiWrapper(handler, { method: 'GET' })
}

/**
 * Convenience wrapper for POST requests
 */
export function withPostWrapper(handler: ApiHandler) {
  return withApiWrapper(handler, {
    method: 'POST',
    isDestructive: true,
  })
}

/**
 * Convenience wrapper for PUT requests
 */
export function withPutWrapper(handler: ApiHandler) {
  return withApiWrapper(handler, {
    method: 'PUT',
    isDestructive: true,
  })
}

/**
 * Convenience wrapper for DELETE requests
 */
export function withDeleteWrapper(handler: ApiHandler) {
  return withApiWrapper(handler, {
    method: 'DELETE',
    isDestructive: true,
  })
}
