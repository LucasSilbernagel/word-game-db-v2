import { withGetWrapper } from '@/lib/utils/apiWrapper'
import Word from '@/models/word'
import { NextResponse } from 'next/server'

export const GET = withGetWrapper(async () => {
  const categories = await Word.distinct('category')
  return NextResponse.json(categories)
})
