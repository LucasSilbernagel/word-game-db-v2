import { NextResponse } from 'next/server'

/**
 * Validates required fields and returns an error response if any are missing
 */
export const validateRequiredFields = (
  data: Record<string, unknown>,
  requiredFields: string[]
): NextResponse | null => {
  const missingFields = requiredFields.filter((field) => !data[field])

  if (missingFields.length > 0) {
    return NextResponse.json(
      {
        error: `Missing required fields: ${missingFields.join(', ')}`,
      },
      { status: 400 }
    )
  }

  return null
}

/**
 * Validates and transforms word data for database operations
 */
export const validateAndTransformWordData = (data: Record<string, unknown>) => {
  const { word, category, numLetters, numSyllables, hint } = data

  return {
    word: typeof word === 'string' ? word.toLowerCase() : word,
    category: typeof category === 'string' ? category.toLowerCase() : category,
    numLetters: numLetters ? Number.parseInt(String(numLetters)) : undefined,
    numSyllables: numSyllables
      ? Number.parseInt(String(numSyllables))
      : undefined,
    hint,
  }
}

/**
 * Creates a filter object for MongoDB queries with range support
 */
export const createRangeFilter = (
  minValue: string | null,
  maxValue: string | null
): { $gte?: number; $lte?: number } | undefined => {
  if (!minValue && !maxValue) return undefined

  const filter: { $gte?: number; $lte?: number } = {}

  if (minValue) {
    filter.$gte = Number.parseInt(minValue)
  }

  if (maxValue) {
    filter.$lte = Number.parseInt(maxValue)
  }

  return filter
}

/**
 * Builds a MongoDB filter object from query parameters
 */
export const buildWordFilter = (searchParams: URLSearchParams) => {
  const filter: Record<string, unknown> = {}

  const category = searchParams.get('category')
  const minLetters = searchParams.get('minLetters')
  const maxLetters = searchParams.get('maxLetters')
  const minSyllables = searchParams.get('minSyllables')
  const maxSyllables = searchParams.get('maxSyllables')

  if (category) {
    filter.category = category
  }

  const lettersFilter = createRangeFilter(minLetters, maxLetters)
  if (lettersFilter) {
    filter.numLetters = lettersFilter
  }

  const syllablesFilter = createRangeFilter(minSyllables, maxSyllables)
  if (syllablesFilter) {
    filter.numSyllables = syllablesFilter
  }

  return filter
}

/**
 * Extracts pagination parameters from search params with defaults
 */
export const extractPaginationParams = (searchParams: URLSearchParams) => {
  const limit = Number.parseInt(searchParams.get('limit') || '10')
  const offset = Number.parseInt(searchParams.get('offset') || '0')

  return { limit, offset }
}
