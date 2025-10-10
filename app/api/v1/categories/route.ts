import { withGetWrapper } from '@/lib/utils/apiWrapper'
import Word from '@/models/word'
import { NextResponse } from 'next/server'

export const GET = withGetWrapper(async () => {
  const categories = await Word.distinct('category')

  const response = NextResponse.json(categories)

  // Add cache headers - cache for 15 minutes since categories change infrequently
  response.headers.set('Cache-Control', 'public, max-age=900, s-maxage=900')

  return response
})
