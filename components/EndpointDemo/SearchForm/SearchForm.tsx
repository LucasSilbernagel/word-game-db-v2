'use client'

import { SearchFormState } from '../hooks/useSearchForm'

type SearchFormProps = {
  searchForm: SearchFormState
  updateSearchForm: (key: keyof SearchFormState, value: string) => void
}

export const SearchForm = ({
  searchForm,
  updateSearchForm,
}: SearchFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="search-query" className="text-sm font-medium">
          Search Query *
        </label>
        <input
          id="search-query"
          type="text"
          placeholder="Enter word to search for..."
          value={searchForm.query}
          onChange={(e) => updateSearchForm('query', e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Search for words by name (minimum 2 characters)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="search-limit" className="text-sm font-medium">
            Limit
          </label>
          <input
            id="search-limit"
            type="number"
            min="1"
            max="100"
            placeholder="10"
            value={searchForm.limit}
            onChange={(e) => updateSearchForm('limit', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="search-offset" className="text-sm font-medium">
            Offset
          </label>
          <input
            id="search-offset"
            type="number"
            min="0"
            placeholder="0"
            value={searchForm.offset}
            onChange={(e) => updateSearchForm('offset', e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  )
}
