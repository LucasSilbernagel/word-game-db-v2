import { useFilters } from '@/components/EndpointDemo/hooks/useFilters'
import { act, renderHook } from '@testing-library/react'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the useGenericForm hook
vi.mock('@/lib/hooks/useGenericForm', () => ({
  useGenericForm: vi.fn(),
}))

describe('useFilters', () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    // Set up default mock implementation
    const { useGenericForm } = await import('@/lib/hooks/useGenericForm')
    vi.mocked(useGenericForm).mockImplementation((initialState) => {
      const [formState, setFormState] =
        useState<Record<string, unknown>>(initialState)

      const updateField = (key: string, value: string) => {
        setFormState((prev: Record<string, unknown>) => ({
          ...prev,
          [key]: value,
        }))
      }

      const updateFields = (updates: Partial<Record<string, unknown>>) => {
        setFormState((prev: Record<string, unknown>) => ({
          ...prev,
          ...updates,
        }))
      }

      const resetForm = () => {
        setFormState(initialState)
      }

      return {
        formState,
        updateField,
        updateFields,
        resetForm,
        setFormState,
      }
    })
  })

  it('should initialize with default filter values', () => {
    const { result } = renderHook(() => useFilters())

    expect(result.current.filters).toEqual({
      category: '',
      _id: '',
      minLetters: '',
      maxLetters: '',
      minSyllables: '',
      maxSyllables: '',
      limit: '10',
      offset: '0',
    })
  })

  it('should update filter values', () => {
    const { result } = renderHook(() => useFilters())

    act(() => {
      result.current.updateFilter('category', 'fruit')
    })

    expect(result.current.filters.category).toBe('fruit')
  })

  it('should reset filters to initial values', () => {
    const { result } = renderHook(() => useFilters())

    // Set some values
    act(() => {
      result.current.updateFilter('category', 'fruit')
      result.current.updateFilter('minLetters', '5')
    })

    // Reset
    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.filters).toEqual({
      category: '',
      _id: '',
      minLetters: '',
      maxLetters: '',
      minSyllables: '',
      maxSyllables: '',
      limit: '10',
      offset: '0',
    })
  })

  it('should build query string with all parameters', () => {
    const { result } = renderHook(() => useFilters())

    // Set all filter values
    act(() => {
      result.current.updateFilter('category', 'fruit')
      result.current.updateFilter('_id', '5ffa1774c0831cbe1460e29c')
      result.current.updateFilter('minLetters', '5')
      result.current.updateFilter('maxLetters', '10')
      result.current.updateFilter('minSyllables', '1')
      result.current.updateFilter('maxSyllables', '3')
      result.current.updateFilter('limit', '20')
      result.current.updateFilter('offset', '10')
    })

    const queryString = result.current.buildQueryString()

    expect(queryString).toBe(
      'category=fruit&_id=5ffa1774c0831cbe1460e29c&minLetters=5&maxLetters=10&minSyllables=1&maxSyllables=3&limit=20&offset=10'
    )
  })

  it('should build query string with only non-empty values', () => {
    const { result } = renderHook(() => useFilters())

    // Set only some filter values
    act(() => {
      result.current.updateFilter('category', 'fruit')
      result.current.updateFilter('_id', '5ffa1774c0831cbe1460e29c')
      result.current.updateFilter('minLetters', '5')
      result.current.updateFilter('limit', '20')
    })

    const queryString = result.current.buildQueryString()

    expect(queryString).toBe(
      'category=fruit&_id=5ffa1774c0831cbe1460e29c&minLetters=5&limit=20'
    )
  })

  it('should build empty query string when no filters set', () => {
    const { result } = renderHook(() => useFilters())

    const queryString = result.current.buildQueryString()

    expect(queryString).toBe('limit=10')
  })

  it('should update query string when filters change', () => {
    const { result } = renderHook(() => useFilters())

    // Initial query string
    let queryString = result.current.buildQueryString()
    expect(queryString).toBe('limit=10')

    // Add category filter
    act(() => {
      result.current.updateFilter('category', 'fruit')
    })

    queryString = result.current.buildQueryString()
    expect(queryString).toBe('category=fruit&limit=10')

    // Add _id filter
    act(() => {
      result.current.updateFilter('_id', '5ffa1774c0831cbe1460e29c')
    })

    queryString = result.current.buildQueryString()
    expect(queryString).toBe(
      'category=fruit&_id=5ffa1774c0831cbe1460e29c&limit=10'
    )

    // Add more filters
    act(() => {
      result.current.updateFilter('minLetters', '5')
      result.current.updateFilter('maxLetters', '10')
    })

    queryString = result.current.buildQueryString()
    expect(queryString).toBe(
      'category=fruit&_id=5ffa1774c0831cbe1460e29c&minLetters=5&maxLetters=10&limit=10'
    )
  })

  it('should handle empty string values in query string', () => {
    const { result } = renderHook(() => useFilters())

    // Set some filters to empty strings
    act(() => {
      result.current.updateFilter('category', '')
      result.current.updateFilter('_id', '')
      result.current.updateFilter('minLetters', '5')
      result.current.updateFilter('maxLetters', '')
    })

    const queryString = result.current.buildQueryString()

    expect(queryString).toBe('minLetters=5&limit=10')
  })

  it('should maintain separate filter states', () => {
    const { result: result1 } = renderHook(() => useFilters())
    const { result: result2 } = renderHook(() => useFilters())

    // Update first instance
    act(() => {
      result1.current.updateFilter('category', 'fruit')
    })

    // Update second instance
    act(() => {
      result2.current.updateFilter('category', 'animal')
    })

    expect(result1.current.filters.category).toBe('fruit')
    expect(result2.current.filters.category).toBe('animal')
  })

  it('should handle _id filter correctly', () => {
    const { result } = renderHook(() => useFilters())

    act(() => {
      result.current.updateFilter('_id', '5ffa1774c0831cbe1460e29c')
    })

    expect(result.current.filters._id).toBe('5ffa1774c0831cbe1460e29c')

    const queryString = result.current.buildQueryString()
    expect(queryString).toBe('_id=5ffa1774c0831cbe1460e29c&limit=10')
  })

  it('should handle _id filter with other filters', () => {
    const { result } = renderHook(() => useFilters())

    act(() => {
      result.current.updateFilter('_id', '5ffa1774c0831cbe1460e29c')
      result.current.updateFilter('category', 'animal')
    })

    expect(result.current.filters._id).toBe('5ffa1774c0831cbe1460e29c')
    expect(result.current.filters.category).toBe('animal')

    const queryString = result.current.buildQueryString()
    expect(queryString).toBe(
      'category=animal&_id=5ffa1774c0831cbe1460e29c&limit=10'
    )
  })
})
