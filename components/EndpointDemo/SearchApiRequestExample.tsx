import { SearchFormState } from './hooks/useSearchForm'

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
      <p className="mb-2 text-muted-foreground text-sm">API Request Example:</p>
      <div className="bg-gray-50 dark:bg-gray-800 p-3 border rounded">
        <div className="font-mono text-sm">
          <div className="font-semibold text-green-700 dark:text-green-400 break-all">
            GET {buildExampleUrl()}
          </div>
          <div className="mt-2 text-gray-600 dark:text-gray-300">
            Content-Type: application/json
          </div>
          <div className="mt-2 text-gray-500 dark:text-gray-400 text-xs break-words">
            Returns words matching "{searchForm.query || 'cat'}" with pagination
          </div>
        </div>
      </div>
    </div>
  )
}
