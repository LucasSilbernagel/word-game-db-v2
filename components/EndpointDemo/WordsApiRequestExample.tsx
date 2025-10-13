/* eslint-disable unicorn/no-nested-ternary */
import { FilterState } from './hooks/useFilters'

type WordsApiRequestExampleProps = {
  filters: FilterState
}

export const WordsApiRequestExample = ({
  filters,
}: WordsApiRequestExampleProps) => {
  const buildExampleUrl = () => {
    const params = new URLSearchParams()

    // Use form values or defaults for the example
    if (filters.category) params.set('category', filters.category)
    if (filters._id) params.set('_id', filters._id)
    if (filters.minLetters) params.set('minLetters', filters.minLetters)
    if (filters.maxLetters) params.set('maxLetters', filters.maxLetters)
    if (filters.minSyllables) params.set('minSyllables', filters.minSyllables)
    if (filters.maxSyllables) params.set('maxSyllables', filters.maxSyllables)
    if (filters.limit && filters.limit !== '10')
      params.set('limit', filters.limit)
    if (filters.offset && filters.offset !== '0')
      params.set('offset', filters.offset)

    // If no filters are set, show a basic example
    if (params.toString() === '') {
      params.set('category', 'animal')
    }

    return `/api/v2/words?${params.toString()}`
  }

  const getDescription = () => {
    const activeFilters = []

    if (filters.category) activeFilters.push(`category: "${filters.category}"`)
    if (filters._id) activeFilters.push(`ID: "${filters._id}"`)
    if (filters.minLetters || filters.maxLetters) {
      const range =
        filters.minLetters && filters.maxLetters
          ? `${filters.minLetters}-${filters.maxLetters}`
          : filters.minLetters
            ? `${filters.minLetters}+`
            : `≤${filters.maxLetters}`
      activeFilters.push(`${range} letters`)
    }
    if (filters.minSyllables || filters.maxSyllables) {
      const range =
        filters.minSyllables && filters.maxSyllables
          ? `${filters.minSyllables}-${filters.maxSyllables}`
          : filters.minSyllables
            ? `${filters.minSyllables}+`
            : `≤${filters.maxSyllables}`
      activeFilters.push(`${range} syllables`)
    }

    if (activeFilters.length === 0) {
      return 'Returns all words (no filters applied)'
    }

    return `Returns words filtered by: ${activeFilters.join(', ')}`
  }

  return (
    <div>
      <p className="text-muted-foreground mb-2 text-sm">API Request Example:</p>
      <div className="rounded border bg-gray-50 p-3 dark:bg-gray-800">
        <div className="font-mono text-sm">
          <div className="font-semibold break-all text-green-700 dark:text-green-400">
            GET {buildExampleUrl()}
          </div>
          <div className="mt-2 text-gray-600 dark:text-gray-300">
            Content-Type: application/json
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {getDescription()}
          </div>
        </div>
      </div>
    </div>
  )
}
