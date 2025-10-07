'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { API_ROUTES, DEMO_DATA } from '@/lib/constants'
import Link from 'next/link'
import { lazy, Suspense, useEffect, useState } from 'react'
const EndpointDemo = lazy(
  () => import('@/components/EndpointDemo/EndpointDemo')
)

const allApiEndpoints = [
  {
    method: 'GET',
    path: API_ROUTES.CATEGORIES,
    description: 'Get all distinct categories',
    example: `GET ${API_ROUTES.CATEGORIES}`,
  },
  {
    method: 'GET',
    path: API_ROUTES.WORDS_RANDOM,
    description: 'Get a random word from the database',
    example: `GET ${API_ROUTES.WORDS_RANDOM}`,
  },
  {
    method: 'GET',
    path: API_ROUTES.WORDS_WITH_ID,
    description: 'Get a specific word by ID',
    example: `GET ${API_ROUTES.WORDS}/${DEMO_DATA.WORD_ID}`,
  },
  {
    method: 'GET',
    path: API_ROUTES.WORDS,
    description:
      'Retrieve all words with optional query filtering and pagination',
  },
  {
    method: 'GET',
    path: API_ROUTES.WORDS_SEARCH,
    description: 'Search for words by name with partial matching',
  },
  {
    method: 'POST',
    path: API_ROUTES.WORDS,
    description: 'Create a new word entry',
    isDestructive: true,
  },
  {
    method: 'PUT',
    path: API_ROUTES.WORDS_WITH_ID,
    description: 'Update an existing word',
    isDestructive: true,
  },
  {
    method: 'DELETE',
    path: API_ROUTES.WORDS_WITH_ID,
    description: 'Delete a word from the database',
    isDestructive: true,
  },
]

const HomePage = () => {
  const [isClient, setIsClient] = useState(false)
  const [isDestructiveEnabled, setIsDestructiveEnabled] = useState(false)
  const [isLoadingConfig, setIsLoadingConfig] = useState(true)
  const [categories, setCategories] = useState<string[]>([])

  // Ensure hydration consistency
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch destructive endpoints status from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(API_ROUTES.CONFIG, {
          // Add cache headers for better performance
          headers: {
            'Cache-Control': 'max-age=300', // Cache for 5 minutes
          },
        })
        if (res.ok) {
          const data = await res.json()
          setIsDestructiveEnabled(data.destructiveEndpointsEnabled)
        }
      } catch (error) {
        console.error('Failed to fetch config:', error)
      } finally {
        setIsLoadingConfig(false)
      }
    }

    if (isClient) {
      fetchConfig()
    }
  }, [isClient])

  // Fetch categories once for all EndpointDemo components
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API_ROUTES.CATEGORIES, {
          // Add cache headers for better performance
          headers: {
            'Cache-Control': 'max-age=3600', // Cache for 1 hour
          },
        })
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    if (isClient) {
      fetchCategories()
    }
  }, [isClient])

  // Always show all endpoints during SSR and initial client render
  // Only filter after config is loaded on client
  const apiEndpoints =
    !isClient || !isLoadingConfig
      ? allApiEndpoints.filter(
          (endpoint) => !endpoint.isDestructive || isDestructiveEnabled
        )
      : allApiEndpoints.filter((endpoint) => !endpoint.isDestructive)

  // Debug information (remove in production)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Environment check:', {
        isDestructiveEnabled,
        totalEndpoints: allApiEndpoints.length,
        filteredEndpoints: apiEndpoints.length,
        isLoadingConfig,
      })
    }
  }, [isDestructiveEnabled, apiEndpoints.length, isLoadingConfig])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Word Game DB
          </h1>
          <p className="text-muted-foreground mb-8 text-xl">
            A read-only REST API for educational word game development
          </p>
          <nav aria-label="Main navigation">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <Button asChild>
                <Link href="/about">Learn More About Word Game DB</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </nav>
        </header>

        <section className="mb-12" aria-labelledby="about-heading">
          <h2 id="about-heading" className="sr-only">
            About Word Game DB
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="dark:prose-invert prose prose-gray max-w-none text-center">
                <p className="text-lg">
                  <span className="text-primary font-semibold">
                    Word Game DB
                  </span>{' '}
                  is designed for educational purposes, helping developers
                  practice their coding skills by building word games that
                  incorporate an API. Each word comes with a category, letter
                  count, syllable count, and helpful hint.
                </p>
                <p className="text-muted-foreground">
                  Perfect for building hangman games, word puzzles, vocabulary
                  apps, and other projects.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12" aria-labelledby="api-versions-heading">
          <h2 id="api-versions-heading" className="mb-6 text-2xl font-semibold">
            API Versions
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="rounded bg-green-100 px-2 py-1 font-mono text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
                    v2
                  </span>
                  Paginated Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Returns paginated data with metadata.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Response Format:</h4>
                  <code className="bg-muted block rounded p-2 text-sm">
                    &#123;words: [&#123;word: "cobra", category: "animal",
                    ...&#125;, ...], pagination: &#123;total, limit, offset,
                    hasMore&#125;&#125;
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="rounded bg-blue-100 px-2 py-1 font-mono text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    v1
                  </span>
                  <span className="rounded bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    Legacy
                  </span>
                  Simple Array Format
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Returns a simple array of word objects.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold">Response Format:</h4>
                  <code className="bg-muted block rounded p-2 text-sm">
                    [&#123;word: "cobra", category: "animal", ...&#125;, ...]
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="api-endpoints-heading">
          <h2
            id="api-endpoints-heading"
            className="mb-6 text-2xl font-semibold"
          >
            API Endpoints
          </h2>
          <ul
            className="grid list-none grid-cols-1 gap-4"
            aria-label="API endpoints"
          >
            {apiEndpoints.map((endpoint, index) => (
              <li key={index}>
                <Card>
                  <CardHeader>
                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                      <span
                        className={`rounded px-2 py-1 font-mono text-xs ${(() => {
                          if (endpoint.method === 'GET') {
                            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }
                          if (endpoint.method === 'POST') {
                            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }
                          if (endpoint.method === 'PUT') {
                            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }
                          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        })()}`}
                        aria-label={`HTTP method: ${endpoint.method}`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="bg-muted overflow-hidden rounded px-2 py-1 font-mono text-sm break-all">
                        https://www.wordgamedb.com{endpoint.path}
                      </code>
                    </div>
                    <CardTitle className="text-lg">
                      {endpoint.description}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {endpoint.example && (
                      <>
                        <p className="text-muted-foreground mb-2 text-sm">
                          Example:
                        </p>
                        <code className="bg-muted block rounded p-2 text-sm break-all">
                          {endpoint.example}
                        </code>
                      </>
                    )}
                    <Suspense
                      fallback={
                        <div className="flex items-center justify-center py-4">
                          <div
                            className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
                            aria-hidden="true"
                          />
                          <span className="text-muted-foreground ml-2 text-sm">
                            Loading demo...
                          </span>
                        </div>
                      }
                    >
                      <EndpointDemo
                        method={endpoint.method}
                        path={endpoint.path}
                        description={endpoint.description}
                        example={endpoint.example}
                        isDestructiveEnabled={isDestructiveEnabled}
                        categories={categories}
                      />
                    </Suspense>
                  </CardContent>
                </Card>
              </li>
            ))}
            {isClient && isLoadingConfig && (
              <li>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center py-4">
                      <div
                        className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground ml-2 text-sm">
                        Loading additional endpoints...
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  )
}

export default HomePage
