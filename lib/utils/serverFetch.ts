import { API_ROUTES } from '@/lib/constants/app'
import { cache } from 'react'

/**
 * Server-side fetch with Next.js caching and React cache for deduplication
 */
const fetchWithCache = cache(async (url: string, options?: RequestInit) => {
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }

  return response.json()
})

/**
 * Fetch API configuration (destructive endpoints status)
 * Cached for 5 minutes on the server
 */
export const getConfig = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  return fetchWithCache(`${baseUrl}${API_ROUTES.CONFIG}`, {
    next: {
      revalidate: 300, // 5 minutes
      tags: ['config'],
    },
  })
}

/**
 * Fetch all categories
 * Cached for 1 hour on the server
 */
export const getCategories = async (): Promise<string[]> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  return fetchWithCache(`${baseUrl}${API_ROUTES.CATEGORIES}`, {
    next: {
      revalidate: 3600, // 1 hour
      tags: ['categories'],
    },
  })
}
