'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { API_ROUTES } from '@/lib/constants/app'
import { DeleteForm } from './DeleteForm'
import { FilterForm } from './FilterForm'
import { useApiState } from './hooks/useApiState'
import { useDeleteForm } from './hooks/useDeleteForm'
import { useFilters } from './hooks/useFilters'
import { useSearchForm, type SearchFormState } from './hooks/useSearchForm'
import { useUpdateForm } from './hooks/useUpdateForm'
import { useWordForm } from './hooks/useWordForm'
import { SearchApiRequestExample } from './SearchApiRequestExample'
import { SearchForm } from './SearchForm'
import { UpdateApiRequestExample } from './UpdateApiRequestExample'
import { UpdateForm } from './UpdateForm'
import { buildApiRequest } from './utils/buildApiRequest'
import { handleApiResponse } from './utils/handleApiResponse'
import { WordForm } from './WordForm'
import { WordsApiRequestExample } from './WordsApiRequestExample'

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
    clearResponse,
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

      // Use modern fetch with signal for cancellation support
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30_000) // 30s timeout

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      const responseData = await handleApiResponse(res)
      setResponse(responseData)
    } catch (error_) {
      if (error_ instanceof Error) {
        if (error_.name === 'AbortError') {
          setError('Request timed out after 30 seconds')
        } else {
          setError(error_.message)
        }
      } else {
        setError('An unexpected error occurred')
      }
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

  const handleReset = () => {
    getResetHandler()()
    clearResponse()
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-between gap-2 sm:flex-row sm:gap-0">
            <h3 className="hidden text-sm font-semibold sm:block">Live Demo</h3>
            <div className="flex flex-wrap gap-2 sm:flex-nowrap">
              {(isWordsEndpoint ||
                isWordsSearchEndpoint ||
                (isWordsWithIdEndpoint &&
                  (method === 'PUT' || method === 'DELETE'))) && (
                <Button onClick={handleReset} variant="outline" size="sm">
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
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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

          {/* Dynamic Example URL for Words endpoint */}
          {isWordsEndpoint && method === 'GET' && (
            <WordsApiRequestExample filters={filters} />
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
              updateFilter={(key, value) =>
                updateFilter(key as keyof typeof filters, value)
              }
              categories={categories}
            />
          )}

          {isDestructiveEndpoint && !isDestructiveEnabled && (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> This endpoint is disabled. To test it,
                set{' '}
                <code className="rounded bg-yellow-100 px-1 text-xs dark:bg-yellow-900">
                  ENABLE_DESTRUCTIVE_ENDPOINTS=true
                </code>{' '}
                in your environment variables.
              </p>
            </div>
          )}

          {response && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h5 className="text-sm font-medium text-green-700 dark:text-green-400">
                  Response:
                </h5>
                {isLoading && (
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <div className="border-primary h-3 w-3 animate-spin rounded-full border-2 border-t-transparent" />
                    <span>Loading new data...</span>
                  </div>
                )}
              </div>
              <pre className="bg-muted overflow-x-auto rounded p-3 text-xs">
                {response}
              </pre>
            </div>
          )}

          {error && (
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-red-600 dark:text-red-400">
                Error:
              </h5>
              <pre className="rounded bg-red-50 p-3 text-xs text-wrap text-red-800 dark:bg-red-900/20 dark:text-red-200">
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
