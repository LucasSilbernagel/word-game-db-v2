import { withGetWrapper, withPostWrapper } from '@/lib/utils/apiWrapper'
import {
  buildWordFilter,
  extractPaginationParams,
  validateAndTransformWordData,
  validateRequiredFields,
} from '@/lib/utils/validation'
import Word from '@/models/word'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withGetWrapper(async (request: NextRequest) => {
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

  // Add cache headers for GET requests (cache for 5 minutes)
  response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=300')

  return response
})

export const POST = withPostWrapper(async (request: NextRequest) => {
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
})
