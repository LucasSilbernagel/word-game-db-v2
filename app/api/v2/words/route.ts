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
  const filter = buildWordFilter(searchParams)

  // eslint-disable-next-line unicorn/no-array-callback-reference
  const words = await Word.find(filter).limit(limit).skip(offset).lean()

  // Sort the results array since Mongoose sort() is different from Array.sort()
  // eslint-disable-next-line unicorn/no-array-sort
  const sortedWords = [...words].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return dateB - dateA
  })

  const total = await Word.countDocuments(filter)

  return NextResponse.json({
    words: sortedWords,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
  })
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
  const existingWord = await Word.findOne({ word: wordData.word })
  if (existingWord) {
    return NextResponse.json({ error: 'Word already exists' }, { status: 409 })
  }

  // Create and save new word
  const newWord = new Word(wordData)
  await newWord.save()

  return NextResponse.json(newWord, { status: 201 })
})
