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
      return NextResponse.json(
        { error: 'No random word found' },
        { status: 404 }
      )
    }

    const response = NextResponse.json(randomWord)
    return addCorsHeaders(response)
  } catch (error) {
    return handleError(error, 'Failed to fetch random word')
  }
}
