'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application Error:', error)
  }, [error])

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="text-center">
        <h2 className="mb-4 font-bold text-2xl">Something went wrong!</h2>
        <p className="mb-6 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-md text-primary-foreground"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
