import { GET } from '@/app/api/v1/categories/route'
import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the database connection and models
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn(),
}))

vi.mock('@/models/word', () => ({
  default: {
    distinct: vi.fn(),
  },
}))

describe('/api/v1/categories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/v1/categories', () => {
    it('should return all categories', async () => {
      const mockCategories = ['fruit', 'animal', 'color', 'food']

      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.distinct).mockResolvedValue(mockCategories)

      const request = new NextRequest('http://localhost:3000/api/v1/categories')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockCategories)
      expect(mongooseModel.distinct).toHaveBeenCalledWith('category')
    })

    it('should return empty array when no categories exist', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.distinct).mockResolvedValue([])

      const request = new NextRequest('http://localhost:3000/api/v1/categories')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual([])
    })

    it('should handle database errors gracefully', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.distinct).mockRejectedValue(
        new Error('Database error')
      )

      // The withGetWrapper should handle the error and return a 500 response
      const request = new NextRequest('http://localhost:3000/api/v1/categories')
      const response = await GET(request)

      expect(response.status).toBe(500)
    })
  })
})
