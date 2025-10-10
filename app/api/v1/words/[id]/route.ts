import {
  withDeleteWrapper,
  withGetWrapper,
  withPutWrapper,
} from '@/lib/utils/apiWrapper'
import { validateAndTransformWordData } from '@/lib/utils/validation'
import Word from '@/models/word'
import { NextRequest, NextResponse } from 'next/server'

export const GET = withGetWrapper(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params
    const word = await Word.findById(id).lean()
    if (!word) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 })
    }

    const response = NextResponse.json(word)

    // Add cache headers - cache for 10 minutes since individual words change rarely
    response.headers.set('Cache-Control', 'public, max-age=600, s-maxage=600')

    return response
  }
)

export const PUT = withPutWrapper(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params
    const body = await request.json()

    // Transform and validate data (only include provided fields)
    const transformedData = validateAndTransformWordData(body)
    const updateData: Record<string, unknown> = {}

    // Only include fields that were actually provided
    if (transformedData.word !== undefined)
      updateData.word = transformedData.word
    if (transformedData.category !== undefined)
      updateData.category = transformedData.category
    if (transformedData.numLetters !== undefined)
      updateData.numLetters = transformedData.numLetters
    if (transformedData.numSyllables !== undefined)
      updateData.numSyllables = transformedData.numSyllables
    if (transformedData.hint !== undefined)
      updateData.hint = transformedData.hint

    const updatedWord = await Word.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedWord) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 })
    }

    return NextResponse.json(updatedWord)
  }
)

export const DELETE = withDeleteWrapper(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params
    const deletedWord = await Word.findByIdAndDelete(id)
    if (!deletedWord) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Word deleted successfully',
    })
  }
)
