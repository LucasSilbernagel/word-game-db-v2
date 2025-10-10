import {
  addCorsHeaders,
  handleCors,
  handleDisabledEndpoint,
  handleError,
  isDestructiveEndpointEnabled,
} from '@/lib/middleware'
import connectDB from '@/lib/mongodb'
import { validateRequestSize } from '@/lib/utils/validation'
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
  maxBodySizeKB?: number
}

/**
 * Generic API route wrapper that handles common concerns:
 * - CORS handling
 * - Database connection
 * - Destructive endpoint checks
 * - Request size validation
 * - Error handling
 * - Response headers
 */
export const withApiWrapper = (
  handler: ApiHandler,
  options: ApiWrapperOptions = {}
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (request: NextRequest, context?: any) => {
    // Handle CORS preflight
    const corsResponse = handleCors(request)
    if (corsResponse) return corsResponse

    // Check if destructive endpoints are enabled
    if (options.isDestructive && !isDestructiveEndpointEnabled()) {
      return handleDisabledEndpoint(options.method || request.method)
    }

    // Validate request body size for POST, PUT, DELETE requests
    if (
      (request.method === 'POST' ||
        request.method === 'PUT' ||
        request.method === 'DELETE') &&
      options.maxBodySizeKB !== undefined
    ) {
      try {
        const bodyText = await request.text()
        const sizeError = validateRequestSize(bodyText, options.maxBodySizeKB)
        if (sizeError) return sizeError

        // Re-create request with the body we just read
        // Since we consumed the body, we need to create a new request with it
        const newRequest = new NextRequest(request.url, {
          method: request.method,
          headers: request.headers,
          body: bodyText,
        })

        try {
          // Connect to database
          await connectDB()

          // Call the actual handler
          const response = await handler(newRequest, context)

          // Add CORS headers to the response
          return addCorsHeaders(response)
        } catch (error) {
          // Handle errors consistently
          const errorMessage = `Failed to ${options.method?.toLowerCase() || 'process'} request`
          return handleError(error, errorMessage)
        }
      } catch (error) {
        return handleError(error, 'Failed to read request body')
      }
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
export const withGetWrapper = (handler: ApiHandler) => {
  return withApiWrapper(handler, { method: 'GET' })
}

/**
 * Convenience wrapper for POST requests
 * @param handler - The request handler
 * @param maxBodySizeKB - Maximum request body size in KB (default: 100KB)
 */
export const withPostWrapper = (
  handler: ApiHandler,
  maxBodySizeKB: number = 100
) => {
  return withApiWrapper(handler, {
    method: 'POST',
    isDestructive: true,
    maxBodySizeKB,
  })
}

/**
 * Convenience wrapper for PUT requests
 * @param handler - The request handler
 * @param maxBodySizeKB - Maximum request body size in KB (default: 100KB)
 */
export const withPutWrapper = (
  handler: ApiHandler,
  maxBodySizeKB: number = 100
) => {
  return withApiWrapper(handler, {
    method: 'PUT',
    isDestructive: true,
    maxBodySizeKB,
  })
}

/**
 * Convenience wrapper for DELETE requests
 * @param handler - The request handler
 * @param maxBodySizeKB - Maximum request body size in KB (default: 50KB)
 */
export const withDeleteWrapper = (
  handler: ApiHandler,
  maxBodySizeKB: number = 50
) => {
  return withApiWrapper(handler, {
    method: 'DELETE',
    isDestructive: true,
    maxBodySizeKB,
  })
}
