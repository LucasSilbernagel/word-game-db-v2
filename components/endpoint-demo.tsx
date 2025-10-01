'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TestEndpointButton } from '@/components/ui/test-endpoint-button'
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

type WordFormState = {
  word: string
  category: string
  newCategory: string
  numLetters: string
  numSyllables: string
  hint: string
  categoryMode: 'existing' | 'new'
}

type UpdateFormState = {
  id: string
  word: string
  category: string
  newCategory: string
  numLetters: string
  numSyllables: string
  hint: string
  categoryMode: 'existing' | 'new'
}

type DeleteFormState = {
  id: string
}

const EndpointDemo = ({
  method,
  path,
  isDestructiveEnabled = false,
}: EndpointDemoProps) => {
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
  const [wordForm, setWordForm] = useState<WordFormState>({
    word: '',
    category: '',
    newCategory: '',
    numLetters: '',
    numSyllables: '',
    hint: '',
    categoryMode: 'existing',
  })
  const [updateForm, setUpdateForm] = useState<UpdateFormState>({
    id: '',
    word: '',
    category: '',
    newCategory: '',
    numLetters: '',
    numSyllables: '',
    hint: '',
    categoryMode: 'existing',
  })
  const [deleteForm, setDeleteForm] = useState<DeleteFormState>({
    id: '',
  })

  const isDestructiveEndpoint = ['POST', 'PUT', 'DELETE'].includes(method)
  const isWordsEndpoint = path === '/api/v1/words'
  const isWordsWithIdEndpoint = path === '/api/v1/words/[id]'

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

  // Fetch categories on component mount with caching
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/v1/categories', {
          // Add cache headers for better performance
          headers: {
            'Cache-Control': 'max-age=3600', // Cache for 1 hour
          },
        })
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

  const updateWordForm = (key: keyof WordFormState, value: string) => {
    setWordForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateUpdateForm = (key: keyof UpdateFormState, value: string) => {
    setUpdateForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateDeleteForm = (key: keyof DeleteFormState, value: string) => {
    setDeleteForm((prev) => ({ ...prev, [key]: value }))
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

  const resetWordForm = () => {
    setWordForm({
      word: '',
      category: '',
      newCategory: '',
      numLetters: '',
      numSyllables: '',
      hint: '',
      categoryMode: 'existing',
    })
    setResponse(null)
    setError(null)
  }

  const resetUpdateForm = () => {
    setUpdateForm({
      id: '',
      word: '',
      category: '',
      newCategory: '',
      numLetters: '',
      numSyllables: '',
      hint: '',
      categoryMode: 'existing',
    })
    setResponse(null)
    setError(null)
  }

  const resetDeleteForm = () => {
    setDeleteForm({
      id: '',
    })
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
      } else if (method === 'POST' && path === '/api/v1/words') {
        // Handle word creation with form data
        const selectedCategory =
          wordForm.categoryMode === 'existing'
            ? wordForm.category
            : wordForm.newCategory

        if (
          !wordForm.word ||
          !selectedCategory ||
          !wordForm.numLetters ||
          !wordForm.numSyllables ||
          !wordForm.hint
        ) {
          setError('Please fill in all required fields')
          setIsLoading(false)
          setIsDebouncing(false)
          return
        }

        options.body = JSON.stringify({
          word: wordForm.word,
          category: selectedCategory,
          numLetters: Number.parseInt(wordForm.numLetters),
          numSyllables: Number.parseInt(wordForm.numSyllables),
          hint: wordForm.hint,
        })
      } else if (method === 'PUT' && path === '/api/v1/words/[id]') {
        // Handle word update with form data
        if (!updateForm.id) {
          setError('Please enter a word ID to update')
          setIsLoading(false)
          setIsDebouncing(false)
          return
        }

        const selectedCategory =
          updateForm.categoryMode === 'existing'
            ? updateForm.category
            : updateForm.newCategory

        // Build update data object with only provided fields
        const updateData: Record<string, unknown> = {}
        if (updateForm.word) updateData.word = updateForm.word
        if (selectedCategory) updateData.category = selectedCategory
        if (updateForm.numLetters)
          updateData.numLetters = Number.parseInt(updateForm.numLetters)
        if (updateForm.numSyllables)
          updateData.numSyllables = Number.parseInt(updateForm.numSyllables)
        if (updateForm.hint) updateData.hint = updateForm.hint

        if (Object.keys(updateData).length === 0) {
          setError('Please fill in at least one field to update')
          setIsLoading(false)
          setIsDebouncing(false)
          return
        }

        url = `/api/v1/words/${updateForm.id}`
        options.body = JSON.stringify(updateData)
      } else if (method === 'DELETE' && path === '/api/v1/words/[id]') {
        // Handle word deletion with ID
        if (!deleteForm.id) {
          setError('Please enter a word ID to delete')
          setIsLoading(false)
          setIsDebouncing(false)
          return
        }

        url = `/api/v1/words/${deleteForm.id}`
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

      // Check if response is JSON before parsing
      const contentType = res.headers.get('content-type')
      let data

      if (contentType && contentType.includes('application/json')) {
        data = await res.json()
      } else {
        // If not JSON, get text response
        const textData = await res.text()
        throw new Error(
          `Server returned non-JSON response: ${textData.slice(0, 200)}...`
        )
      }

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
          <div className="flex sm:flex-row flex-col justify-between items-center gap-2 sm:gap-0">
            <h3 className="hidden sm:block font-semibold text-sm">Live Demo</h3>
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              {(isWordsEndpoint ||
                (isWordsWithIdEndpoint &&
                  (method === 'PUT' || method === 'DELETE'))) && (
                <Button
                  onClick={(() => {
                    if (method === 'POST') return resetWordForm
                    if (method === 'PUT') return resetUpdateForm
                    if (method === 'DELETE') return resetDeleteForm
                    return resetFilters
                  })()}
                  variant="outline"
                  size="sm"
                >
                  Reset
                </Button>
              )}
              <TestEndpointButton
                onClick={handleDemo}
                disabled={isLoading}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Dynamic Example URL for PUT endpoint */}
          {isWordsWithIdEndpoint && method === 'PUT' && (
            <div>
              <p className="mb-2 text-muted-foreground text-sm">
                API Request Example:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 border rounded">
                <div className="font-mono text-sm">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">
                    PUT /api/v1/words/{updateForm.id || 'WORD_ID'}
                  </div>
                  <div className="mt-2 text-gray-600 dark:text-gray-300">
                    Content-Type: application/json
                  </div>
                  <pre className="mt-2 overflow-x-auto text-xs">
                    {(() => {
                      const selectedCategory =
                        updateForm.categoryMode === 'existing'
                          ? updateForm.category
                          : updateForm.newCategory

                      const body: Record<string, unknown> = {}
                      if (updateForm.word) body.word = updateForm.word
                      if (selectedCategory) body.category = selectedCategory
                      if (updateForm.numLetters)
                        body.numLetters = Number.parseInt(updateForm.numLetters)
                      if (updateForm.numSyllables)
                        body.numSyllables = Number.parseInt(
                          updateForm.numSyllables
                        )
                      if (updateForm.hint) body.hint = updateForm.hint

                      if (Object.keys(body).length === 0) {
                        body.word = 'example'
                        body.hint = 'Updated hint'
                      }

                      return JSON.stringify(body, null, 2)
                    })()}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Word Update Form */}
          {isWordsWithIdEndpoint && method === 'PUT' && (
            <div className="space-y-4">
              <h4 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
                Update Word
              </h4>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800 rounded-md">
                <p className="text-blue-800 dark:text-blue-200 text-xs">
                  <strong>Note:</strong> Only the fields you want to update need
                  to be filled in. Leave other fields empty to keep their
                  existing values.
                </p>
              </div>

              {/* Word ID Input */}
              <div>
                <label
                  htmlFor="update-id"
                  className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                >
                  Word ID: *
                </label>
                <input
                  id="update-id"
                  type="text"
                  value={updateForm.id}
                  onChange={(e) => updateUpdateForm('id', e.target.value)}
                  placeholder="e.g., 5ffa1774c0831cbe1460e29c"
                  className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                />
                <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
                  Enter the ID of the word you want to update. You can leave
                  other fields empty to keep existing values.
                </p>
              </div>

              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="update-word"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Word:
                  </label>
                  <input
                    id="update-word"
                    type="text"
                    value={updateForm.word}
                    onChange={(e) => updateUpdateForm('word', e.target.value)}
                    placeholder="e.g., elephant"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="update-hint"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Hint:
                  </label>
                  <input
                    id="update-hint"
                    type="text"
                    value={updateForm.hint}
                    onChange={(e) => updateUpdateForm('hint', e.target.value)}
                    placeholder="e.g., Large mammal with trunk"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="update-num-letters"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Number of Letters:
                  </label>
                  <input
                    id="update-num-letters"
                    type="number"
                    value={updateForm.numLetters}
                    onChange={(e) =>
                      updateUpdateForm('numLetters', e.target.value)
                    }
                    placeholder="e.g., 8"
                    min="1"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="update-num-syllables"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Number of Syllables:
                  </label>
                  <input
                    id="update-num-syllables"
                    type="number"
                    value={updateForm.numSyllables}
                    onChange={(e) =>
                      updateUpdateForm('numSyllables', e.target.value)
                    }
                    placeholder="e.g., 3"
                    min="1"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="pt-4 border-t">
                <h5 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Category
                </h5>
                <div className="space-y-3">
                  <div className="flex sm:flex-row flex-col gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="updateCategoryMode"
                        value="existing"
                        checked={updateForm.categoryMode === 'existing'}
                        onChange={(e) =>
                          updateUpdateForm('categoryMode', e.target.value)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">Select existing category</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="updateCategoryMode"
                        value="new"
                        checked={updateForm.categoryMode === 'new'}
                        onChange={(e) =>
                          updateUpdateForm('categoryMode', e.target.value)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">Create new category</span>
                    </label>
                  </div>

                  {updateForm.categoryMode === 'existing' ? (
                    <div>
                      <label
                        htmlFor="update-category-select"
                        className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                      >
                        Category:
                      </label>
                      <select
                        id="update-category-select"
                        value={updateForm.category}
                        onChange={(e) =>
                          updateUpdateForm('category', e.target.value)
                        }
                        className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                      >
                        <option value="">Keep existing category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="update-new-category"
                        className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                      >
                        New Category:
                      </label>
                      <input
                        id="update-new-category"
                        type="text"
                        value={updateForm.newCategory}
                        onChange={(e) =>
                          updateUpdateForm('newCategory', e.target.value)
                        }
                        placeholder="e.g., technology"
                        className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Word Delete Form */}
          {isWordsWithIdEndpoint && method === 'DELETE' && (
            <div className="space-y-4">
              <h4 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
                Delete Word
              </h4>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-red-800 dark:text-red-200 text-xs">
                  <strong>Warning:</strong> This action will permanently delete
                  the word from the database. This action cannot be undone.
                </p>
              </div>

              {/* Word ID Input */}
              <div>
                <label
                  htmlFor="delete-id"
                  className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                >
                  Word ID: *
                </label>
                <input
                  id="delete-id"
                  type="text"
                  value={deleteForm.id}
                  onChange={(e) => updateDeleteForm('id', e.target.value)}
                  placeholder="e.g., 5ffa1774c0831cbe1460e29c"
                  className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                />
                <p className="mt-1 text-gray-500 dark:text-gray-400 text-xs">
                  Enter the ID of the word you want to delete. You can find word
                  IDs by using the GET /api/v1/words endpoint.
                </p>
              </div>
            </div>
          )}

          {/* Word Creation Form */}
          {isWordsEndpoint && method === 'POST' && (
            <div className="space-y-4">
              <h4 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
                Create New Word
              </h4>
              <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="word"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Word: *
                  </label>
                  <input
                    id="word"
                    type="text"
                    value={wordForm.word}
                    onChange={(e) => updateWordForm('word', e.target.value)}
                    placeholder="e.g., elephant"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="hint"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Hint: *
                  </label>
                  <input
                    id="hint"
                    type="text"
                    value={wordForm.hint}
                    onChange={(e) => updateWordForm('hint', e.target.value)}
                    placeholder="e.g., Large mammal with trunk"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="num-letters"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Number of Letters: *
                  </label>
                  <input
                    id="num-letters"
                    type="number"
                    value={wordForm.numLetters}
                    onChange={(e) =>
                      updateWordForm('numLetters', e.target.value)
                    }
                    placeholder="e.g., 8"
                    min="1"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="num-syllables"
                    className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                  >
                    Number of Syllables: *
                  </label>
                  <input
                    id="num-syllables"
                    type="number"
                    value={wordForm.numSyllables}
                    onChange={(e) =>
                      updateWordForm('numSyllables', e.target.value)
                    }
                    placeholder="e.g., 3"
                    min="1"
                    className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="pt-4 border-t">
                <h5 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Category
                </h5>
                <div className="space-y-3">
                  <div className="flex sm:flex-row flex-col gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="categoryMode"
                        value="existing"
                        checked={wordForm.categoryMode === 'existing'}
                        onChange={(e) =>
                          updateWordForm('categoryMode', e.target.value)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">Select existing category</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="categoryMode"
                        value="new"
                        checked={wordForm.categoryMode === 'new'}
                        onChange={(e) =>
                          updateWordForm('categoryMode', e.target.value)
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">Create new category</span>
                    </label>
                  </div>

                  {wordForm.categoryMode === 'existing' ? (
                    <div>
                      <label
                        htmlFor="category-select"
                        className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                      >
                        Category: *
                      </label>
                      <select
                        id="category-select"
                        value={wordForm.category}
                        onChange={(e) =>
                          updateWordForm('category', e.target.value)
                        }
                        className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="new-category"
                        className="font-medium text-gray-600 dark:text-gray-400 text-xs"
                      >
                        New Category: *
                      </label>
                      <input
                        id="new-category"
                        type="text"
                        value={wordForm.newCategory}
                        onChange={(e) =>
                          updateWordForm('newCategory', e.target.value)
                        }
                        placeholder="e.g., technology"
                        className="dark:bg-gray-800 mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded w-full text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Filter Controls */}
          {isWordsEndpoint && method === 'GET' && (
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
                <h4 className="mb-3 font-medium text-gray-700 dark:text-gray-300 text-sm">
                  Pagination
                </h4>
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
              <pre className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-red-800 dark:text-red-200 text-xs text-wrap">
                {error}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default EndpointDemo
