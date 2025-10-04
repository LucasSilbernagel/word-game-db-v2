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
        // GET all words
        http.get('http://localhost:3000/api/v1/words', () => {
          return HttpResponse.json({
            words,
            pagination: {
              total: words.length,
              limit: 10,
              offset: 0,
              hasMore: false,
            },
          })
        }),

        // POST create word
        http.post('http://localhost:3000/api/v1/words', async ({ request }) => {
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
        http.get('http://localhost:3000/api/v1/words/:id', ({ params }) => {
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
          'http://localhost:3000/api/v1/words/:id',
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
        http.delete('http://localhost:3000/api/v1/words/:id', ({ params }) => {
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
      const createResponse = await fetch('http://localhost:3000/api/v1/words', {
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
      const getAllResponse = await fetch('http://localhost:3000/api/v1/words')
      expect(getAllResponse.status).toBe(200)
      const allWords = await getAllResponse.json()
      expect(allWords.words).toHaveLength(1)
      expect(allWords.words[0].word).toBe('apple')

      // 3. Get specific word by ID
      const getByIdResponse = await fetch(
        `http://localhost:3000/api/v1/words/${createdWord._id}`
      )
      expect(getByIdResponse.status).toBe(200)
      const retrievedWord = await getByIdResponse.json()
      expect(retrievedWord.word).toBe('apple')

      // 4. Update the word
      const updateResponse = await fetch(
        `http://localhost:3000/api/v1/words/${createdWord._id}`,
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
        `http://localhost:3000/api/v1/words/${createdWord._id}`,
        {
          method: 'DELETE',
        }
      )
      expect(deleteResponse.status).toBe(200)
      const deletedWord = await deleteResponse.json()
      expect(deletedWord._id).toBe(createdWord._id)

      // 6. Verify word is deleted
      const getDeletedResponse = await fetch(
        `http://localhost:3000/api/v1/words/${createdWord._id}`
      )
      expect(getDeletedResponse.status).toBe(404)

      // 7. Verify no words remain
      const getFinalResponse = await fetch('http://localhost:3000/api/v1/words')
      expect(getFinalResponse.status).toBe(200)
      const finalWords = await getFinalResponse.json()
      expect(finalWords.words).toHaveLength(0)
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
        http.get('http://localhost:3000/api/v1/words/search', ({ request }) => {
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
        'http://localhost:3000/api/v1/words/search?q=app'
      )
      expect(searchResponse.status).toBe(200)
      const searchResult = await searchResponse.json()
      expect(searchResult.words).toHaveLength(1)
      expect(searchResult.words[0].word).toBe('apple')

      // Test search for 'fruit' words (should find none, searches in word field)
      const fruitSearchResponse = await fetch(
        'http://localhost:3000/api/v1/words/search?q=fruit'
      )
      expect(fruitSearchResponse.status).toBe(200)
      const fruitSearchResult = await fruitSearchResponse.json()
      expect(fruitSearchResult.words).toHaveLength(0)

      // Test search with pagination
      const paginatedResponse = await fetch(
        'http://localhost:3000/api/v1/words/search?q=ap&limit=1&offset=0'
      )
      expect(paginatedResponse.status).toBe(200)
      const paginatedResult = await paginatedResponse.json()
      expect(paginatedResult.words).toHaveLength(1)
      expect(paginatedResult.pagination.hasMore).toBe(false)

      // Test invalid search (too short)
      const invalidSearchResponse = await fetch(
        'http://localhost:3000/api/v1/words/search?q=a'
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
        http.get('http://localhost:3000/api/v1/words', ({ request }) => {
          const url = new URL(request.url)
          const category = url.searchParams.get('category')
          const numLetters = url.searchParams.get('numLetters')
          const limit = Number.parseInt(url.searchParams.get('limit') || '10')
          const offset = Number.parseInt(url.searchParams.get('offset') || '0')

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

      // Test category filtering
      const categoryResponse = await fetch(
        'http://localhost:3000/api/v1/words?category=fruit'
      )
      expect(categoryResponse.status).toBe(200)
      const categoryResult = await categoryResponse.json()
      expect(categoryResult.words).toHaveLength(2)
      expect(
        categoryResult.words.every((word: Word) => word.category === 'fruit')
      ).toBe(true)

      // Test numLetters filtering
      const lettersResponse = await fetch(
        'http://localhost:3000/api/v1/words?numLetters=5'
      )
      expect(lettersResponse.status).toBe(200)
      const lettersResult = await lettersResponse.json()
      expect(lettersResult.words).toHaveLength(1)
      expect(lettersResult.words[0].word).toBe('apple')

      // Test pagination
      const paginationResponse = await fetch(
        'http://localhost:3000/api/v1/words?limit=2&offset=1'
      )
      expect(paginationResponse.status).toBe(200)
      const paginationResult = await paginationResponse.json()
      expect(paginationResult.words).toHaveLength(2)
      expect(paginationResult.pagination.hasMore).toBe(false)

      // Test combined filters
      const combinedResponse = await fetch(
        'http://localhost:3000/api/v1/words?category=fruit&numLetters=6'
      )
      expect(combinedResponse.status).toBe(200)
      const combinedResult = await combinedResponse.json()
      expect(combinedResult.words).toHaveLength(1)
      expect(combinedResult.words[0].word).toBe('banana')
    })
  })

  describe('Categories API Integration', () => {
    it('should return all available categories', async () => {
      server.use(
        http.get('http://localhost:3000/api/v1/categories', () => {
          return HttpResponse.json(['fruit', 'animal', 'color', 'food'])
        })
      )

      const response = await fetch('http://localhost:3000/api/v1/categories')
      expect(response.status).toBe(200)
      const categories = await response.json()
      expect(categories).toEqual(['fruit', 'animal', 'color', 'food'])
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle network errors gracefully', async () => {
      server.use(
        http.get('http://localhost:3000/api/v1/words', () => {
          return HttpResponse.error()
        })
      )

      await expect(
        fetch('http://localhost:3000/api/v1/words')
      ).rejects.toThrow()
    })

    it('should handle validation errors consistently', async () => {
      server.use(
        http.post('http://localhost:3000/api/v1/words', async ({ request }) => {
          const body = (await request.json()) as Partial<Word>

          if (!body.word) {
            return HttpResponse.json(
              { error: 'Missing required fields: word' },
              { status: 400 }
            )
          }

          return HttpResponse.json({ success: true })
        })
      )

      const response = await fetch('http://localhost:3000/api/v1/words', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'fruit' }), // Missing word field
      })

      expect(response.status).toBe(400)
      const error = await response.json()
      expect(error.error).toContain('Missing required fields')
    })
  })
})
