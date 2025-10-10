import { withGetWrapper } from '@/lib/utils/apiWrapper'
import Word from '@/models/word'
import { NextResponse } from 'next/server'

export const GET = withGetWrapper(async () => {
  // Use MongoDB aggregation $sample for efficient random selection
  const randomWords = await Word.aggregate([{ $sample: { size: 1 } }])

  if (randomWords.length === 0) {
    return NextResponse.json(
      { error: 'No words found in database' },
      { status: 404 }
    )
  }

  return NextResponse.json(randomWords[0])
})
