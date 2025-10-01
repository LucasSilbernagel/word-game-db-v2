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

    const categories = await Word.distinct('category')

    const response = NextResponse.json(categories)
    return addCorsHeaders(response)
  } catch (error) {
    return handleError(error, 'Failed to fetch categories')
  }
}
