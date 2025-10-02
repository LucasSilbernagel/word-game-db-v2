import {
  addCorsHeaders,
  handleCors,
  handleDisabledEndpoint,
  handleError,
  isDestructiveEndpointEnabled,
} from '@/lib/middleware'
import connectDB from '@/lib/mongodb'
import Word from '@/models/word'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get('limit') || '10')
    const offset = Number.parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')
    const minLetters = searchParams.get('minLetters')
    const maxLetters = searchParams.get('maxLetters')
    const minSyllables = searchParams.get('minSyllables')
    const maxSyllables = searchParams.get('maxSyllables')

    // Build filter object
    const filter: Record<string, unknown> = {}
    if (category) filter.category = category
    if (minLetters || maxLetters) {
      filter.numLetters = {} as { $gte?: number; $lte?: number }
      if (minLetters)
        (filter.numLetters as { $gte?: number }).$gte =
          Number.parseInt(minLetters)
      if (maxLetters)
        (filter.numLetters as { $lte?: number }).$lte =
          Number.parseInt(maxLetters)
    }
    if (minSyllables || maxSyllables) {
      filter.numSyllables = {} as { $gte?: number; $lte?: number }
      if (minSyllables)
        (filter.numSyllables as { $gte?: number }).$gte =
          Number.parseInt(minSyllables)
      if (maxSyllables)
        (filter.numSyllables as { $lte?: number }).$lte =
          Number.parseInt(maxSyllables)
    }

    // eslint-disable-next-line unicorn/no-array-callback-reference
    const words = await Word.find(filter).limit(limit).skip(offset).lean()

    // Sort the results array since Mongoose sort() is different from Array.sort()
    const sortedWords = words.toSorted((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })

    const total = await Word.countDocuments(filter)

    const response = NextResponse.json({
      words: sortedWords,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
    return addCorsHeaders(response)
  } catch (error) {
    return handleError(error, 'Failed to fetch words')
  }
}

export const POST = async (request: NextRequest) => {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  // Check if destructive endpoints are enabled
  if (!isDestructiveEndpointEnabled()) {
    return handleDisabledEndpoint('POST')
  }

  try {
    await connectDB()

    const body = await request.json()
    const { word, category, numLetters, numSyllables, hint } = body

    // Validate required fields
    const missingFields = []
    if (!word) missingFields.push('word')
    if (!category) missingFields.push('category')
    if (!numLetters) missingFields.push('numLetters')
    if (!numSyllables) missingFields.push('numSyllables')
    if (!hint) missingFields.push('hint')

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Check if word already exists
    const existingWord = await Word.findOne({ word: word.toLowerCase() })
    if (existingWord) {
      return NextResponse.json(
        { error: 'Word already exists' },
        { status: 409 }
      )
    }

    const newWord = new Word({
      word: word.toLowerCase(),
      category: category.toLowerCase(),
      numLetters: Number.parseInt(numLetters.toString()),
      numSyllables: Number.parseInt(numSyllables.toString()),
      hint,
    })

    await newWord.save()

    const response = NextResponse.json(newWord, { status: 201 })
    return addCorsHeaders(response)
  } catch (error) {
    return handleError(error, 'Failed to create word')
  }
}
