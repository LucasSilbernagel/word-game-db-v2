import { addCorsHeaders, handleCors, handleError } from '@/lib/middleware'
import connectDB from '@/lib/mongodb'
import Word from '@/models/word'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type')
    const limit = Number.parseInt(searchParams.get('limit') || '10')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    // Build search filter
    const filter: Record<string, unknown> = {
      $or: [
        { word: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { hint: { $regex: query, $options: 'i' } },
      ],
    }

    // Add type-specific filters
    if (type) {
      switch (type) {
        case 'crossword': {
          filter.numLetters = { $gte: 3, $lte: 15 }
          break
        }
        case 'scrabble': {
          filter.numLetters = { $gte: 2, $lte: 7 }
          break
        }
        case 'wordsearch': {
          filter.numLetters = { $gte: 4, $lte: 12 }
          break
        }
        default: {
          break
        }
      }
    }

    // eslint-disable-next-line unicorn/no-array-callback-reference
    const words = await Word.find(filter).limit(limit).skip(offset).lean()

    // Sort the results array
    const sortedWords = words.toSorted((a, b) => {
      // First sort by numLetters (ascending)
      if (a.numLetters !== b.numLetters) {
        return a.numLetters - b.numLetters
      }
      // Then sort by word (ascending)
      return a.word.localeCompare(b.word)
    })

    const total = await Word.countDocuments(filter)

    const response = NextResponse.json({
      words: sortedWords,
      query,
      type,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
    return addCorsHeaders(response)
  } catch (error) {
    return handleError(error, 'Failed to search words')
  }
}
