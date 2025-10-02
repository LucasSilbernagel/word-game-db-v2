import { DEFAULTS } from '@/lib/constants'
import { withGetWrapper } from '@/lib/utils/apiWrapper'
import { extractPaginationParams } from '@/lib/utils/validation'
import Word from '@/models/word'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withGetWrapper(async (request: NextRequest) => {
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

  // Build search filter
  const searchFilter = {
    word: {
      $regex: query.toLowerCase(),
      $options: 'i', // case-insensitive
    },
  }

  // Execute search with pagination using regex for case-insensitive partial matching
  // eslint-disable-next-line unicorn/no-array-callback-reference
  const words = await Word.find(searchFilter)
    .limit(limit)
    .skip(offset)
    // eslint-disable-next-line unicorn/no-array-sort
    .sort({ word: 1 })
    .lean()

  const total = await Word.countDocuments(searchFilter)

  return NextResponse.json({
    words,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    },
    query,
  })
})
