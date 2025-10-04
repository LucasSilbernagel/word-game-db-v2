import {
  withApiWrapper,
  withGetWrapper,
  withPostWrapper,
} from '@/lib/utils/apiWrapper'
import type { Mongoose } from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the middleware functions
vi.mock('@/lib/middleware', () => ({
  handleCors: vi.fn(),
  addCorsHeaders: vi.fn((response) => response),
  handleDisabledEndpoint: vi.fn(() =>
    NextResponse.json({ error: 'Endpoint disabled' }, { status: 403 })
  ),
  handleError: vi.fn((error, message) =>
    NextResponse.json(
      { error: message, details: error.message },
      { status: 500 }
    )
  ),
  isDestructiveEndpointEnabled: vi.fn(() => true),
}))

// Mock the database connection
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn(),
}))

describe('apiWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('withApiWrapper', () => {
    it('should call handler successfully', async () => {
      const mockHandler = vi
        .fn()
        .mockResolvedValue(NextResponse.json({ success: true }))
      const mockRequest = new NextRequest('http://localhost:3000/api/test')

      const { handleCors, addCorsHeaders } = await import('@/lib/middleware')
      const { default: connectDB } = await import('@/lib/mongodb')

      vi.mocked(handleCors).mockReturnValue(null)
      vi.mocked(connectDB).mockResolvedValue({} as Mongoose)

      const wrappedHandler = withApiWrapper(mockHandler)
      const response = await wrappedHandler(mockRequest)

      expect(handleCors).toHaveBeenCalledWith(mockRequest)
      expect(connectDB).toHaveBeenCalled()
      expect(mockHandler).toHaveBeenCalledWith(mockRequest, undefined)
      expect(addCorsHeaders).toHaveBeenCalledWith(response)
      expect(response.status).toBe(200)
    })

    it('should handle CORS preflight', async () => {
      const mockHandler = vi.fn()
      const mockRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'OPTIONS',
      })
      const corsResponse = NextResponse.json({}, { status: 200 })

      const { handleCors } = await import('@/lib/middleware')
      vi.mocked(handleCors).mockReturnValue(corsResponse)

      const wrappedHandler = withApiWrapper(mockHandler)
      const response = await wrappedHandler(mockRequest)

      expect(handleCors).toHaveBeenCalledWith(mockRequest)
      expect(response).toBe(corsResponse)
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should handle disabled destructive endpoints', async () => {
      const mockHandler = vi.fn()
      const mockRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      })

      const { handleCors, isDestructiveEndpointEnabled } = await import(
        '@/lib/middleware'
      )
      vi.mocked(handleCors).mockReturnValue(null)
      vi.mocked(isDestructiveEndpointEnabled).mockReturnValue(false)

      const wrappedHandler = withApiWrapper(mockHandler, {
        isDestructive: true,
      })
      const response = await wrappedHandler(mockRequest)

      expect(response.status).toBe(403)
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should handle database connection errors', async () => {
      const mockHandler = vi
        .fn()
        .mockResolvedValue(NextResponse.json({ success: true }))
      const mockRequest = new NextRequest('http://localhost:3000/api/test')

      const { handleCors } = await import('@/lib/middleware')
      const { default: connectDB } = await import('@/lib/mongodb')

      vi.mocked(handleCors).mockReturnValue(null)
      vi.mocked(connectDB).mockRejectedValue(
        new Error('Database connection failed')
      )

      const wrappedHandler = withApiWrapper(mockHandler)
      const response = await wrappedHandler(mockRequest)

      expect(response.status).toBe(500)
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should handle handler errors', async () => {
      const mockHandler = vi.fn().mockRejectedValue(new Error('Handler failed'))
      const mockRequest = new NextRequest('http://localhost:3000/api/test')

      const { handleCors } = await import('@/lib/middleware')
      const { default: connectDB } = await import('@/lib/mongodb')

      vi.mocked(handleCors).mockReturnValue(null)
      vi.mocked(connectDB).mockResolvedValue({} as Mongoose)

      const wrappedHandler = withApiWrapper(mockHandler)
      const response = await wrappedHandler(mockRequest)

      expect(response.status).toBe(500)
      expect(mockHandler).toHaveBeenCalledWith(mockRequest, undefined)
    })

    it('should pass context parameter to handler', async () => {
      const mockHandler = vi
        .fn()
        .mockResolvedValue(NextResponse.json({ success: true }))
      const mockRequest = new NextRequest('http://localhost:3000/api/test')
      const mockContext = { params: { id: '123' } }

      const { handleCors } = await import('@/lib/middleware')
      const { default: connectDB } = await import('@/lib/mongodb')

      vi.mocked(handleCors).mockReturnValue(null)
      vi.mocked(connectDB).mockResolvedValue({} as Mongoose)

      const wrappedHandler = withApiWrapper(mockHandler)
      await wrappedHandler(mockRequest, mockContext)

      expect(mockHandler).toHaveBeenCalledWith(mockRequest, mockContext)
    })
  })

  describe('withGetWrapper', () => {
    it('should create wrapper with GET method', async () => {
      const mockHandler = vi
        .fn()
        .mockResolvedValue(NextResponse.json({ success: true }))
      const mockRequest = new NextRequest('http://localhost:3000/api/test')

      const { handleCors } = await import('@/lib/middleware')
      const { default: connectDB } = await import('@/lib/mongodb')

      vi.mocked(handleCors).mockReturnValue(null)
      vi.mocked(connectDB).mockResolvedValue({} as Mongoose)

      const wrappedHandler = withGetWrapper(mockHandler)
      const response = await wrappedHandler(mockRequest)

      expect(response.status).toBe(200)
      expect(mockHandler).toHaveBeenCalledWith(mockRequest, undefined)
    })
  })

  describe('withPostWrapper', () => {
    it('should create wrapper with POST method and destructive flag', async () => {
      const mockHandler = vi
        .fn()
        .mockResolvedValue(NextResponse.json({ success: true }))
      const mockRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      })

      const { handleCors, isDestructiveEndpointEnabled } = await import(
        '@/lib/middleware'
      )
      const { default: connectDB } = await import('@/lib/mongodb')

      vi.mocked(handleCors).mockReturnValue(null)
      vi.mocked(connectDB).mockResolvedValue({} as Mongoose)
      vi.mocked(isDestructiveEndpointEnabled).mockReturnValue(true)

      const wrappedHandler = withPostWrapper(mockHandler)
      const response = await wrappedHandler(mockRequest)

      expect(response.status).toBe(200)
      expect(mockHandler).toHaveBeenCalledWith(mockRequest, undefined)
    })

    it('should disable POST endpoint when destructive endpoints are disabled', async () => {
      const mockHandler = vi.fn()
      const mockRequest = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
      })

      const { handleCors, isDestructiveEndpointEnabled } = await import(
        '@/lib/middleware'
      )
      vi.mocked(handleCors).mockReturnValue(null)
      vi.mocked(isDestructiveEndpointEnabled).mockReturnValue(false)

      const wrappedHandler = withPostWrapper(mockHandler)
      const response = await wrappedHandler(mockRequest)

      expect(response.status).toBe(403)
      expect(mockHandler).not.toHaveBeenCalled()
    })
  })
})
