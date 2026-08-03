import { useState } from 'react'

export const useApiState = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [isDebouncing, setIsDebouncing] = useState(false)

  const clearResponse = () => {
    setResponse(null)
    setError(null)
    setErrorCode(null)
  }

  return {
    isLoading,
    setIsLoading,
    response,
    setResponse,
    error,
    setError,
    errorCode,
    setErrorCode,
    isDebouncing,
    setIsDebouncing,
    clearResponse,
  }
}
