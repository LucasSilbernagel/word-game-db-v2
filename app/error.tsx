'use client'

import { useEffect } from 'react'

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  useEffect(() => {
    console.error('Application Error:', error)
  }, [error])

  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="mb-4 font-bold text-2xl">Something went wrong!</h1>
        <p className="mb-6 text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary/90 px-4 py-2 rounded-md text-primary-foreground"
          aria-label="Try to recover from the error"
        >
          Try again
        </button>
      </div>
    </main>
  )
}

export default Error
