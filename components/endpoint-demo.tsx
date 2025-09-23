'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useState } from 'react'

type EndpointDemoProps = {
  method: string
  path: string
  description?: string
  example?: string
  isDestructiveEnabled?: boolean
}

export default function EndpointDemo({
  method,
  path,
  isDestructiveEnabled = false,
}: EndpointDemoProps) {
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
      } else if (isDestructiveEndpoint && !isDestructiveEnabled) {
        // For destructive endpoints when not enabled, show a message instead of making the request
        setResponse(
          'This endpoint is disabled. To test it, set ENABLE_DESTRUCTIVE_ENDPOINTS=true in your environment variables.'
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
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Live Demo</h4>
            <Button
              onClick={handleDemo}
              disabled={isLoading}
              size="sm"
              variant={isDestructiveEndpoint ? 'outline' : 'default'}
            >
              {isLoading ? 'Testing...' : 'Test Endpoint'}
            </Button>
          </div>

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
              <h5 className="text-sm font-medium text-green-600 dark:text-green-400">
                Response:
              </h5>
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
              <pre className="rounded bg-red-50 p-3 text-xs text-red-800 dark:bg-red-900/20 dark:text-red-200">
                {error}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
