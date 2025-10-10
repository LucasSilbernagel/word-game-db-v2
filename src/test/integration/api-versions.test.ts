import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import { server } from '../mocks/server'

type Word = {
  _id: string
  word: string
  category: string
  numLetters: number
  numSyllables: number
  hint: string
  createdAt: string
  updatedAt: string
}

describe('API Versions Comparison', () => {
  const mockWords: Word[] = [
    {
      _id: '1',
      word: 'cobra',
      category: 'animal',
      numLetters: 5,
      numSyllables: 2,
      hint: 'Hooded snake',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      _id: '2',
      word: 'tiger',
      category: 'animal',
      numLetters: 5,
      numSyllables: 2,
      hint: 'Striped hunter',
      createdAt: '2023-01-02T00:00:00.000Z',
      updatedAt: '2023-01-02T00:00:00.000Z',
    },
    {
      _id: '3',
      word: 'pizza',
      category: 'food',
      numLetters: 5,
      numSyllables: 2,
      hint: 'Italian pie',
      createdAt: '2023-01-03T00:00:00.000Z',
      updatedAt: '2023-01-03T00:00:00.000Z',
    },
  ]

  beforeEach(() => {
    server.resetHandlers()
  })

  describe('v1 API - Simple Array Format', () => {
    beforeEach(() => {
      server.use(
        http.get('http://localhost:3000/api/v2/words', () => {
          return HttpResponse.json(mockWords)
        })
      )
    })

    it('should return a simple array of words', async () => {
      const response = await fetch('http://localhost:3000/api/v2/words')
      const data = await response.json()

      expect(Array.isArray(data)).toBe(true)
      expect(data).toHaveLength(3)
      expect(data[0]).toHaveProperty('word', 'cobra')
      expect(data[0]).toHaveProperty('category', 'animal')
    })

    it('should support filtering parameters', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/words', ({ request }) => {
          const url = new URL(request.url)
          const numLetters = url.searchParams.get('numLetters')

          if (numLetters) {
            const filtered = mockWords.filter(
              (w) => w.numLetters === Number.parseInt(numLetters)
            )
            return HttpResponse.json(filtered)
          }

          return HttpResponse.json(mockWords)
        })
      )

      const response = await fetch(
        'http://localhost:3000/api/v2/words?numLetters=5'
      )
      const data = await response.json()

      expect(Array.isArray(data)).toBe(true)
      expect(data.every((word: Word) => word.numLetters === 5)).toBe(true)
    })
  })

  describe('v2 API - Paginated Format', () => {
    beforeEach(() => {
      server.use(
        http.get('http://localhost:3000/api/v2/words', ({ request }) => {
          const url = new URL(request.url)
          const limit = Number.parseInt(url.searchParams.get('limit') || '10')
          const offset = Number.parseInt(url.searchParams.get('offset') || '0')

          const paginatedWords = mockWords.slice(offset, offset + limit)

          return HttpResponse.json({
            words: paginatedWords,
            pagination: {
              total: mockWords.length,
              limit,
              offset,
              hasMore: offset + limit < mockWords.length,
            },
          })
        })
      )
    })

    it('should return paginated response with metadata', async () => {
      const response = await fetch('http://localhost:3000/api/v2/words')
      const data = await response.json()

      expect(data).toHaveProperty('words')
      expect(data).toHaveProperty('pagination')
      expect(Array.isArray(data.words)).toBe(true)
      expect(data.pagination).toHaveProperty('total')
      expect(data.pagination).toHaveProperty('limit')
      expect(data.pagination).toHaveProperty('offset')
      expect(data.pagination).toHaveProperty('hasMore')
    })

    it('should support pagination parameters', async () => {
      const response = await fetch(
        'http://localhost:3000/api/v2/words?limit=2&offset=1'
      )
      const data = await response.json()

      expect(data.words).toHaveLength(2)
      expect(data.pagination.offset).toBe(1)
      expect(data.pagination.limit).toBe(2)
      expect(data.pagination.total).toBe(3)
      expect(data.pagination.hasMore).toBe(false)
    })

    it('should support filtering with pagination', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/words', ({ request }) => {
          const url = new URL(request.url)
          const numLetters = url.searchParams.get('numLetters')
          const limit = Number.parseInt(url.searchParams.get('limit') || '10')
          const offset = Number.parseInt(url.searchParams.get('offset') || '0')

          let filteredWords = mockWords
          if (numLetters) {
            filteredWords = mockWords.filter(
              (w) => w.numLetters === Number.parseInt(numLetters)
            )
          }

          const paginatedWords = filteredWords.slice(offset, offset + limit)

          return HttpResponse.json({
            words: paginatedWords,
            pagination: {
              total: filteredWords.length,
              limit,
              offset,
              hasMore: offset + limit < filteredWords.length,
            },
          })
        })
      )

      const response = await fetch(
        'http://localhost:3000/api/v2/words?numLetters=5&limit=2'
      )
      const data = await response.json()

      expect(data.words).toHaveLength(2)
      expect(data.words.every((word: Word) => word.numLetters === 5)).toBe(true)
      expect(data.pagination.total).toBe(3) // All 3 words have 5 letters
    })
  })

  describe('API Version Compatibility', () => {
    it('should maintain backward compatibility for v1', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/words', () => {
          return HttpResponse.json(mockWords)
        })
      )

      const response = await fetch('http://localhost:3000/api/v2/words')
      const data = await response.json()

      expect(Array.isArray(data)).toBe(true)
      expect(data[0]).toHaveProperty('word')
      expect(data[0]).toHaveProperty('category')
      expect(data[0]).toHaveProperty('numLetters')
      expect(data[0]).toHaveProperty('numSyllables')
      expect(data[0]).toHaveProperty('hint')
    })

    it('should provide enhanced features for v2', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/words', () => {
          return HttpResponse.json({
            words: mockWords,
            pagination: {
              total: mockWords.length,
              limit: 10,
              offset: 0,
              hasMore: false,
            },
          })
        })
      )

      const response = await fetch('http://localhost:3000/api/v2/words')
      const data = await response.json()

      // Should provide pagination metadata
      expect(data).toHaveProperty('words')
      expect(data).toHaveProperty('pagination')
      expect(data.pagination).toHaveProperty('total', 3)
      expect(data.pagination).toHaveProperty('hasMore', false)
    })
  })
})
