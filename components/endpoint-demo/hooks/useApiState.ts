import { useState } from 'react'

export const useApiState = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDebouncing, setIsDebouncing] = useState(false)

  const clearResponse = () => {
    setResponse(null)
    setError(null)
  }

  return {
    isLoading,
    setIsLoading,
    response,
    setResponse,
    error,
    setError,
    isDebouncing,
    setIsDebouncing,
    clearResponse,
  }
}
