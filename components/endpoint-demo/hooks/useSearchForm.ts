import { useCallback, useState } from 'react'

export type SearchFormState = {
  query: string
  limit: string
  offset: string
}

export const useSearchForm = () => {
  const [searchForm, setSearchForm] = useState<SearchFormState>({
    query: '',
    limit: '10',
    offset: '0',
  })

  const updateSearchForm = useCallback(
    (key: keyof SearchFormState, value: string) => {
      setSearchForm((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const resetSearchForm = () => {
    setSearchForm({
      query: '',
      limit: '10',
      offset: '0',
    })
  }

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
