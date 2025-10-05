import { GET } from '@/app/api/v1/words/random/route'
import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the database connection and models
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn(),
}))

vi.mock('@/models/word', () => {
  const mockWord = Object.assign(vi.fn(), {
    countDocuments: vi.fn(),
    findOne: vi.fn(),
  })

  return {
    default: mockWord,
  }
})

describe('/api/v1/words/random', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/v1/words/random', () => {
    it('should return a random word', async () => {
      const mockRandomWord = {
        _id: '507f1f77bcf86cd799439011',
        word: 'apple',
        category: 'fruit',
        numLetters: 5,
        numSyllables: 2,
        hint: 'A red fruit',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }

      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.countDocuments).mockResolvedValue(1)
      vi.mocked(mongooseModel.findOne).mockReturnValue({
        skip: vi.fn().mockResolvedValue(mockRandomWord),
      } as unknown as ReturnType<typeof mongooseModel.findOne>)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/random'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockRandomWord)
      expect(mongooseModel.countDocuments).toHaveBeenCalled()
      expect(mongooseModel.findOne).toHaveBeenCalled()
    })

    it('should return a random word from specific category', async () => {
      const mockRandomWord = {
        _id: '507f1f77bcf86cd799439011',
        word: 'apple',
        category: 'fruit',
        numLetters: 5,
        numSyllables: 2,
        hint: 'A red fruit',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }

      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.countDocuments).mockResolvedValue(1)
      vi.mocked(mongooseModel.findOne).mockReturnValue({
        skip: vi.fn().mockResolvedValue(mockRandomWord),
      } as unknown as ReturnType<typeof mongooseModel.findOne>)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/random?category=fruit'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockRandomWord)
      expect(mongooseModel.countDocuments).toHaveBeenCalled()
      expect(mongooseModel.findOne).toHaveBeenCalled()
    })

    it('should return 404 when no words found', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.countDocuments).mockResolvedValue(0)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/random'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('No words found in database')
    })

    it('should return 404 when no words found in specific category', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.countDocuments).mockResolvedValue(0)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/random?category=nonexistent'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('No words found in database')
    })

    it('should handle database errors gracefully', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      mongooseModel.countDocuments = vi
        .fn()
        .mockRejectedValue(new Error('Database error'))

      // Suppress console.error for this test since we're testing error handling
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/random'
      )

      // The withGetWrapper should handle the error and return a 500 response
      const response = await GET(request)

      expect(response.status).toBe(500)

      // Restore console.error
      consoleSpy.mockRestore()
    })
  })
})
