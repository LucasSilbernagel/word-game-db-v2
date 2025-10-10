import { DEFAULTS } from '@/lib/constants'
import {
  buildWordFilter,
  escapeRegex,
  extractPaginationParams,
  validateAndTransformWordData,
  validateRequiredFields,
} from '@/lib/utils/validation'
import Word from '@/models/word'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Shared API handler for GET /categories endpoint
 * Returns distinct categories from the words collection
 */
export const getCategoriesHandler = async () => {
  const categories = await Word.distinct('category')
  const response = NextResponse.json(categories)
  // Cache for 15 minutes since categories change infrequently
  response.headers.set('Cache-Control', 'public, max-age=900, s-maxage=900')
  return response
}

/**
 * Shared API handler for GET /config endpoint
 * Returns configuration information about destructive endpoints
 */
export const getConfigHandler = async () => {
  return NextResponse.json({
    destructiveEndpointsEnabled:
      process.env.ENABLE_DESTRUCTIVE_ENDPOINTS === 'true',
  })
}

/**
 * Shared API handler for GET /words (without pagination - v1 style)
 * Returns all matching words as a simple array
 */
export const getWordsV1Handler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const mongoFilter = buildWordFilter(searchParams)

  // Sort at database level for better performance
  // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-sort
  const words = await Word.find(mongoFilter).sort({ createdAt: -1 }).lean()

  const response = NextResponse.json(words)
  // Cache for 5 minutes
  response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300')
  return response
}

/**
 * Shared API handler for GET /words (with pagination - v2 style)
 * Returns paginated words with metadata
 */
export const getWordsV2Handler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const { limit, offset } = extractPaginationParams(searchParams)
  const mongoFilter = buildWordFilter(searchParams)

  // Sort at database level for better performance
  // eslint-disable-next-line unicorn/no-array-callback-reference
  const words = await Word.find(mongoFilter)
    // eslint-disable-next-line unicorn/no-array-sort
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
    .lean()

  const total = await Word.countDocuments(mongoFilter)

  const response = NextResponse.json({
    words,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  })

  // Cache for 5 minutes
  response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300')
  return response
}

/**
 * Shared API handler for POST /words
 * Creates a new word in the database
 */
export const postWordHandler = async (request: NextRequest) => {
  const body = await request.json()

  // Validate required fields
  const validationError = validateRequiredFields(body, [
    'word',
    'category',
    'numLetters',
    'numSyllables',
    'hint',
  ])
  if (validationError) return validationError

  // Transform and validate data
  const wordData = validateAndTransformWordData(body)

  // Check if word already exists
  const existingWord = await Word.findOne({ word: wordData.word }).lean()
  if (existingWord) {
    return NextResponse.json({ error: 'Word already exists' }, { status: 409 })
  }

  // Create and save new word
  const newWord = new Word(wordData)
  await newWord.save()

  return NextResponse.json(newWord, { status: 201 })
}

/**
 * Shared API handler for GET /words/[id]
 * Returns a single word by ID
 */
export const getWordByIdHandler = async (id: string) => {
  const word = await Word.findById(id).lean()
  if (!word) {
    return NextResponse.json({ error: 'Word not found' }, { status: 404 })
  }

  const response = NextResponse.json(word)
  // Cache for 10 minutes since individual words change rarely
  response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600')
  return response
}

/**
 * Shared API handler for PUT /words/[id]
 * Updates a word by ID
 */
export const putWordByIdHandler = async (id: string, request: NextRequest) => {
  const body = await request.json()

  // Transform and validate data (only include provided fields)
  const transformedData = validateAndTransformWordData(body)
  const updateData: Record<string, unknown> = {}

  // Only include fields that were actually provided
  if (transformedData.word !== undefined) updateData.word = transformedData.word
  if (transformedData.category !== undefined)
    updateData.category = transformedData.category
  if (transformedData.numLetters !== undefined)
    updateData.numLetters = transformedData.numLetters
  if (transformedData.numSyllables !== undefined)
    updateData.numSyllables = transformedData.numSyllables
  if (transformedData.hint !== undefined) updateData.hint = transformedData.hint

  const updatedWord = await Word.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  })

  if (!updatedWord) {
    return NextResponse.json({ error: 'Word not found' }, { status: 404 })
  }

  return NextResponse.json(updatedWord)
}

/**
 * Shared API handler for DELETE /words/[id]
 * Deletes a word by ID
 */
export const deleteWordByIdHandler = async (id: string) => {
  const deletedWord = await Word.findByIdAndDelete(id)
  if (!deletedWord) {
    return NextResponse.json({ error: 'Word not found' }, { status: 404 })
  }

  return NextResponse.json({
    message: 'Word deleted successfully',
  })
}

/**
 * Shared API handler for GET /words/random
 * Returns a random word matching the filter criteria
 */
export const getRandomWordHandler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const mongoFilter = buildWordFilter(searchParams)

  // Use MongoDB aggregation for efficient random selection with filters
  const randomWords = await Word.aggregate([
    { $match: mongoFilter },
    { $sample: { size: 1 } },
  ])

  if (randomWords.length === 0) {
    return NextResponse.json(
      { error: 'No words found matching criteria' },
      { status: 404 }
    )
  }

  return NextResponse.json(randomWords[0])
}

/**
 * Shared API handler for GET /words/search
 * Searches for words matching a query string
 */
export const searchWordsHandler = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const { limit, offset } = extractPaginationParams(searchParams)

  // Validate query parameter
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" is required' },
      { status: 400 }
    )
  }

  if (query.length < DEFAULTS.SEARCH_MIN_LENGTH) {
    return NextResponse.json(
      {
        error: `Query must be at least ${DEFAULTS.SEARCH_MIN_LENGTH} characters long`,
      },
      { status: 400 }
    )
  }

  // Build search filter with sanitized regex to prevent ReDoS attacks
  const searchFilter = {
    word: {
      $regex: escapeRegex(query.toLowerCase()),
      $options: 'i', // case-insensitive
    },
  }

  // Execute search with pagination using regex for case-insensitive partial matching
  // eslint-disable-next-line unicorn/no-array-callback-reference
  const words = await Word.find(searchFilter)
    // eslint-disable-next-line unicorn/no-array-sort
    .sort({ word: 1 })
    .limit(limit)
    .skip(offset)
    .lean()

  const total = await Word.countDocuments(searchFilter)

  const response = NextResponse.json({
    words,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
    query,
  })

  // Cache for 5 minutes
  response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300')
  return response
}
