import EndpointDemo from '@/components/endpoint-demo'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Link from 'next/link'

const allApiEndpoints = [
  {
    method: 'GET',
    path: '/api/v1/words',
    description: 'Retrieve all words with direct query filtering',
    example: 'GET /api/v1/words?category=animals&numLetters=5',
  },
  {
    method: 'GET',
    path: '/api/v1/words/random',
    description: 'Get a random word from the database',
    example: 'GET /api/v1/words/random',
  },
  {
    method: 'GET',
    path: '/api/v1/categories',
    description: 'Get all distinct categories',
    example: 'GET /api/v1/categories',
  },
  {
    method: 'GET',
    path: '/api/v1/words/[id]',
    description: 'Get a specific word by ID',
    example: 'GET /api/v1/words/507f1f77bcf86cd799439011',
  },
  {
    method: 'POST',
    path: '/api/v1/words',
    description: 'Create a new word entry',
    example:
      'POST /api/v1/words { "word": "example", "category": "animals", "numLetters": 7, "numSyllables": 2, "hint": "A furry pet" }',
    isDestructive: true,
  },
  {
    method: 'PUT',
    path: '/api/v1/words/[id]',
    description: 'Update an existing word',
    example:
      'PUT /api/v1/words/507f1f77bcf86cd799439011 { "hint": "Updated hint" }',
    isDestructive: true,
  },
  {
    method: 'DELETE',
    path: '/api/v1/words/[id]',
    description: 'Delete a word from the database',
    example: 'DELETE /api/v1/words/507f1f77bcf86cd799439011',
    isDestructive: true,
  },
  {
    method: 'GET',
    path: '/api/v1/words/search',
    description: 'Search for words by various criteria',
    example: 'GET /api/v1/words/search?q=puzzle&type=crossword',
  },
]

export default function Home() {
  // Filter endpoints based on environment variable
  const isDestructiveEnabled =
    process.env.ENABLE_DESTRUCTIVE_ENDPOINTS === 'true'
  const apiEndpoints = allApiEndpoints.filter(
    (endpoint) => !endpoint.isDestructive || isDestructiveEnabled
  )

  // Debug information (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment check:', {
      ENABLE_DESTRUCTIVE_ENDPOINTS: process.env.ENABLE_DESTRUCTIVE_ENDPOINTS,
      isDestructiveEnabled,
      totalEndpoints: allApiEndpoints.length,
      filteredEndpoints: apiEndpoints.length,
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
                      {endpoint.path}
                    </code>
                  </div>
                  <CardTitle className="text-lg">
                    {endpoint.description}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 text-muted-foreground text-sm">Example:</p>
                  <code className="block bg-muted p-2 rounded text-sm">
                    {endpoint.example}
                  </code>
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
          </div>
        </div>

        <div className="gap-6 grid md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                What makes this database special
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Comprehensive word database</li>
                <li>• Advanced search capabilities</li>
                <li>• RESTful API design</li>
                <li>• TypeScript support</li>
                <li>• MongoDB integration</li>
                <li>• Real-time updates</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Quick start guide</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                <li>1. Set up your MongoDB connection</li>
                <li>2. Configure environment variables</li>
                <li>3. Start making API requests</li>
                <li>4. Explore the available endpoints</li>
                <li>5. Build your word game application</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
