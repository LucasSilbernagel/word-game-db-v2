import { useGenericForm } from '@/lib/hooks/useGenericForm'
import { useCallback } from 'react'

export type SearchFormState = {
  query: string
  limit: string
  offset: string
}

export const useSearchForm = () => {
  const {
    formState: searchForm,
    updateField: updateSearchForm,
    resetForm: resetSearchForm,
  } = useGenericForm<SearchFormState>({
    query: '',
    limit: '10',
    offset: '0',
  })

  const buildSearchQueryString = useCallback(() => {
    const params = new URLSearchParams()

    if (searchForm.query) params.set('q', searchForm.query)
    if (searchForm.limit) params.set('limit', searchForm.limit)
    if (searchForm.offset) params.set('offset', searchForm.offset)

    return params.toString()
  }, [searchForm.query, searchForm.limit, searchForm.offset])

  return {
    searchForm,
    updateSearchForm,
    resetSearchForm,
    buildSearchQueryString,
  }
}
