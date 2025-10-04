import { GET, POST } from '@/app/api/v1/words/route'
import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the database connection and models
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn(),
}))

vi.mock('@/models/word', () => {
  const mockSave = vi.fn()
  const mockWord = Object.assign(
    vi.fn().mockImplementation((data) => ({
      ...data,
      save: mockSave,
    })),
    {
      find: vi.fn(),
      countDocuments: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
    }
  )

  return {
    default: mockWord,
  }
})

describe('/api/v1/words', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/v1/words', () => {
    it('should return words with pagination', async () => {
      const mockWords = [
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

      // Mock the static methods
      mongooseModel.find = vi.fn().mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue(mockWords),
      })

      mongooseModel.countDocuments = vi.fn().mockResolvedValue(1)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words?limit=10&offset=0'
      )
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.words).toEqual(mockWords)
      expect(data.pagination).toEqual({
        total: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      })
    })

    it('should filter words by category', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.find).mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as ReturnType<typeof mongooseModel.find>)

      vi.mocked(mongooseModel.countDocuments).mockResolvedValue(0)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words?category=fruit'
      )
      await GET(request)

      expect(mongooseModel.find).toHaveBeenCalledWith({
        category: 'fruit',
      })
    })

    it('should filter words by number of letters', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.find).mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as ReturnType<typeof mongooseModel.find>)

      vi.mocked(mongooseModel.countDocuments).mockResolvedValue(0)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words?minLetters=5'
      )
      await GET(request)

      expect(mongooseModel.find).toHaveBeenCalledWith({
        numLetters: { $gte: 5 },
      })
    })

    it('should handle default pagination parameters', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.find).mockReturnValue({
        limit: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        lean: vi.fn().mockResolvedValue([]),
      } as unknown as ReturnType<typeof mongooseModel.find>)

      vi.mocked(mongooseModel.countDocuments).mockResolvedValue(0)

      const request = new NextRequest('http://localhost:3000/api/v1/words')
      const response = await GET(request)
      const data = await response.json()

      expect(data.pagination.limit).toBe(10)
      expect(data.pagination.offset).toBe(0)
    })
  })

  describe('POST /api/v1/words', () => {
    it('should create a new word successfully', async () => {
      const newWordData = {
        word: 'orange',
        category: 'fruit',
        numLetters: 6,
        numSyllables: 2,
        hint: 'A citrus fruit',
      }

      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.findOne).mockResolvedValue(null)

      const mockSave = vi.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439012',
        ...newWordData,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      })

      // Mock the Word constructor to return an object with save method
      vi.mocked(mongooseModel).mockImplementation((data) => ({
        ...(data as object),
        save: mockSave,
      }))

      const request = new NextRequest('http://localhost:3000/api/v1/words', {
        method: 'POST',
        body: JSON.stringify(newWordData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.word).toBe('orange')
      expect(data.category).toBe('fruit')
    })

    it('should return 409 if word already exists', async () => {
      const newWordData = {
        word: 'apple',
        category: 'fruit',
        numLetters: 5,
        numSyllables: 2,
        hint: 'A red fruit',
      }

      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.findOne).mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        word: 'apple',
      })

      const request = new NextRequest('http://localhost:3000/api/v1/words', {
        method: 'POST',
        body: JSON.stringify(newWordData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Word already exists')
    })

    it('should return 400 for missing required fields', async () => {
      const incompleteWordData = {
        word: 'banana',
        category: 'fruit',
        // Missing numLetters, numSyllables, hint
      }

      const request = new NextRequest('http://localhost:3000/api/v1/words', {
        method: 'POST',
        body: JSON.stringify(incompleteWordData),
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('should validate and transform word data', async () => {
      const wordData = {
        word: 'APPLE',
        category: 'FRUIT',
        numLetters: 5,
        numSyllables: 2,
        hint: 'A red fruit',
      }

      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.findOne).mockResolvedValue(null)

      const mockSave = vi.fn().mockResolvedValue({
        _id: '507f1f77bcf86cd799439013',
        word: 'apple',
        category: 'fruit',
        numLetters: 5,
        numSyllables: 2,
        hint: 'A red fruit',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      })

      // Mock the Word constructor to return an object with save method
      vi.mocked(mongooseModel).mockImplementation((data) => ({
        ...(data as object),
        save: mockSave,
      }))

      const request = new NextRequest('http://localhost:3000/api/v1/words', {
        method: 'POST',
        body: JSON.stringify(wordData),
      })

      await POST(request)

      expect(mongooseModel).toHaveBeenCalledWith({
        word: 'apple',
        category: 'fruit',
        numLetters: 5,
        numSyllables: 2,
        hint: 'A red fruit',
      })
    })
  })
})
