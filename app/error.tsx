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
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold">Something went wrong!</h1>
        <p className="text-muted-foreground mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary/90 focus-visible:bg-primary/90 text-primary-foreground rounded-md px-4 py-2"
          aria-label="Try to recover from the error"
        >
          Try again
        </button>
      </div>
    </main>
  )
}

export default Error
