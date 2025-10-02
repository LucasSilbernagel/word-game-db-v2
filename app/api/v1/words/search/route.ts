import { addCorsHeaders, handleCors, handleError } from '@/lib/middleware'
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
    const query = searchParams.get('q')
    const limit = Number.parseInt(searchParams.get('limit') || '10')
    const offset = Number.parseInt(searchParams.get('offset') || '0')

    // Validate query parameter
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    if (query.length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters long' },
        { status: 400 }
      )
    }

    // Execute search with pagination using regex for case-insensitive partial matching
    const words = await Word.find({
      word: {
        $regex: query.toLowerCase(),
        $options: 'i', // case-insensitive
      },
    })
      .limit(limit)
      .skip(offset)

      // eslint-disable-next-line unicorn/no-array-sort
      .sort({ word: 1 })
      .lean()

    const total = await Word.countDocuments({
      word: {
        $regex: query.toLowerCase(),
        $options: 'i',
      },
    })

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
    return addCorsHeaders(response)
  } catch (error) {
    return handleError(error, 'Failed to search words')
  }
}
