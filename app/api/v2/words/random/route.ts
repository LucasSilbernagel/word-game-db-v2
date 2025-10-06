import { withGetWrapper } from '@/lib/utils/apiWrapper'
import Word from '@/models/word'
import { NextResponse } from 'next/server'

export const GET = withGetWrapper(async () => {
  // Get the total count of documents
  const count = await Word.countDocuments()

  if (count === 0) {
    return NextResponse.json(
      { error: 'No words found in database' },
      { status: 404 }
    )
  }

  // Get a random entry
  const random = Math.floor(Math.random() * count)
  const randomWord = await Word.findOne().skip(random)

  if (!randomWord) {
    return NextResponse.json({ error: 'No random word found' }, { status: 404 })
  }

  return NextResponse.json(randomWord)
})
