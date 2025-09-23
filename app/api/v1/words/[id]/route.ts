import {
  addCorsHeaders,
  handleCors,
  handleDisabledEndpoint,
  handleError,
  isDestructiveEndpointEnabled,
} from '@/lib/middleware'
import connectDB from '@/lib/mongodb'
import Word from '@/models/word'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  try {
    await connectDB()

    const word = await Word.findById(params.id)
    if (!word) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 })
    }

    const response = NextResponse.json(word)
    return addCorsHeaders(response)
  } catch (error) {
    return handleError(error, 'Failed to fetch word')
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  // Check if destructive endpoints are enabled
  if (!isDestructiveEndpointEnabled()) {
    return handleDisabledEndpoint('PUT')
  }

  try {
    await connectDB()

    const body = await request.json()
    const { word, category, numLetters, numSyllables, hint } = body

    const updateData: Record<string, unknown> = {}
    if (word) updateData.word = word.toLowerCase()
    if (category) updateData.category = category.toLowerCase()
    if (numLetters)
      updateData.numLetters = Number.parseInt(numLetters.toString())
    if (numSyllables)
      updateData.numSyllables = Number.parseInt(numSyllables.toString())
    if (hint) updateData.hint = hint

    const updatedWord = await Word.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!updatedWord) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 })
    }

    const response = NextResponse.json(updatedWord)
    return addCorsHeaders(response)
  } catch (error) {
    return handleError(error, 'Failed to update word')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Handle CORS preflight
  const corsResponse = handleCors(request)
  if (corsResponse) return corsResponse

  // Check if destructive endpoints are enabled
  if (!isDestructiveEndpointEnabled()) {
    return handleDisabledEndpoint('DELETE')
  }

  try {
    await connectDB()

    const deletedWord = await Word.findByIdAndDelete(params.id)
    if (!deletedWord) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 })
    }

    const response = NextResponse.json({
      message: 'Word deleted successfully',
    })
    return addCorsHeaders(response)
  } catch (error) {
    return handleError(error, 'Failed to delete word')
  }
}
