import {
  buildWordFilter,
  createRangeFilter,
  extractPaginationParams,
  validateAndTransformWordData,
  validateRequiredFields,
} from '@/lib/utils/validation'
import { describe, expect, it } from 'vitest'

describe('validation utils', () => {
  describe('validateRequiredFields', () => {
    it('should return null when all required fields are present', () => {
      const data = {
        word: 'apple',
        category: 'fruit',
        numLetters: 5,
        numSyllables: 2,
        hint: 'A red fruit',
      }
      const requiredFields = [
        'word',
        'category',
        'numLetters',
        'numSyllables',
        'hint',
      ]

      const result = validateRequiredFields(data, requiredFields)

      expect(result).toBeNull()
    })

    it('should return error response when required fields are missing', () => {
      const data = {
        word: 'apple',
        category: 'fruit',
        // Missing numLetters, numSyllables, hint
      }
      const requiredFields = [
        'word',
        'category',
        'numLetters',
        'numSyllables',
        'hint',
      ]

      const result = validateRequiredFields(data, requiredFields)

      expect(result).not.toBeNull()
      expect(result?.status).toBe(400)
    })

    it('should return error response for empty string values', () => {
      const data = {
        word: '',
        category: 'fruit',
        numLetters: 5,
        numSyllables: 2,
        hint: 'A red fruit',
      }
      const requiredFields = [
        'word',
        'category',
        'numLetters',
        'numSyllables',
        'hint',
      ]

      const result = validateRequiredFields(data, requiredFields)

      expect(result).not.toBeNull()
      expect(result?.status).toBe(400)
    })

    it('should return error response for null/undefined values', () => {
      const data = {
        word: 'apple',
        category: null,
        numLetters: undefined,
        numSyllables: 2,
        hint: 'A red fruit',
      }
      const requiredFields = [
        'word',
        'category',
        'numLetters',
        'numSyllables',
        'hint',
      ]

      const result = validateRequiredFields(data, requiredFields)

      expect(result).not.toBeNull()
      expect(result?.status).toBe(400)
    })
  })

  describe('validateAndTransformWordData', () => {
    it('should transform word data correctly', () => {
      const data = {
        word: 'APPLE',
        category: 'FRUIT',
        numLetters: '5',
        numSyllables: '2',
        hint: 'A red fruit',
      }

      const result = validateAndTransformWordData(data)

      expect(result).toEqual({
        word: 'apple',
        category: 'fruit',
        numLetters: 5,
        numSyllables: 2,
        hint: 'A red fruit',
      })
    })

    it('should handle non-string word and category', () => {
      const data = {
        word: 123,
        category: 456,
        numLetters: '5',
        numSyllables: '2',
        hint: 'A red fruit',
      }

      const result = validateAndTransformWordData(data)

      expect(result).toEqual({
        word: 123,
        category: 456,
        numLetters: 5,
        numSyllables: 2,
        hint: 'A red fruit',
      })
    })

    it('should handle missing numLetters and numSyllables', () => {
      const data = {
        word: 'apple',
        category: 'fruit',
        hint: 'A red fruit',
      }

      const result = validateAndTransformWordData(data)

      expect(result).toEqual({
        word: 'apple',
        category: 'fruit',
        numLetters: undefined,
        numSyllables: undefined,
        hint: 'A red fruit',
      })
    })
  })

  describe('createRangeFilter', () => {
    it('should return undefined when both values are null', () => {
      const result = createRangeFilter(null, null)

      expect(result).toBeUndefined()
    })

    it('should return undefined when both values are empty strings', () => {
      const result = createRangeFilter('', '')

      expect(result).toBeUndefined()
    })

    it('should create filter with only minimum value', () => {
      const result = createRangeFilter('5', null)

      expect(result).toEqual({ $gte: 5 })
    })

    it('should create filter with only maximum value', () => {
      const result = createRangeFilter(null, '10')

      expect(result).toEqual({ $lte: 10 })
    })

    it('should create filter with both minimum and maximum values', () => {
      const result = createRangeFilter('5', '10')

      expect(result).toEqual({ $gte: 5, $lte: 10 })
    })

    it('should handle empty string values', () => {
      const result = createRangeFilter('', '10')

      expect(result).toEqual({ $lte: 10 })
    })
  })

  describe('buildWordFilter', () => {
    it('should build empty filter when no parameters provided', () => {
      const searchParams = new URLSearchParams()

      const result = buildWordFilter(searchParams)

      expect(result).toEqual({})
    })

    it('should build filter with category only', () => {
      const searchParams = new URLSearchParams('category=fruit')

      const result = buildWordFilter(searchParams)

      expect(result).toEqual({ category: 'fruit' })
    })

    it('should build filter with letter range', () => {
      const searchParams = new URLSearchParams('minLetters=5&maxLetters=10')

      const result = buildWordFilter(searchParams)

      expect(result).toEqual({
        numLetters: { $gte: 5, $lte: 10 },
      })
    })

    it('should build filter with syllable range', () => {
      const searchParams = new URLSearchParams('minSyllables=1&maxSyllables=3')

      const result = buildWordFilter(searchParams)

      expect(result).toEqual({
        numSyllables: { $gte: 1, $lte: 3 },
      })
    })

    it('should build complex filter with all parameters', () => {
      const searchParams = new URLSearchParams(
        'category=fruit&minLetters=5&maxLetters=10&minSyllables=1&maxSyllables=3'
      )

      const result = buildWordFilter(searchParams)

      expect(result).toEqual({
        category: 'fruit',
        numLetters: { $gte: 5, $lte: 10 },
        numSyllables: { $gte: 1, $lte: 3 },
      })
    })

    it('should handle single value ranges', () => {
      const searchParams = new URLSearchParams('minLetters=5')

      const result = buildWordFilter(searchParams)

      expect(result).toEqual({
        numLetters: { $gte: 5 },
      })
    })
  })

  describe('extractPaginationParams', () => {
    it('should return default values when no parameters provided', () => {
      const searchParams = new URLSearchParams()

      const result = extractPaginationParams(searchParams)

      expect(result).toEqual({ limit: 10, offset: 0 })
    })

    it('should extract custom limit and offset', () => {
      const searchParams = new URLSearchParams('limit=20&offset=10')

      const result = extractPaginationParams(searchParams)

      expect(result).toEqual({ limit: 20, offset: 10 })
    })

    it('should handle string values', () => {
      const searchParams = new URLSearchParams('limit=5&offset=15')

      const result = extractPaginationParams(searchParams)

      expect(result).toEqual({ limit: 5, offset: 15 })
    })

    it('should handle partial parameters', () => {
      const searchParams = new URLSearchParams('limit=25')

      const result = extractPaginationParams(searchParams)

      expect(result).toEqual({ limit: 25, offset: 0 })
    })

    it('should handle invalid number strings', () => {
      const searchParams = new URLSearchParams(
        'limit=invalid&offset=also-invalid'
      )

      const result = extractPaginationParams(searchParams)

      expect(result).toEqual({ limit: Number.NaN, offset: Number.NaN })
    })
  })
})
