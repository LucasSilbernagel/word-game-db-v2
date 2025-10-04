import '@testing-library/jest-dom'
import React from 'react'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { server } from './mocks/server'

// Mock Element for test environment
globalThis.Element = globalThis.Element || class Element {}

// Establish API mocking before all tests
beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'warn',
  })
})

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => {
  server.resetHandlers()
})

// Clean up after the tests are finished
afterAll(() => {
  server.close()
})

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    entries: vi.fn(),
    forEach: vi.fn(),
    toString: vi.fn(),
  }),
  usePathname: () => '/',
}))

// Mock Next.js image component
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string
    alt: string
    [key: string]: unknown
  }) => {
    return React.createElement('img', { src, alt, ...props })
  },
}))

// Mock environment variables
vi.stubEnv('NODE_ENV', 'test')
vi.stubEnv('MONGODB_URI', 'mongodb://localhost:27017/test')
vi.stubEnv('ENABLE_DESTRUCTIVE_ENDPOINTS', 'true')

// Mock scrollIntoView for Radix UI components
;(
  globalThis.Element as { prototype: { scrollIntoView: unknown } }
).prototype.scrollIntoView = vi.fn()
