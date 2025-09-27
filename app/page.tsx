'use client'

import EndpointDemo from '@/components/endpoint-demo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const allApiEndpoints = [
  {
    method: 'GET',
    path: '/api/v1/categories',
    description: 'Get all distinct categories',
    example: 'GET /api/v1/categories',
  },
  {
    method: 'GET',
    path: '/api/v1/words/random',
    description: 'Get a random word from the database',
    example: 'GET /api/v1/words/random',
  },
  {
    method: 'GET',
    path: '/api/v1/words/[id]',
    description: 'Get a specific word by ID',
    example: 'GET /api/v1/words/5ffa1774c0831cbe1460e29c',
  },
  {
    method: 'GET',
    path: '/api/v1/words',
    description:
      'Retrieve all words with optional query filtering and pagination',
  },
  {
    method: 'POST',
    path: '/api/v1/words',
    description: 'Create a new word entry',
    isDestructive: true,
  },
  {
    method: 'PUT',
    path: '/api/v1/words/[id]',
    description: 'Update an existing word',
    isDestructive: true,
  },
  {
    method: 'DELETE',
    path: '/api/v1/words/[id]',
    description: 'Delete a word from the database',
    isDestructive: true,
  },
]

export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [isDestructiveEnabled, setIsDestructiveEnabled] = useState(false)
  const [isLoadingConfig, setIsLoadingConfig] = useState(true)

  // Ensure hydration consistency
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch destructive endpoints status from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/v1/config')
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

  const apiEndpoints = allApiEndpoints.filter(
    (endpoint) => !endpoint.isDestructive || isDestructiveEnabled
  )

  // Debug information (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment check:', {
      isDestructiveEnabled,
      totalEndpoints: allApiEndpoints.length,
      filteredEndpoints: apiEndpoints.length,
      isLoadingConfig,
    })
  }
  return (
    <div className="mx-auto px-4 py-8 container">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-4xl tracking-tight">
            Word Game DB
          </h1>
          <p className="mb-8 text-muted-foreground text-xl">
            A read-only REST API for educational word game development
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/about">Learn More</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>

        <div className="mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="dark:prose-invert max-w-none text-center prose prose-gray">
                <p className="text-lg">
                  <span className="font-semibold text-primary">
                    Word Game DB
                  </span>{' '}
                  is designed for educational purposes, helping developers
                  practice their coding skills by building word games that
                  incorporate an API. Each word comes with a category, letter
                  count, syllable count, and helpful hint.
                </p>
                <p className="text-muted-foreground">
                  Perfect for building hangman games, word puzzles, vocabulary
                  apps, and other educational projects.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="mb-6 font-semibold text-2xl">API Endpoints</h2>
          <div className="gap-4 grid">
            {apiEndpoints.map((endpoint, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
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
                    >
                      {endpoint.method}
                    </span>
                    <code className="bg-muted px-2 py-1 rounded font-mono text-sm">
                      https://wordgamedb.com{endpoint.path}
                    </code>
                  </div>
                  <CardTitle className="text-lg">
                    {endpoint.description}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {endpoint.example && (
                    <>
                      <p className="mb-2 text-muted-foreground text-sm">
                        Example:
                      </p>
                      <code className="block bg-muted p-2 rounded text-sm">
                        {endpoint.example}
                      </code>
                    </>
                  )}
                  <EndpointDemo
                    method={endpoint.method}
                    path={endpoint.path}
                    description={endpoint.description}
                    example={endpoint.example}
                    isDestructiveEnabled={isDestructiveEnabled}
                  />
                </CardContent>
              </Card>
            ))}
            {isLoadingConfig && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-center items-center py-4">
                    <div className="border-2 border-primary border-t-transparent rounded-full w-6 h-6 animate-spin" />
                    <span className="ml-2 text-muted-foreground text-sm">
                      Loading additional endpoints...
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
