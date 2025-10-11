import { render, RenderOptions } from '@testing-library/react'
import { ReactElement, ReactNode } from 'react'

// Custom render function with providers
const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock data generators
export const createMockWord = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439011',
  word: 'apple',
  category: 'fruit',
  numLetters: 5,
  numSyllables: 2,
  hint: 'A red fruit',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  ...overrides,
})

export const createMockWords = (count: number) => {
  const categories = ['fruit', 'animal', 'color', 'food']
  const words = ['apple', 'banana', 'elephant', 'red', 'bread', 'orange']

  return Array.from({ length: count }, (_, index) =>
    createMockWord({
      _id: `word_${index}`,
      word: words[index % words.length],
      category: categories[index % categories.length],
      numLetters: 4 + (index % 6),
      numSyllables: 1 + (index % 4),
      hint: `Hint for ${words[index % words.length]}`,
    })
  )
}

export const createMockCategories = () => ['fruit', 'animal', 'color', 'food']

// API response generators
export const createMockApiResponse = (data: unknown, pagination = {}) => ({
  words: Array.isArray(data) ? data : [],
  pagination: {
    total: Array.isArray(data) ? data.length : 0,
    limit: 10,
    offset: 0,
    hasMore: false,
    ...pagination,
  },
})

export const createMockSearchResponse = (
  data: unknown,
  query: string,
  pagination = {}
) => ({
  words: Array.isArray(data) ? data : [],
  pagination: {
    total: Array.isArray(data) ? data.length : 0,
    limit: 10,
    offset: 0,
    hasMore: false,
    ...pagination,
  },
  query,
})

// Form state generators
export const createMockWordForm = (overrides = {}) => ({
  word: '',
  category: '',
  newCategory: '',
  numLetters: '',
  numSyllables: '',
  hint: '',
  categoryMode: 'existing' as const,
  ...overrides,
})

export const createMockSearchForm = (overrides = {}) => ({
  query: '',
  limit: '10',
  offset: '0',
  ...overrides,
})

export const createMockFilters = (overrides = {}) => ({
  category: '',
  numLetters: '',
  numSyllables: '',
  ...overrides,
})

// Test utilities
export const waitForApiCall = async (
  mockFn: { mock: { calls: unknown[] } },
  timeout = 1000
) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now()

    const check = () => {
      if (mockFn.mock.calls.length > 0) {
        resolve(mockFn.mock.calls[0])
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('API call timeout'))
      } else {
        setTimeout(check, 10)
      }
    }

    check()
  })
}

export const createMockFetchResponse = (data: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
})

// Error generators
export const createMockApiError = (message: string, status = 500) => ({
  error: message,
  details: 'Mock error for testing',
  status,
})

export const createMockValidationError = (missingFields: string[]) => ({
  error: `Missing required fields: ${missingFields.join(', ')}`,
  status: 400,
})

// Mock handlers for MSW
export const createMockHandlers = (baseUrl: string) => ({
  getWords: (words: unknown[]) => ({
    url: `${baseUrl}/words`,
    method: 'GET',
    response: createMockApiResponse(words),
  }),

  createWord: (wordData: unknown) => ({
    url: `${baseUrl}/words`,
    method: 'POST',
    response: createMockWord(wordData as object),
    status: 201,
  }),

  searchWords: (query: string, results: unknown[]) => ({
    url: `${baseUrl}/words/search`,
    method: 'GET',
    response: createMockSearchResponse(results, query),
  }),

  getCategories: (categories: string[]) => ({
    url: `${baseUrl}/categories`,
    method: 'GET',
    response: categories,
  }),
})

// Performance testing utilities
export const measurePerformance = async (fn: () => Promise<unknown>) => {
  const startTime = Date.now()
  const result = await fn()
  const endTime = Date.now()

  return {
    result,
    duration: endTime - startTime,
  }
}

// Accessibility testing utilities
export const getAccessibleElements = (container: {
  querySelectorAll: (selector: string) => unknown
}) => {
  return {
    buttons: container.querySelectorAll('button'),
    inputs: container.querySelectorAll('input'),
    links: container.querySelectorAll('a'),
    headings: container.querySelectorAll('h1, h2, h3, h4, h5, h6'),
    labels: container.querySelectorAll('label'),
  }
}

export { customRender as render }
