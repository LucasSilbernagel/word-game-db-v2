import { http, HttpResponse } from 'msw'

type CreateWordRequest = {
  word: string
  category: string
  numLetters: number
  numSyllables: number
  hint: string
}

// Mock data
export const mockWords = [
  {
    _id: '507f1f77bcf86cd799439011',
    word: 'apple',
    category: 'fruit',
    numLetters: 5,
    numSyllables: 2,
    hint: 'A red or green fruit that grows on trees',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439012',
    word: 'banana',
    category: 'fruit',
    numLetters: 6,
    numSyllables: 3,
    hint: 'A yellow curved fruit',
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439013',
    word: 'elephant',
    category: 'animal',
    numLetters: 8,
    numSyllables: 3,
    hint: 'A large mammal with a trunk',
    createdAt: '2023-01-03T00:00:00.000Z',
    updatedAt: '2023-01-03T00:00:00.000Z',
  },
]

export const mockCategories = ['fruit', 'animal', 'color', 'food']

const baseUrl = 'http://localhost:3000/api/v2'

export const handlers = [
  // GET /api/v2/words - Get all words with filters and pagination
  http.get(`${baseUrl}/words`, ({ request }) => {
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get('limit') || '10')
    const offset = Number.parseInt(url.searchParams.get('offset') || '0')
    const category = url.searchParams.get('category')
    const numLetters = url.searchParams.get('numLetters')
    const numSyllables = url.searchParams.get('numSyllables')

    let filteredWords = [...mockWords]

    // Apply filters
    if (category) {
      filteredWords = filteredWords.filter((word) => word.category === category)
    }
    if (numLetters) {
      filteredWords = filteredWords.filter(
        (word) => word.numLetters === Number.parseInt(numLetters)
      )
    }
    if (numSyllables) {
      filteredWords = filteredWords.filter(
        (word) => word.numSyllables === Number.parseInt(numSyllables)
      )
    }

    // Apply pagination
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
  }),

  // POST /api/v2/words - Create a new word
  http.post(`${baseUrl}/words`, async ({ request }) => {
    const body = (await request.json()) as CreateWordRequest

    // Validate required fields
    const requiredFields = [
      'word',
      'category',
      'numLetters',
      'numSyllables',
      'hint',
    ]
    for (const field of requiredFields) {
      if (!body[field as keyof CreateWordRequest]) {
        return HttpResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check if word already exists
    const existingWord = mockWords.find(
      (word) => word.word === body.word.toLowerCase()
    )
    if (existingWord) {
      return HttpResponse.json(
        { error: 'Word already exists' },
        { status: 409 }
      )
    }

    // Create new word
    const newWord = {
      _id: '507f1f77bcf86cd799439014',
      word: body.word.toLowerCase(),
      category: body.category.toLowerCase(),
      numLetters: body.numLetters,
      numSyllables: body.numSyllables,
      hint: body.hint,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockWords.push(newWord)

    return HttpResponse.json(newWord, { status: 201 })
  }),

  // GET /api/v2/words/search - Search words
  http.get(`${baseUrl}/words/search`, ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    const limit = Number.parseInt(url.searchParams.get('limit') || '10')
    const offset = Number.parseInt(url.searchParams.get('offset') || '0')

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

    const searchResults = mockWords.filter((word) =>
      word.word.toLowerCase().includes(query.toLowerCase())
    )

    const paginatedResults = searchResults.slice(offset, offset + limit)

    return HttpResponse.json({
      words: paginatedResults,
      pagination: {
        total: searchResults.length,
        limit,
        offset,
        hasMore: offset + limit < searchResults.length,
      },
      query,
    })
  }),

  // GET /api/v2/words/random - Get random word
  http.get(`${baseUrl}/words/random`, ({ request }) => {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')

    let availableWords = mockWords
    if (category) {
      availableWords = mockWords.filter((word) => word.category === category)
    }

    if (availableWords.length === 0) {
      return HttpResponse.json({ error: 'No words found' }, { status: 404 })
    }

    const randomIndex = Math.floor(Math.random() * availableWords.length)
    const randomWord = availableWords[randomIndex]

    return HttpResponse.json(randomWord)
  }),

  // GET /api/v2/words/:id - Get word by ID
  http.get(`${baseUrl}/words/:id`, ({ params }) => {
    const { id } = params
    const word = mockWords.find((w) => w._id === id)

    if (!word) {
      return HttpResponse.json({ error: 'Word not found' }, { status: 404 })
    }

    return HttpResponse.json(word)
  }),

  // PUT /api/v2/words/:id - Update word by ID
  http.put(`${baseUrl}/words/:id`, async ({ params, request }) => {
    const { id } = params
    const body = (await request.json()) as Partial<CreateWordRequest>

    const wordIndex = mockWords.findIndex((w) => w._id === id)
    if (wordIndex === -1) {
      return HttpResponse.json({ error: 'Word not found' }, { status: 404 })
    }

    // Update the word
    mockWords[wordIndex] = {
      ...mockWords[wordIndex],
      ...body,
      word: body.word?.toLowerCase() || mockWords[wordIndex].word,
      category: body.category?.toLowerCase() || mockWords[wordIndex].category,
      updatedAt: new Date().toISOString(),
    }

    return HttpResponse.json(mockWords[wordIndex])
  }),

  // DELETE /api/v2/words/:id - Delete word by ID
  http.delete(`${baseUrl}/words/:id`, ({ params }) => {
    const { id } = params
    const wordIndex = mockWords.findIndex((w) => w._id === id)

    if (wordIndex === -1) {
      return HttpResponse.json({ error: 'Word not found' }, { status: 404 })
    }

    const deletedWord = mockWords[wordIndex]
    mockWords.splice(wordIndex, 1)

    return HttpResponse.json(deletedWord)
  }),

  // GET /api/v2/categories - Get all categories
  http.get(`${baseUrl}/categories`, () => {
    return HttpResponse.json(mockCategories)
  }),

  // GET /api/v2/config - Get API configuration
  http.get(`${baseUrl}/config`, () => {
    return HttpResponse.json({
      version: '1.0.0',
      endpoints: {
        words: '/api/v2/words',
        categories: '/api/v2/categories',
        search: '/api/v2/words/search',
        random: '/api/v2/words/random',
      },
      limits: {
        maxWordsPerRequest: 100,
        searchMinLength: 2,
      },
    })
  }),
]
