'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'

type EndpointDemoProps = {
  method: string
  path: string
  description?: string
  example?: string
}

export default function EndpointDemo({ method, path }: EndpointDemoProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const isDestructiveEndpoint = ['POST', 'PUT', 'DELETE'].includes(method)

  const handleDemo = async () => {
    setIsLoading(true)
    setResponse(null)
    setError(null)

    try {
      let url = path
      let options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      }

      // Handle different endpoint types
      if (method === 'GET') {
        switch (path) {
          case '/api/v1/words': {
            // Add some query parameters for demo
            url = '/api/v1/words?limit=3'

            break
          }
          case '/api/v1/words/[id]': {
            // For demo purposes, we'll need to get a real ID first
            const wordsResponse = await fetch('/api/v1/words?limit=1')
            const wordsData = await wordsResponse.json()
            if (wordsData.words && wordsData.words.length > 0) {
              url = `/api/v1/words/${wordsData.words[0]._id}`
            } else {
              throw new Error('No words available for demo')
            }

            break
          }
          case '/api/v1/words/search': {
            url = '/api/v1/words/search?q=test&limit=3'

            break
          }
          // No default
        }
      } else if (isDestructiveEndpoint) {
        // For destructive endpoints, show a message instead of making the request
        setResponse(
          'This endpoint is disabled in production. To test it locally, set ENABLE_DESTRUCTIVE_ENDPOINTS=true in your .env.local file.'
        )
        setIsLoading(false)
        return
      }

      const res = await fetch(url, options)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`)
      }

      setResponse(JSON.stringify(data, null, 2))
    } catch (error_) {
      setError(error_ instanceof Error ? error_.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-sm">Live Demo</h4>
            <Button
              onClick={handleDemo}
              disabled={isLoading}
              size="sm"
              variant={isDestructiveEndpoint ? 'outline' : 'default'}
            >
              {isLoading ? 'Testing...' : 'Test Endpoint'}
            </Button>
          </div>

          {isDestructiveEndpoint && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 border border-yellow-200 dark:border-yellow-800 rounded-md">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>Note:</strong> This endpoint is disabled in production
                for security. To test it locally, set{' '}
                <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded text-xs">
                  ENABLE_DESTRUCTIVE_ENDPOINTS=true
                </code>{' '}
                in your .env.local file.
              </p>
            </div>
          )}

          {response && (
            <div className="space-y-2">
              <h5 className="font-medium text-green-600 dark:text-green-400 text-sm">
                Response:
              </h5>
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
              <pre className="bg-red-50 dark:bg-red-900/20 p-3 rounded text-red-800 dark:text-red-200 text-xs">
                {error}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
