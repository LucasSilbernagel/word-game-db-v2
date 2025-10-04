import { useApiState } from '@/components/EndpointDemo/hooks/useApiState'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('useApiState', () => {
  it('should initialize with default state', () => {
    const { result } = renderHook(() => useApiState())

    expect(result.current.isLoading).toBe(false)
    expect(result.current.response).toBe(null)
    expect(result.current.error).toBe(null)
    expect(result.current.isDebouncing).toBe(false)
  })

  it('should update isLoading state', () => {
    const { result } = renderHook(() => useApiState())

    act(() => {
      result.current.setIsLoading(true)
    })

    expect(result.current.isLoading).toBe(true)
  })

  it('should update response state', () => {
    const { result } = renderHook(() => useApiState())
    const mockResponse = '{"data": "test"}'

    act(() => {
      result.current.setResponse(mockResponse)
    })

    expect(result.current.response).toBe(mockResponse)
  })

  it('should update error state', () => {
    const { result } = renderHook(() => useApiState())
    const mockError = 'Network error'

    act(() => {
      result.current.setError(mockError)
    })

    expect(result.current.error).toBe(mockError)
  })

  it('should update isDebouncing state', () => {
    const { result } = renderHook(() => useApiState())

    act(() => {
      result.current.setIsDebouncing(true)
    })

    expect(result.current.isDebouncing).toBe(true)
  })

  it('should clear response and error', () => {
    const { result } = renderHook(() => useApiState())

    // Set some state
    act(() => {
      result.current.setResponse('{"data": "test"}')
      result.current.setError('Some error')
    })

    expect(result.current.response).toBe('{"data": "test"}')
    expect(result.current.error).toBe('Some error')

    // Clear response and error
    act(() => {
      result.current.clearResponse()
    })

    expect(result.current.response).toBe(null)
    expect(result.current.error).toBe(null)
  })

  it('should maintain separate state instances', () => {
    const { result: result1 } = renderHook(() => useApiState())
    const { result: result2 } = renderHook(() => useApiState())

    // Update first instance
    act(() => {
      result1.current.setResponse('response1')
      result1.current.setError('error1')
    })

    // Update second instance
    act(() => {
      result2.current.setResponse('response2')
      result2.current.setError('error2')
    })

    expect(result1.current.response).toBe('response1')
    expect(result1.current.error).toBe('error1')
    expect(result2.current.response).toBe('response2')
    expect(result2.current.error).toBe('error2')
  })

  it('should allow updating all states independently', () => {
    const { result } = renderHook(() => useApiState())

    act(() => {
      result.current.setIsLoading(true)
      result.current.setIsDebouncing(true)
      result.current.setResponse('{"status": "loading"}')
    })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.isDebouncing).toBe(true)
    expect(result.current.response).toBe('{"status": "loading"}')
    expect(result.current.error).toBe(null)

    act(() => {
      result.current.setError('Something went wrong')
      result.current.setIsLoading(false)
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isDebouncing).toBe(true)
    expect(result.current.response).toBe('{"status": "loading"}')
    expect(result.current.error).toBe('Something went wrong')
  })

  it('should handle null and empty string values', () => {
    const { result } = renderHook(() => useApiState())

    // Set some initial values
    act(() => {
      result.current.setResponse('{"data": "test"}')
      result.current.setError('error')
    })

    // Set to null
    act(() => {
      result.current.setResponse(null)
      result.current.setError(null)
    })

    expect(result.current.response).toBe(null)
    expect(result.current.error).toBe(null)

    // Set to empty strings
    act(() => {
      result.current.setResponse('')
      result.current.setError('')
    })

    expect(result.current.response).toBe('')
    expect(result.current.error).toBe('')
  })
})
