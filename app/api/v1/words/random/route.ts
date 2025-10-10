import { withGetWrapper } from '@/lib/utils/apiWrapper'
import { buildWordFilter } from '@/lib/utils/validation'
import Word from '@/models/word'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withGetWrapper(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const mongoFilter = buildWordFilter(searchParams)

  // Use MongoDB aggregation for efficient random selection with filters
  // $match applies the filters, then $sample randomly selects one document
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
})
