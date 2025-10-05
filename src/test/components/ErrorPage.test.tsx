import ErrorPage from '@/components/ErrorPage/ErrorPage'
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '../utils/test-utils'

// Mock console.error to avoid noise in test output
const mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('ErrorPage', () => {
  const mockError = new Error('Test error message')
  const mockReset = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(() => {
    mockConsoleError.mockRestore()
  })

  it('should render the error message and reset button', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Something went wrong!' })
    ).toBeVisible()
    expect(
      screen.getByText('An unexpected error occurred. Please try again.')
    ).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Try to recover from the error' })
    ).toBeVisible()
  })

  it('should call console.error with the error when component mounts', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Application Error:',
      mockError
    )
  })

  it('should call reset function when reset button is clicked', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)

    const resetButton = screen.getByRole('button', {
      name: 'Try to recover from the error',
    })
    fireEvent.click(resetButton)

    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('should render with proper accessibility attributes', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)

    const resetButton = screen.getByRole('button', {
      name: 'Try to recover from the error',
    })
    expect(resetButton).toHaveAttribute(
      'aria-label',
      'Try to recover from the error'
    )
  })

  it('should have proper styling classes', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)

    const main = screen.getByRole('main')
    expect(main).toHaveClass(
      'flex',
      'min-h-screen',
      'flex-col',
      'items-center',
      'justify-center'
    )

    const container = main.querySelector('div')
    expect(container).toHaveClass('text-center')

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass('mb-4', 'text-2xl', 'font-bold')

    const paragraph = screen.getByText(
      'An unexpected error occurred. Please try again.'
    )
    expect(paragraph).toHaveClass('text-muted-foreground', 'mb-6')

    const resetButton = screen.getByRole('button')
    expect(resetButton).toHaveClass(
      'bg-primary',
      'hover:bg-primary/90',
      'focus-visible:bg-primary/90',
      'text-primary-foreground',
      'rounded-md',
      'px-4',
      'py-2'
    )
  })

  it('should handle error with digest property', () => {
    const errorWithDigest = { ...mockError, digest: 'abc123' }
    render(<ErrorPage error={errorWithDigest} reset={mockReset} />)

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Application Error:',
      errorWithDigest
    )
  })

  it('should re-call console.error when error prop changes', () => {
    const { rerender } = render(
      <ErrorPage error={mockError} reset={mockReset} />
    )

    const newError = new Error('New error message')
    rerender(<ErrorPage error={newError} reset={mockReset} />)

    expect(mockConsoleError).toHaveBeenCalledTimes(2)
    expect(mockConsoleError).toHaveBeenNthCalledWith(
      1,
      'Application Error:',
      mockError
    )
    expect(mockConsoleError).toHaveBeenNthCalledWith(
      2,
      'Application Error:',
      newError
    )
  })
})
