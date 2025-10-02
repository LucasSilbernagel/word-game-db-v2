import { useCallback, useState } from 'react'

export type FilterState = {
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

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    minLetters: '',
    maxLetters: '',
    minSyllables: '',
    maxSyllables: '',
    limit: '10',
    offset: '0',
  })

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
  }

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

  return {
    filters,
    updateFilter,
    resetFilters,
    buildQueryString,
  }
}
