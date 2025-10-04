import { GET } from '@/app/api/v1/words/search/route'
import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the database connection and models
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn(),
}))

vi.mock('@/models/word', () => ({
  default: {
    find: vi.fn(),
    countDocuments: vi.fn(),
  },
}))

describe('/api/v1/words/search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/v1/words/search', () => {
    it('should search words successfully', async () => {
      const mockSearchResults = [
        {
          _id: '507f1f77bcf86cd799439011',
          word: 'apple',
          category: 'fruit',
          numLetters: 5,
          numSyllables: 2,
          hint: 'A red fruit',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      ]

      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.find).mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockSearchResults),
      } as unknown as ReturnType<typeof mongooseModel.find>)

      vi.mocked(mongooseModel.countDocuments).mockResolvedValue(1)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/search?q=apple'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.words).toEqual(mockSearchResults)
      expect(data.query).toBe('apple')
      expect(data.pagination).toEqual({
        total: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      })
    })

    it('should return 400 when query parameter is missing', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/search'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Query parameter "q" is required')
    })

    it('should return 400 when query is too short', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/search?q=a'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Query must be at least 2 characters long')
    })

    it('should handle pagination correctly', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.find).mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as ReturnType<typeof mongooseModel.find>)

      vi.mocked(mongooseModel.countDocuments).mockResolvedValue(25)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/search?q=test&limit=10&offset=20'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination).toEqual({
        total: 25,
        limit: 10,
        offset: 20,
        hasMore: false,
      })
    })

    it('should create correct search filter', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.find).mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as ReturnType<typeof mongooseModel.find>)

      vi.mocked(mongooseModel.countDocuments).mockResolvedValue(0)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/search?q=Test'
      )
      await GET(request)

      expect(mongooseModel.find).toHaveBeenCalledWith({
        word: {
          $regex: 'test',
          $options: 'i',
        },
      })
    })

    it('should sort results alphabetically', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.find).mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as ReturnType<typeof mongooseModel.find>)

      vi.mocked(mongooseModel.countDocuments).mockResolvedValue(0)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/search?q=test'
      )
      await GET(request)

      expect(mongooseModel.find().sort).toHaveBeenCalledWith({ word: 1 })
    })
  })
})
