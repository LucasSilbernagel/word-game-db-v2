import { DELETE, GET, PUT } from '@/app/api/v1/words/[id]/route'
import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the database connection and models
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn(),
}))

vi.mock('@/models/word', () => ({
  default: {
    findById: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  },
}))

describe('/api/v1/words/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/v1/words/[id]', () => {
    it('should return word by ID', async () => {
      const mockWord = {
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

      vi.mocked(mongooseModel.findById).mockResolvedValue(mockWord)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/507f1f77bcf86cd799439011'
      )
      const response = await GET(request, {
        params: { id: '507f1f77bcf86cd799439011' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockWord)
      expect(mongooseModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011'
      )
    })

    it('should return 404 when word not found', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.findById).mockResolvedValue(null)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/nonexistent'
      )
      const response = await GET(request, { params: { id: 'nonexistent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Word not found')
    })
  })

  describe('PUT /api/v1/words/[id]', () => {
    it('should update word successfully', async () => {
      const updateData = {
        word: 'green apple',
        hint: 'A green variety of apple',
      }

      const updatedWord = {
        _id: '507f1f77bcf86cd799439011',
        word: 'green apple',
        category: 'fruit',
        numLetters: 11,
        numSyllables: 3,
        hint: 'A green variety of apple',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      }

      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.findByIdAndUpdate).mockResolvedValue(updatedWord)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/507f1f77bcf86cd799439011',
        {
          method: 'PUT',
          body: JSON.stringify(updateData),
        }
      )

      const response = await PUT(request, {
        params: { id: '507f1f77bcf86cd799439011' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(updatedWord)
      expect(mongooseModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateData,
        { new: true, runValidators: true }
      )
    })

    it('should return 404 when word not found for update', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.findByIdAndUpdate).mockResolvedValue(null)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/nonexistent',
        {
          method: 'PUT',
          body: JSON.stringify({ word: 'updated' }),
        }
      )

      const response = await PUT(request, { params: { id: 'nonexistent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Word not found')
    })

    it('should validate required fields for update', async () => {
      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/507f1f77bcf86cd799439011',
        {
          method: 'PUT',
          body: JSON.stringify({}), // Empty body
        }
      )

      const response = await PUT(request, {
        params: { id: '507f1f77bcf86cd799439011' },
      })

      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /api/v1/words/[id]', () => {
    it('should delete word successfully', async () => {
      const deletedWord = {
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

      vi.mocked(mongooseModel.findByIdAndDelete).mockResolvedValue(deletedWord)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/507f1f77bcf86cd799439011',
        {
          method: 'DELETE',
        }
      )

      const response = await DELETE(request, {
        params: { id: '507f1f77bcf86cd799439011' },
      })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({ message: 'Word deleted successfully' })
      expect(mongooseModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011'
      )
    })

    it('should return 404 when word not found for deletion', async () => {
      const Word = await import('@/models/word')
      const { default: mongooseModel } = Word

      vi.mocked(mongooseModel.findByIdAndDelete).mockResolvedValue(null)

      const request = new NextRequest(
        'http://localhost:3000/api/v1/words/nonexistent',
        {
          method: 'DELETE',
        }
      )

      const response = await DELETE(request, { params: { id: 'nonexistent' } })
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Word not found')
    })
  })
})
