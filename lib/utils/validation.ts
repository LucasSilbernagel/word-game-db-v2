import { NextResponse } from 'next/server'
import { Buffer } from 'node:buffer'

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
    const parsedMin = Number.parseInt(minValue, 10)
    // Only add the filter if the parsed value is a valid number
    if (!Number.isNaN(parsedMin)) {
      filter.$gte = parsedMin
    }
  }

  if (maxValue) {
    const parsedMax = Number.parseInt(maxValue, 10)
    // Only add the filter if the parsed value is a valid number
    if (!Number.isNaN(parsedMax)) {
      filter.$lte = parsedMax
    }
  }

  // Return undefined if no valid filters were added
  if (Object.keys(filter).length === 0) {
    return undefined
  }

  return filter
}

/**
 * Builds a MongoDB filter object from query parameters
 */
export const buildWordFilter = (searchParams: URLSearchParams) => {
  const filter: Record<string, unknown> = {}

  const category = searchParams.get('category')?.trim()
  const numLetters = searchParams.get('numLetters')
  const minLetters = searchParams.get('minLetters')
  const maxLetters = searchParams.get('maxLetters')
  const numSyllables = searchParams.get('numSyllables')
  const minSyllables = searchParams.get('minSyllables')
  const maxSyllables = searchParams.get('maxSyllables')
  const _id = searchParams.get('_id')?.trim()

  // Only add category filter if it's a non-empty string
  if (category && category.length > 0) {
    filter.category = category.toLowerCase()
  }

  // Only add _id filter if it's a non-empty string
  if (_id && _id.length > 0) {
    filter._id = _id
  }

  // Handle direct numLetters filter
  if (numLetters) {
    const parsedLetters = Number.parseInt(numLetters, 10)
    if (!Number.isNaN(parsedLetters) && parsedLetters > 0) {
      filter.numLetters = parsedLetters
    }
  } else {
    // Handle range filters for letters
    const lettersFilter = createRangeFilter(minLetters, maxLetters)
    if (lettersFilter) {
      filter.numLetters = lettersFilter
    }
  }

  // Handle direct numSyllables filter
  if (numSyllables) {
    const parsedSyllables = Number.parseInt(numSyllables, 10)
    if (!Number.isNaN(parsedSyllables) && parsedSyllables > 0) {
      filter.numSyllables = parsedSyllables
    }
  } else {
    // Handle range filters for syllables
    const syllablesFilter = createRangeFilter(minSyllables, maxSyllables)
    if (syllablesFilter) {
      filter.numSyllables = syllablesFilter
    }
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

/**
 * Escapes special regex characters to prevent ReDoS attacks
 * This prevents malicious regex patterns from causing excessive backtracking
 */
export const escapeRegex = (string: string): string => {
  return string.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
}

/**
 * Validates request body size
 * @param body - The request body to validate
 * @param maxSizeKB - Maximum allowed size in KB (default: 100KB)
 * @returns Error response if body is too large, null otherwise
 */
export const validateRequestSize = (
  body: string,
  maxSizeKB = 100
): NextResponse | null => {
  const sizeInKB = Buffer.byteLength(body, 'utf8') / 1024

  if (sizeInKB > maxSizeKB) {
    return NextResponse.json(
      {
        error: `Request body too large. Maximum size is ${maxSizeKB}KB`,
      },
      { status: 413 }
    )
  }

  return null
}
