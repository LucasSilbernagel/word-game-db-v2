'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { API_ROUTES } from '@/lib/constants'
import { DeleteForm } from './DeleteForm/DeleteForm'
import { FilterForm } from './FilterForm/FilterForm'
import { useApiState } from './hooks/useApiState'
import { useDeleteForm } from './hooks/useDeleteForm'
import { useFilters } from './hooks/useFilters'
import { useSearchForm, type SearchFormState } from './hooks/useSearchForm'
import { useUpdateForm } from './hooks/useUpdateForm'
import { useWordForm } from './hooks/useWordForm'
import { SearchApiRequestExample } from './SearchApiRequestExample/SearchApiRequestExample'
import { SearchForm } from './SearchForm/SearchForm'
import { UpdateApiRequestExample } from './UpdateApiRequestExample/UpdateApiRequestExample'
import { UpdateForm } from './UpdateForm/UpdateForm'
import { buildApiRequest } from './utils/buildApiRequest'
import { handleApiResponse } from './utils/handleApiResponse'
import { WordForm } from './WordForm/WordForm'

type EndpointDemoProps = {
  method: string
  path: string
  description?: string
  example?: string
  isDestructiveEnabled?: boolean
  categories: string[]
}

const EndpointDemo = ({
  method,
  path,
  isDestructiveEnabled = false,
  categories,
}: EndpointDemoProps) => {
  const { filters, updateFilter, resetFilters, buildQueryString } = useFilters()
  const { wordForm, updateWordForm, resetWordForm } = useWordForm()
  const { updateForm, updateUpdateForm, resetUpdateForm } = useUpdateForm()
  const { deleteForm, updateDeleteForm, resetDeleteForm } = useDeleteForm()
  const { searchForm, updateSearchForm, resetSearchForm } = useSearchForm()
  const {
    isLoading,
    setIsLoading,
    response,
    setResponse,
    error,
    setError,
    isDebouncing,
    setIsDebouncing,
  } = useApiState()

  const isDestructiveEndpoint = ['POST', 'PUT', 'DELETE'].includes(method)
  const isWordsEndpoint = path === API_ROUTES.WORDS
  const isWordsWithIdEndpoint = path === API_ROUTES.WORDS_WITH_ID
  const isWordsSearchEndpoint = path === API_ROUTES.WORDS_SEARCH

  const handleDemo = async () => {
    // Prevent multiple simultaneous requests
    if (isLoading || isDebouncing) return

    setIsDebouncing(true)
    setIsLoading(true)
    // Only clear errors, keep previous response visible during loading
    setError(null)

    try {
      const { url, options } = buildApiRequest(
        method,
        path,
        buildQueryString(),
        wordForm,
        updateForm,
        deleteForm,
        searchForm,
        isDestructiveEnabled
      )

      const res = await fetch(url, options)
      const responseData = await handleApiResponse(res)
      setResponse(responseData)
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

  const getResetHandler = () => {
    if (method === 'POST') return resetWordForm
    if (method === 'PUT') return resetUpdateForm
    if (method === 'DELETE') return resetDeleteForm
    if (isWordsSearchEndpoint) return resetSearchForm
    return resetFilters
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div className="flex sm:flex-row flex-col justify-between items-center gap-2 sm:gap-0">
            <h3 className="hidden sm:block font-semibold text-sm">Live Demo</h3>
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              {(isWordsEndpoint ||
                isWordsSearchEndpoint ||
                (isWordsWithIdEndpoint &&
                  (method === 'PUT' || method === 'DELETE'))) && (
                <Button onClick={getResetHandler()} variant="outline" size="sm">
                  Reset
                </Button>
              )}
              <Button
                onClick={handleDemo}
                disabled={isLoading}
                size="sm"
                variant="default"
                className="min-w-[100px] sm:min-w-[120px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="border-2 border-current border-t-transparent rounded-full w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  'Test Endpoint'
                )}
              </Button>
            </div>
          </div>

          {/* Dynamic Example URL for PUT endpoint */}
          {isWordsWithIdEndpoint && method === 'PUT' && (
            <UpdateApiRequestExample updateForm={updateForm} />
          )}

          {/* Dynamic Example URL for Search endpoint */}
          {isWordsSearchEndpoint && method === 'GET' && (
            <SearchApiRequestExample searchForm={searchForm} />
          )}

          {/* Word Update Form */}
          {isWordsWithIdEndpoint && method === 'PUT' && (
            <UpdateForm
              updateForm={updateForm}
              updateUpdateForm={updateUpdateForm}
              categories={categories}
            />
          )}

          {/* Word Delete Form */}
          {isWordsWithIdEndpoint && method === 'DELETE' && (
            <DeleteForm
              deleteForm={deleteForm}
              updateDeleteForm={updateDeleteForm}
            />
          )}

          {/* Word Creation Form */}
          {isWordsEndpoint && method === 'POST' && (
            <WordForm
              wordForm={wordForm}
              updateWordForm={updateWordForm}
              categories={categories}
            />
          )}

          {/* Search Form */}
          {isWordsSearchEndpoint && method === 'GET' && (
            <SearchForm
              searchForm={searchForm}
              updateSearchForm={(key, value) =>
                updateSearchForm(key as keyof SearchFormState, value)
              }
            />
          )}

          {/* Filter Controls */}
          {isWordsEndpoint && method === 'GET' && (
            <FilterForm
              filters={filters}
              updateFilter={updateFilter}
              categories={categories}
            />
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
              <div className="flex items-center gap-2">
                <h5 className="font-medium text-green-600 dark:text-green-400 text-sm">
                  Response:
                </h5>
                {isLoading && (
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <div className="border-2 border-primary border-t-transparent rounded-full w-3 h-3 animate-spin" />
                    <span>Loading new data...</span>
                  </div>
                )}
              </div>
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
