import { useGenericForm } from '@/lib/hooks/useGenericForm'
import { useCallback } from 'react'

export type FilterState = {
  // General filters
  category: string
  _id: string
  minLetters: string
  maxLetters: string
  minSyllables: string
  maxSyllables: string
  // Pagination
  limit: string
  offset: string
}

export const useFilters = () => {
  const {
    formState: filters,
    updateField: updateFilter,
    resetForm: resetFilters,
  } = useGenericForm<FilterState>({
    category: '',
    _id: '',
    minLetters: '',
    maxLetters: '',
    minSyllables: '',
    maxSyllables: '',
    limit: '10',
    offset: '0',
  })

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams()

    // Add general filters
    if (filters.category) params.set('category', filters.category)
    if (filters._id) params.set('_id', filters._id)
    if (filters.minLetters) params.set('minLetters', filters.minLetters)
    if (filters.maxLetters) params.set('maxLetters', filters.maxLetters)
    if (filters.minSyllables) params.set('minSyllables', filters.minSyllables)
    if (filters.maxSyllables) params.set('maxSyllables', filters.maxSyllables)

    // Add pagination parameters
    if (filters.limit) params.set('limit', filters.limit)
    if (filters.offset && filters.offset !== '0')
      params.set('offset', filters.offset)

    return params.toString()
  }, [
    filters.category,
    filters._id,
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
