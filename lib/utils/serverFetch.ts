import connectDB from '@/lib/mongodb'
import { getCategoriesHandler, getConfigHandler } from '@/lib/utils/apiHandlers'
import { cache } from 'react'

/**
 * Fetch API configuration (destructive endpoints status)
 * Cached with React cache for deduplication
 * Calls the handler directly instead of making HTTP requests
 */
export const getConfig = cache(async () => {
  const response = await getConfigHandler()
  return response.json()
})

/**
 * Fetch all categories
 * Cached with React cache for deduplication
 * Calls the handler directly instead of making HTTP requests
 */
export const getCategories = cache(async (): Promise<string[]> => {
  // Ensure database connection is established
  await connectDB()
  const response = await getCategoriesHandler()
  return response.json()
})
