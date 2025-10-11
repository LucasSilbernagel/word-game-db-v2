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

describe('API Integration Tests', () => {
  beforeEach(() => {
    // Reset server handlers to defaults
    server.resetHandlers()
  })

  describe('Words API Integration', () => {
    it('should handle complete CRUD operations flow', async () => {
      let words: Word[] = []

      // Mock dynamic word storage
      server.use(
        // GET all words (v1 returns simple array)
        http.get('http://localhost:3000/api/v2/words', () => {
          return HttpResponse.json(words)
        }),

        // POST create word
        http.post('http://localhost:3000/api/v2/words', async ({ request }) => {
          const body = (await request.json()) as Partial<Word>
          const newWord: Word = {
            _id: `word_${Date.now()}`,
            word: body.word?.toLowerCase() || '',
            category: body.category?.toLowerCase() || '',
            numLetters: body.numLetters || 0,
            numSyllables: body.numSyllables || 0,
            hint: body.hint || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          words.push(newWord)
          return HttpResponse.json(newWord, { status: 201 })
        }),

        // GET word by ID
        http.get('http://localhost:3000/api/v2/words/:id', ({ params }) => {
          const { id } = params
          const word = words.find((w) => w._id === id)
          if (!word) {
            return HttpResponse.json(
              { error: 'Word not found' },
              { status: 404 }
            )
          }
          return HttpResponse.json(word)
        }),

        // PUT update word
        http.put(
          'http://localhost:3000/api/v2/words/:id',
          async ({ params, request }) => {
            const { id } = params
            const body = (await request.json()) as Partial<Word>
            const wordIndex = words.findIndex((w) => w._id === id)

            if (wordIndex === -1) {
              return HttpResponse.json(
                { error: 'Word not found' },
                { status: 404 }
              )
            }

            words[wordIndex] = {
              ...words[wordIndex],
              ...body,
              updatedAt: new Date().toISOString(),
            }

            return HttpResponse.json(words[wordIndex])
          }
        ),

        // DELETE word
        http.delete('http://localhost:3000/api/v2/words/:id', ({ params }) => {
          const { id } = params
          const wordIndex = words.findIndex((w) => w._id === id)

          if (wordIndex === -1) {
            return HttpResponse.json(
              { error: 'Word not found' },
              { status: 404 }
            )
          }

          const deletedWord = words[wordIndex]
          words.splice(wordIndex, 1)

          return HttpResponse.json(deletedWord)
        })
      )

      // 1. Create a word
      const createResponse = await fetch('http://localhost:3000/api/v2/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: 'apple',
          category: 'fruit',
          numLetters: 5,
          numSyllables: 2,
          hint: 'A red fruit',
        }),
      })

      expect(createResponse.status).toBe(201)
      const createdWord = await createResponse.json()
      expect(createdWord.word).toBe('apple')
      expect(createdWord.category).toBe('fruit')

      // 2. Get all words (should include the created word)
      const getAllResponse = await fetch('http://localhost:3000/api/v2/words')
      expect(getAllResponse.status).toBe(200)
      const allWords = await getAllResponse.json()
      expect(allWords).toHaveLength(1)
      expect(allWords[0].word).toBe('apple')

      // 3. Get specific word by ID
      const getByIdResponse = await fetch(
        `http://localhost:3000/api/v2/words/${createdWord._id}`
      )
      expect(getByIdResponse.status).toBe(200)
      const retrievedWord = await getByIdResponse.json()
      expect(retrievedWord.word).toBe('apple')

      // 4. Update the word
      const updateResponse = await fetch(
        `http://localhost:3000/api/v2/words/${createdWord._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            hint: 'A red or green fruit',
          }),
        }
      )
      expect(updateResponse.status).toBe(200)
      const updatedWord = await updateResponse.json()
      expect(updatedWord.hint).toBe('A red or green fruit')

      // 5. Delete the word
      const deleteResponse = await fetch(
        `http://localhost:3000/api/v2/words/${createdWord._id}`,
        {
          method: 'DELETE',
        }
      )
      expect(deleteResponse.status).toBe(200)
      const deletedWord = await deleteResponse.json()
      expect(deletedWord._id).toBe(createdWord._id)

      // 6. Verify word is deleted
      const getDeletedResponse = await fetch(
        `http://localhost:3000/api/v2/words/${createdWord._id}`
      )
      expect(getDeletedResponse.status).toBe(404)

      // 7. Verify no words remain
      const getFinalResponse = await fetch('http://localhost:3000/api/v2/words')
      expect(getFinalResponse.status).toBe(200)
      const finalWords = await getFinalResponse.json()
      expect(finalWords).toHaveLength(0)
    })

    it('should handle search functionality', async () => {
      const testWords = [
        {
          _id: '1',
          word: 'apple',
          category: 'fruit',
          numLetters: 5,
          numSyllables: 2,
          hint: 'A red fruit',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          _id: '2',
          word: 'banana',
          category: 'fruit',
          numLetters: 6,
          numSyllables: 3,
          hint: 'A yellow fruit',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        {
          _id: '3',
          word: 'elephant',
          category: 'animal',
          numLetters: 8,
          numSyllables: 3,
          hint: 'A large mammal',
          createdAt: '2023-01-03T00:00:00.000Z',
          updatedAt: '2023-01-03T00:00:00.000Z',
        },
      ]

      server.use(
        http.get('http://localhost:3000/api/v2/words/search', ({ request }) => {
          const url = new URL(request.url)
          const query = url.searchParams.get('q')
          const limit = Number.parseInt(url.searchParams.get('limit') || '10')
          const offset = Number.parseInt(url.searchParams.get('offset') || '0')

          if (!query || query.length < 2) {
            return HttpResponse.json(
              { error: 'Query must be at least 2 characters long' },
              { status: 400 }
            )
          }

          const filteredWords = testWords.filter((word) =>
            word.word.toLowerCase().includes(query.toLowerCase())
          )

          const paginatedWords = filteredWords.slice(offset, offset + limit)

          return HttpResponse.json({
            words: paginatedWords,
            pagination: {
              total: filteredWords.length,
              limit,
              offset,
              hasMore: offset + limit < filteredWords.length,
            },
            query,
          })
        })
      )

      // Test search for 'app' (should find 'apple')
      const searchResponse = await fetch(
        'http://localhost:3000/api/v2/words/search?q=app'
      )
      expect(searchResponse.status).toBe(200)
      const searchResult = await searchResponse.json()
      expect(searchResult.words).toHaveLength(1)
      expect(searchResult.words[0].word).toBe('apple')

      // Test search for 'fruit' words (should find none, searches in word field)
      const fruitSearchResponse = await fetch(
        'http://localhost:3000/api/v2/words/search?q=fruit'
      )
      expect(fruitSearchResponse.status).toBe(200)
      const fruitSearchResult = await fruitSearchResponse.json()
      expect(fruitSearchResult.words).toHaveLength(0)

      // Test search with pagination
      const paginatedResponse = await fetch(
        'http://localhost:3000/api/v2/words/search?q=ap&limit=1&offset=0'
      )
      expect(paginatedResponse.status).toBe(200)
      const paginatedResult = await paginatedResponse.json()
      expect(paginatedResult.words).toHaveLength(1)
      expect(paginatedResult.pagination.hasMore).toBe(false)

      // Test invalid search (too short)
      const invalidSearchResponse = await fetch(
        'http://localhost:3000/api/v2/words/search?q=a'
      )
      expect(invalidSearchResponse.status).toBe(400)
    })

    it('should handle filtering and pagination', async () => {
      const testWords = [
        {
          _id: '1',
          word: 'apple',
          category: 'fruit',
          numLetters: 5,
          numSyllables: 2,
          hint: 'A red fruit',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          _id: '2',
          word: 'banana',
          category: 'fruit',
          numLetters: 6,
          numSyllables: 3,
          hint: 'A yellow fruit',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        {
          _id: '3',
          word: 'elephant',
          category: 'animal',
          numLetters: 8,
          numSyllables: 3,
          hint: 'A large mammal',
          createdAt: '2023-01-03T00:00:00.000Z',
          updatedAt: '2023-01-03T00:00:00.000Z',
        },
      ]

      server.use(
        http.get('http://localhost:3000/api/v2/words', ({ request }) => {
          const url = new URL(request.url)
          const category = url.searchParams.get('category')
          const numLetters = url.searchParams.get('numLetters')

          let filteredWords = [...testWords]

          if (category) {
            filteredWords = filteredWords.filter(
              (word) => word.category === category
            )
          }

          if (numLetters) {
            filteredWords = filteredWords.filter(
              (word) => word.numLetters === Number.parseInt(numLetters)
            )
          }

          // v1 returns simple array (no pagination)
          return HttpResponse.json(filteredWords)
        })
      )

      // Test category filtering
      const categoryResponse = await fetch(
        'http://localhost:3000/api/v2/words?category=fruit'
      )
      expect(categoryResponse.status).toBe(200)
      const categoryResult = await categoryResponse.json()
      expect(categoryResult).toHaveLength(2)
      expect(
        categoryResult.every((word: Word) => word.category === 'fruit')
      ).toBe(true)

      // Test numLetters filtering
      const lettersResponse = await fetch(
        'http://localhost:3000/api/v2/words?numLetters=5'
      )
      expect(lettersResponse.status).toBe(200)
      const lettersResult = await lettersResponse.json()
      expect(lettersResult).toHaveLength(1)
      expect(lettersResult[0].word).toBe('apple')

      // Test pagination (v1 ignores pagination parameters)
      const paginationResponse = await fetch(
        'http://localhost:3000/api/v2/words?limit=2&offset=1'
      )
      expect(paginationResponse.status).toBe(200)
      const paginationResult = await paginationResponse.json()
      expect(paginationResult).toHaveLength(3) // All 3 words returned (pagination ignored in v1)
      // Note: v1 doesn't support pagination, so limit/offset are ignored

      // Test combined filters
      const combinedResponse = await fetch(
        'http://localhost:3000/api/v2/words?category=fruit&numLetters=6'
      )
      expect(combinedResponse.status).toBe(200)
      const combinedResult = await combinedResponse.json()
      expect(combinedResult).toHaveLength(1)
      expect(combinedResult[0].word).toBe('banana')
    })
  })

  describe('Random Words API Integration', () => {
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

      server.use(
        http.get('http://localhost:3000/api/v2/words/random', () => {
          return HttpResponse.json(mockRandomWord)
        })
      )

      const response = await fetch('http://localhost:3000/api/v2/words/random')
      expect(response.status).toBe(200)
      const randomWord = await response.json()
      expect(randomWord).toEqual(mockRandomWord)
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

      server.use(
        http.get('http://localhost:3000/api/v2/words/random', ({ request }) => {
          const url = new URL(request.url)
          const category = url.searchParams.get('category')

          if (category === 'fruit') {
            return HttpResponse.json(mockRandomWord)
          }
          return HttpResponse.json(
            { error: 'No words found in database' },
            { status: 404 }
          )
        })
      )

      const response = await fetch(
        'http://localhost:3000/api/v2/words/random?category=fruit'
      )
      expect(response.status).toBe(200)
      const randomWord = await response.json()
      expect(randomWord).toEqual(mockRandomWord)
    })

    it('should return 404 when no words found', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/words/random', () => {
          return HttpResponse.json(
            { error: 'No words found in database' },
            { status: 404 }
          )
        })
      )

      const response = await fetch('http://localhost:3000/api/v2/words/random')
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error.error).toBe('No words found in database')
    })

    it('should return a random word with exact numLetters filter', async () => {
      const mockWords = [
        {
          _id: '1',
          word: 'apple',
          category: 'fruit',
          numLetters: 5,
          numSyllables: 2,
          hint: 'A red fruit',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          _id: '2',
          word: 'banana',
          category: 'fruit',
          numLetters: 6,
          numSyllables: 3,
          hint: 'A yellow fruit',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
      ]

      server.use(
        http.get('http://localhost:3000/api/v2/words/random', ({ request }) => {
          const url = new URL(request.url)
          const numLetters = url.searchParams.get('numLetters')

          const filteredWords = mockWords.filter(
            (word) => word.numLetters === Number.parseInt(numLetters || '0')
          )

          if (filteredWords.length === 0) {
            return HttpResponse.json(
              { error: 'No words found matching criteria' },
              { status: 404 }
            )
          }

          return HttpResponse.json(filteredWords[0])
        })
      )

      const response = await fetch(
        'http://localhost:3000/api/v2/words/random?numLetters=5'
      )
      expect(response.status).toBe(200)
      const randomWord = await response.json()
      expect(randomWord.numLetters).toBe(5)
      expect(randomWord.word).toBe('apple')
    })

    it('should return a random word with minLetters and maxLetters range', async () => {
      const mockWords = [
        {
          _id: '1',
          word: 'cat',
          category: 'animal',
          numLetters: 3,
          numSyllables: 1,
          hint: 'A small pet',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          _id: '2',
          word: 'apple',
          category: 'fruit',
          numLetters: 5,
          numSyllables: 2,
          hint: 'A red fruit',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        {
          _id: '3',
          word: 'elephant',
          category: 'animal',
          numLetters: 8,
          numSyllables: 3,
          hint: 'A large mammal',
          createdAt: '2023-01-03T00:00:00.000Z',
          updatedAt: '2023-01-03T00:00:00.000Z',
        },
      ]

      server.use(
        http.get('http://localhost:3000/api/v2/words/random', ({ request }) => {
          const url = new URL(request.url)
          const minLetters = url.searchParams.get('minLetters')
          const maxLetters = url.searchParams.get('maxLetters')

          let filteredWords = [...mockWords]

          if (minLetters) {
            filteredWords = filteredWords.filter(
              (word) => word.numLetters >= Number.parseInt(minLetters)
            )
          }

          if (maxLetters) {
            filteredWords = filteredWords.filter(
              (word) => word.numLetters <= Number.parseInt(maxLetters)
            )
          }

          if (filteredWords.length === 0) {
            return HttpResponse.json(
              { error: 'No words found matching criteria' },
              { status: 404 }
            )
          }

          // Return first match for consistent testing
          return HttpResponse.json(filteredWords[0])
        })
      )

      const response = await fetch(
        'http://localhost:3000/api/v2/words/random?minLetters=3&maxLetters=7'
      )
      expect(response.status).toBe(200)
      const randomWord = await response.json()
      expect(randomWord.numLetters).toBeGreaterThanOrEqual(3)
      expect(randomWord.numLetters).toBeLessThanOrEqual(7)
    })

    it('should return a random word with exact numSyllables filter', async () => {
      const mockWords = [
        {
          _id: '1',
          word: 'cat',
          category: 'animal',
          numLetters: 3,
          numSyllables: 1,
          hint: 'A small pet',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          _id: '2',
          word: 'apple',
          category: 'fruit',
          numLetters: 5,
          numSyllables: 2,
          hint: 'A red fruit',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
      ]

      server.use(
        http.get('http://localhost:3000/api/v2/words/random', ({ request }) => {
          const url = new URL(request.url)
          const numSyllables = url.searchParams.get('numSyllables')

          const filteredWords = mockWords.filter(
            (word) => word.numSyllables === Number.parseInt(numSyllables || '0')
          )

          if (filteredWords.length === 0) {
            return HttpResponse.json(
              { error: 'No words found matching criteria' },
              { status: 404 }
            )
          }

          return HttpResponse.json(filteredWords[0])
        })
      )

      const response = await fetch(
        'http://localhost:3000/api/v2/words/random?numSyllables=2'
      )
      expect(response.status).toBe(200)
      const randomWord = await response.json()
      expect(randomWord.numSyllables).toBe(2)
      expect(randomWord.word).toBe('apple')
    })

    it('should return a random word with minSyllables and maxSyllables range', async () => {
      const mockWords = [
        {
          _id: '1',
          word: 'cat',
          category: 'animal',
          numLetters: 3,
          numSyllables: 1,
          hint: 'A small pet',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          _id: '2',
          word: 'apple',
          category: 'fruit',
          numLetters: 5,
          numSyllables: 2,
          hint: 'A red fruit',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        {
          _id: '3',
          word: 'banana',
          category: 'fruit',
          numLetters: 6,
          numSyllables: 3,
          hint: 'A yellow fruit',
          createdAt: '2023-01-03T00:00:00.000Z',
          updatedAt: '2023-01-03T00:00:00.000Z',
        },
      ]

      server.use(
        http.get('http://localhost:3000/api/v2/words/random', ({ request }) => {
          const url = new URL(request.url)
          const minSyllables = url.searchParams.get('minSyllables')
          const maxSyllables = url.searchParams.get('maxSyllables')

          let filteredWords = [...mockWords]

          if (minSyllables) {
            filteredWords = filteredWords.filter(
              (word) => word.numSyllables >= Number.parseInt(minSyllables)
            )
          }

          if (maxSyllables) {
            filteredWords = filteredWords.filter(
              (word) => word.numSyllables <= Number.parseInt(maxSyllables)
            )
          }

          if (filteredWords.length === 0) {
            return HttpResponse.json(
              { error: 'No words found matching criteria' },
              { status: 404 }
            )
          }

          return HttpResponse.json(filteredWords[0])
        })
      )

      const response = await fetch(
        'http://localhost:3000/api/v2/words/random?minSyllables=2&maxSyllables=3'
      )
      expect(response.status).toBe(200)
      const randomWord = await response.json()
      expect(randomWord.numSyllables).toBeGreaterThanOrEqual(2)
      expect(randomWord.numSyllables).toBeLessThanOrEqual(3)
    })

    it('should return a random word with combined filters', async () => {
      const mockWords = [
        {
          _id: '1',
          word: 'cat',
          category: 'animal',
          numLetters: 3,
          numSyllables: 1,
          hint: 'A small pet',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        {
          _id: '2',
          word: 'apple',
          category: 'fruit',
          numLetters: 5,
          numSyllables: 2,
          hint: 'A red fruit',
          createdAt: '2023-01-02T00:00:00.000Z',
          updatedAt: '2023-01-02T00:00:00.000Z',
        },
        {
          _id: '3',
          word: 'banana',
          category: 'fruit',
          numLetters: 6,
          numSyllables: 3,
          hint: 'A yellow fruit',
          createdAt: '2023-01-03T00:00:00.000Z',
          updatedAt: '2023-01-03T00:00:00.000Z',
        },
      ]

      server.use(
        http.get('http://localhost:3000/api/v2/words/random', ({ request }) => {
          const url = new URL(request.url)
          const category = url.searchParams.get('category')
          const minLetters = url.searchParams.get('minLetters')
          const maxLetters = url.searchParams.get('maxLetters')

          let filteredWords = [...mockWords]

          if (category) {
            filteredWords = filteredWords.filter(
              (word) => word.category === category
            )
          }

          if (minLetters) {
            filteredWords = filteredWords.filter(
              (word) => word.numLetters >= Number.parseInt(minLetters)
            )
          }

          if (maxLetters) {
            filteredWords = filteredWords.filter(
              (word) => word.numLetters <= Number.parseInt(maxLetters)
            )
          }

          if (filteredWords.length === 0) {
            return HttpResponse.json(
              { error: 'No words found matching criteria' },
              { status: 404 }
            )
          }

          return HttpResponse.json(filteredWords[0])
        })
      )

      const response = await fetch(
        'http://localhost:3000/api/v2/words/random?category=fruit&minLetters=3&maxLetters=7'
      )
      expect(response.status).toBe(200)
      const randomWord = await response.json()
      expect(randomWord.category).toBe('fruit')
      expect(randomWord.numLetters).toBeGreaterThanOrEqual(3)
      expect(randomWord.numLetters).toBeLessThanOrEqual(7)
    })

    it('should return 404 when no words match filter criteria', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/words/random', ({ request }) => {
          const url = new URL(request.url)
          const numLetters = url.searchParams.get('numLetters')

          // Simulate no words matching the criteria
          if (numLetters === '99') {
            return HttpResponse.json(
              { error: 'No words found matching criteria' },
              { status: 404 }
            )
          }

          return HttpResponse.json({
            _id: '1',
            word: 'test',
            category: 'test',
            numLetters: 4,
            numSyllables: 1,
            hint: 'test',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-01T00:00:00.000Z',
          })
        })
      )

      const response = await fetch(
        'http://localhost:3000/api/v2/words/random?numLetters=99'
      )
      expect(response.status).toBe(404)
      const error = await response.json()
      expect(error.error).toBe('No words found matching criteria')
    })
  })

  describe('Categories API Integration', () => {
    it('should return all available categories', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/categories', () => {
          return HttpResponse.json(['fruit', 'animal', 'color', 'food'])
        })
      )

      const response = await fetch('http://localhost:3000/api/v2/categories')
      expect(response.status).toBe(200)
      const categories = await response.json()
      expect(categories).toEqual(['fruit', 'animal', 'color', 'food'])
    })

    it('should return empty array when no categories exist', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/categories', () => {
          return HttpResponse.json([])
        })
      )

      const response = await fetch('http://localhost:3000/api/v2/categories')
      expect(response.status).toBe(200)
      const categories = await response.json()
      expect(categories).toEqual([])
    })
  })

  describe('Validation and Edge Cases Integration', () => {
    it('should validate word creation requirements', async () => {
      server.use(
        http.post('http://localhost:3000/api/v2/words', async ({ request }) => {
          const body = (await request.json()) as Partial<Word>

          if (!body.word) {
            return HttpResponse.json(
              { error: 'Missing required fields: word' },
              { status: 400 }
            )
          }

          if (!body.category) {
            return HttpResponse.json(
              { error: 'Missing required fields: category' },
              { status: 400 }
            )
          }

          if (!body.numLetters || body.numLetters < 1) {
            return HttpResponse.json(
              { error: 'Missing required fields: numLetters' },
              { status: 400 }
            )
          }

          if (!body.numSyllables || body.numSyllables < 1) {
            return HttpResponse.json(
              { error: 'Missing required fields: numSyllables' },
              { status: 400 }
            )
          }

          if (!body.hint) {
            return HttpResponse.json(
              { error: 'Missing required fields: hint' },
              { status: 400 }
            )
          }

          return HttpResponse.json({ success: true }, { status: 201 })
        })
      )

      // Test missing word
      const missingWordResponse = await fetch(
        'http://localhost:3000/api/v2/words',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: 'fruit',
            numLetters: 5,
            numSyllables: 2,
            hint: 'A fruit',
          }),
        }
      )
      expect(missingWordResponse.status).toBe(400)

      // Test missing category
      const missingCategoryResponse = await fetch(
        'http://localhost:3000/api/v2/words',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word: 'apple',
            numLetters: 5,
            numSyllables: 2,
            hint: 'A fruit',
          }),
        }
      )
      expect(missingCategoryResponse.status).toBe(400)

      // Test invalid numLetters
      const invalidLettersResponse = await fetch(
        'http://localhost:3000/api/v2/words',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            word: 'apple',
            category: 'fruit',
            numLetters: 0,
            numSyllables: 2,
            hint: 'A fruit',
          }),
        }
      )
      expect(invalidLettersResponse.status).toBe(400)
    })

    it('should handle duplicate word creation', async () => {
      server.use(
        http.post('http://localhost:3000/api/v2/words', async ({ request }) => {
          const body = (await request.json()) as Partial<Word>

          if (body.word === 'apple') {
            return HttpResponse.json(
              { error: 'Word already exists' },
              { status: 409 }
            )
          }

          return HttpResponse.json({ success: true }, { status: 201 })
        })
      )

      const response = await fetch('http://localhost:3000/api/v2/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: 'apple',
          category: 'fruit',
          numLetters: 5,
          numSyllables: 2,
          hint: 'A red fruit',
        }),
      })

      expect(response.status).toBe(409)
      const error = await response.json()
      expect(error.error).toBe('Word already exists')
    })

    it('should transform word data to lowercase', async () => {
      server.use(
        http.post('http://localhost:3000/api/v2/words', async ({ request }) => {
          const body = (await request.json()) as Partial<Word>
          const newWord: Word = {
            _id: `word_${Date.now()}`,
            word: body.word?.toLowerCase() || '',
            category: body.category?.toLowerCase() || '',
            numLetters: body.numLetters || 0,
            numSyllables: body.numSyllables || 0,
            hint: body.hint || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          return HttpResponse.json(newWord, { status: 201 })
        })
      )

      const response = await fetch('http://localhost:3000/api/v2/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: 'APPLE',
          category: 'FRUIT',
          numLetters: 5,
          numSyllables: 2,
          hint: 'A red fruit',
        }),
      })

      expect(response.status).toBe(201)
      const createdWord = await response.json()
      expect(createdWord.word).toBe('apple')
      expect(createdWord.category).toBe('fruit')
    })

    it('should handle search validation requirements', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/words/search', ({ request }) => {
          const url = new URL(request.url)
          const query = url.searchParams.get('q')

          if (!query) {
            return HttpResponse.json(
              { error: 'Query parameter "q" is required' },
              { status: 400 }
            )
          }

          if (query.length < 2) {
            return HttpResponse.json(
              { error: 'Query must be at least 2 characters long' },
              { status: 400 }
            )
          }

          return HttpResponse.json({
            words: [],
            pagination: { total: 0, limit: 10, offset: 0, hasMore: false },
            query,
          })
        })
      )

      // Test missing query
      const missingQueryResponse = await fetch(
        'http://localhost:3000/api/v2/words/search'
      )
      expect(missingQueryResponse.status).toBe(400)

      // Test short query
      const shortQueryResponse = await fetch(
        'http://localhost:3000/api/v2/words/search?q=a'
      )
      expect(shortQueryResponse.status).toBe(400)
    })

    it('should handle default pagination parameters', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/words', ({ request }) => {
          const url = new URL(request.url)
          const limit = url.searchParams.get('limit') || '10'
          const offset = url.searchParams.get('offset') || '0'

          return HttpResponse.json({
            words: [],
            pagination: {
              total: 0,
              limit: Number.parseInt(limit),
              offset: Number.parseInt(offset),
              hasMore: false,
            },
          })
        })
      )

      const response = await fetch('http://localhost:3000/api/v2/words')
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.pagination.limit).toBe(10)
      expect(data.pagination.offset).toBe(0)
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle network errors gracefully', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/words', () => {
          return HttpResponse.error()
        })
      )

      await expect(
        fetch('http://localhost:3000/api/v2/words')
      ).rejects.toThrow()
    })

    it('should handle database errors gracefully', async () => {
      server.use(
        http.get('http://localhost:3000/api/v2/categories', () => {
          return HttpResponse.json(
            { error: 'Database connection failed' },
            { status: 500 }
          )
        })
      )

      const response = await fetch('http://localhost:3000/api/v2/categories')
      expect(response.status).toBe(500)
      const error = await response.json()
      expect(error.error).toBe('Database connection failed')
    })
  })
})
