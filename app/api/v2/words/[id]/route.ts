import {
  deleteWordByIdHandler,
  getWordByIdHandler,
  putWordByIdHandler,
} from '@/lib/utils/apiHandlers'
import {
  withDeleteWrapper,
  withGetWrapper,
  withPutWrapper,
} from '@/lib/utils/apiWrapper'
import { NextRequest } from 'next/server'

export const GET = withGetWrapper(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params
    return getWordByIdHandler(id)
  }
)

export const PUT = withPutWrapper(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params
    return putWordByIdHandler(id, request)
  }
)

export const DELETE = withDeleteWrapper(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params
    return deleteWordByIdHandler(id)
  }
)
