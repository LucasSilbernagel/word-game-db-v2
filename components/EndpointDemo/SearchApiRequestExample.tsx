import { SearchFormState } from '../hooks/useSearchForm'

type SearchApiRequestExampleProps = {
  searchForm: SearchFormState
}

export const SearchApiRequestExample = ({
  searchForm,
}: SearchApiRequestExampleProps) => {
  const buildExampleUrl = () => {
    const params = new URLSearchParams()

    // Use form values or defaults for the example
    const query = searchForm.query || 'cat'
    const limit = searchForm.limit || '10'
    const offset = searchForm.offset || '0'

    params.set('q', query)
    if (limit !== '10') params.set('limit', limit)
    if (offset !== '0') params.set('offset', offset)

    return `/api/v2/words/search?${params.toString()}`
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
          <div className="mt-2 text-xs break-words text-gray-500 dark:text-gray-400">
            Returns words matching "{searchForm.query || 'cat'}" with pagination
          </div>
        </div>
      </div>
    </div>
  )
}
