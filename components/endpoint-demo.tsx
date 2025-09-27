'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCallback, useEffect, useState } from 'react'

type EndpointDemoProps = {
  method: string
  path: string
  description?: string
  example?: string
  isDestructiveEnabled?: boolean
}

type FilterState = {
  // General filters
  category: string
  minLetters: string
  maxLetters: string
  minSyllables: string
  maxSyllables: string
  // Pagination
  limit: string
  offset: string
}

export default function EndpointDemo({
  method,
  path,
  isDestructiveEnabled = false,
}: EndpointDemoProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [isDebouncing, setIsDebouncing] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minLetters: '',
    maxLetters: '',
    minSyllables: '',
    maxSyllables: '',
    limit: '10',
    offset: '0',
  })

  const isDestructiveEndpoint = ['POST', 'PUT', 'DELETE'].includes(method)
  const isWordsEndpoint = path === '/api/v1/words'

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams()

    // Add general filters
    if (filters.category) params.set('category', filters.category)
    if (filters.minLetters) params.set('minLetters', filters.minLetters)
    if (filters.maxLetters) params.set('maxLetters', filters.maxLetters)
    if (filters.minSyllables) params.set('minSyllables', filters.minSyllables)
    if (filters.maxSyllables) params.set('maxSyllables', filters.maxSyllables)

    // Add pagination parameters
    if (filters.limit) params.set('limit', filters.limit)
    if (filters.offset) params.set('offset', filters.offset)

    return params.toString()
  }, [
    filters.category,
    filters.minLetters,
    filters.maxLetters,
    filters.minSyllables,
    filters.maxSyllables,
    filters.limit,
    filters.offset,
  ])

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/v1/categories')
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      category: '',
      minLetters: '',
      maxLetters: '',
      minSyllables: '',
      maxSyllables: '',
      limit: '10',
      offset: '0',
    })
    // Also clear response and error data
    setResponse(null)
    setError(null)
  }

  const handleDemo = async () => {
    // Prevent multiple simultaneous requests
    if (isLoading || isDebouncing) return

    setIsDebouncing(true)
    setIsLoading(true)
    // Don't clear response/error data - just replace it when new data comes in

    try {
      let url = path
      let options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      // Handle different endpoint types
      if (method === 'GET') {
        switch (path) {
          case '/api/v1/words': {
            // Use filters to build query string
            const queryString = buildQueryString()
            url = `/api/v1/words${queryString ? `?${queryString}` : ''}`
            break
          }
          case '/api/v1/words/[id]': {
            // Use a specific word ID for demo
            url = '/api/v1/words/5ffa1774c0831cbe1460e29c'
            break
          }
          // No default
        }
      } else if (isDestructiveEndpoint && !isDestructiveEnabled) {
        // For destructive endpoints when not enabled, show a message instead of making the request
        setResponse(
          'This endpoint is disabled. To test it, set ENABLE_DESTRUCTIVE_ENDPOINTS=true in your environment variables.'
        )
        setIsLoading(false)
        setIsDebouncing(false)
        return
      }

      const res = await fetch(url, options)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`)
      }

      setResponse(JSON.stringify(data, null, 2))
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'An error occurred')
    } finally {
      setIsLoading(false)
      // Add a small delay before allowing another request
      setTimeout(() => {
        setIsDebouncing(false)
      }, 1000)
    }
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-sm">Live Demo</h4>
            <div className="flex gap-2">
              {isWordsEndpoint && (
                <Button onClick={resetFilters} variant="outline" size="sm">
                  Reset
                </Button>
              )}
              <Button
                onClick={handleDemo}
                disabled={isLoading}
                size="sm"
                variant={isDestructiveEndpoint ? 'outline' : 'default'}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="border-2 border-current border-t-transparent rounded-full w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Test Endpoint'
                )}
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          {isWordsEndpoint && (
            <div className="space-y-4">
              {/* General filters */}
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label
                    htmlFor="category"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Category:
                  </label>
                  <select
                    id="category"
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  >
                    <option value="">Any Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="min-letters"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Min Letters:
                  </label>
                  <input
                    id="min-letters"
                    type="number"
                    value={filters.minLetters}
                    onChange={(e) => updateFilter('minLetters', e.target.value)}
                    placeholder="e.g., 3"
                    min="1"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="max-letters"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Max Letters:
                  </label>
                  <input
                    id="max-letters"
                    type="number"
                    value={filters.maxLetters}
                    onChange={(e) => updateFilter('maxLetters', e.target.value)}
                    placeholder="e.g., 10"
                    min="1"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="min-syllables"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Min Syllables:
                  </label>
                  <input
                    id="min-syllables"
                    type="number"
                    value={filters.minSyllables}
                    onChange={(e) =>
                      updateFilter('minSyllables', e.target.value)
                    }
                    placeholder="e.g., 1"
                    min="1"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="max-syllables"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Max Syllables:
                  </label>
                  <input
                    id="max-syllables"
                    type="number"
                    value={filters.maxSyllables}
                    onChange={(e) =>
                      updateFilter('maxSyllables', e.target.value)
                    }
                    placeholder="e.g., 3"
                    min="1"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>
              </div>

              {/* Pagination Controls */}
              <div className="pt-4 border-t">
                <h5 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Pagination
                </h5>
                <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="limit"
                      className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                    >
                      Limit (items per page):
                    </label>
                    <input
                      id="limit"
                      type="number"
                      value={filters.limit}
                      onChange={(e) => updateFilter('limit', e.target.value)}
                      placeholder="e.g., 10"
                      min="1"
                      max="100"
                      className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="offset"
                      className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                    >
                      Offset (skip items):
                    </label>
                    <input
                      id="offset"
                      type="number"
                      value={filters.offset}
                      onChange={(e) => updateFilter('offset', e.target.value)}
                      placeholder="e.g., 0"
                      min="0"
                      className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                    />
                  </div>
                </div>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-xs">
                  Use limit and offset to paginate through results. Default:
                  limit=10, offset=0
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 mt-3 p-3 border border-blue-200 dark:border-blue-800 rounded-md">
                  <p className="text-blue-800 dark:text-blue-200 text-xs">
                    The API returns a pagination object with total count,
                    current limit/offset, and hasMore flag to help you implement
                    pagination in your app.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isDestructiveEndpoint && !isDestructiveEnabled && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Note:</strong> This endpoint is disabled. To test it,
                set{' '}
                <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-xs">
                  ENABLE_DESTRUCTIVE_ENDPOINTS=true
                </code>{' '}
                in your environment variables.
              </p>
            </div>
          )}

          {response && (
            <div className="space-y-2">
              <h5 className="font-medium text-green-600 dark:text-green-400 text-sm">
                Response:
              </h5>
              <pre className="bg-muted p-3 rounded overflow-x-auto text-xs">
                {response}
              </pre>
            </div>
          )}

          {error && (
            <div className="space-y-2">
              <h5 className="font-medium text-red-600 dark:text-red-400 text-sm">
                Error:
              </h5>
              <pre className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-red-800 dark:text-red-200 text-xs">
                {error}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
