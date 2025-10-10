/**
 * Shared CORS configuration constants
 * Ensures consistency across middleware, Next.js config, and API wrappers
 */

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Access-Control-Allow-Credentials': 'false',
} as const

/**
 * Returns CORS headers as a plain object
 * Use this for middleware and utility functions
 */
export const getCorsHeaders = () => CORS_HEADERS

/**
 * Returns CORS headers as an array of {key, value} objects
 * Use this for Next.js config headers()
 */
export const getCorsHeadersArray = () => {
  return Object.entries(CORS_HEADERS).map(([key, value]) => ({
    key,
    value,
  }))
}
