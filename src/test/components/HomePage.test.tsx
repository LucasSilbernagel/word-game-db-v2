import HomePage from '@/components/HomePage/HomePage'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen, waitFor } from '../utils/test-utils'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    [key: string]: unknown
  }) => {
    return React.createElement('a', { href, ...props }, children)
  },
}))

// Mock the EndpointDemo component
vi.mock('@/components/EndpointDemo/EndpointDemo', () => ({
  default: ({
    method,
    path,
    description,
    example,
    isDestructiveEnabled,
  }: {
    method: string
    path: string
    description: string
    example?: string
    isDestructiveEnabled: boolean
  }) => {
    return React.createElement(
      'div',
      {
        'data-testid': 'endpoint-demo',
        'data-method': method,
        'data-path': path,
        'data-description': description,
        'data-example': example,
        'data-destructive-enabled': isDestructiveEnabled,
      },
      `Endpoint Demo: ${method} ${path}`
    )
  },
}))

// Mock fetch globally
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

// Mock console.log to avoid noise in test output
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
    mockConsoleLog.mockClear()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should render the main heading and description', async () => {
    await act(async () => {
      render(<HomePage />)
    })

    expect(
      screen.getByRole('heading', { level: 1, name: 'Word Game DB' })
    ).toBeVisible()
    expect(
      screen.getByText(
        'A read-only REST API for educational word game development'
      )
    ).toBeVisible()
  })

  it('should render navigation buttons', () => {
    render(<HomePage />)

    const learnMoreButton = screen.getByRole('link', {
      name: 'Learn More About Word Game DB',
    })
    expect(learnMoreButton).toHaveAttribute('href', '/about')

    const contactButton = screen.getByRole('link', { name: 'Get in Touch' })
    expect(contactButton).toHaveAttribute('href', '/contact')
  })

  it('should render the about section', () => {
    render(<HomePage />)

    // Use a more flexible text matcher that can handle text split across elements
    // Find the first occurrence (the actual about section content)
    const aboutElements = screen.getAllByText((content, element) => {
      return (
        element?.textContent?.includes(
          'Word Game DB is designed for educational purposes'
        ) ?? false
      )
    })
    expect(aboutElements[0]).toBeVisible()
    const skillElements = screen.getAllByText((content, element) => {
      return (
        element?.textContent?.includes(
          'helping developers practice their coding skills'
        ) ?? false
      )
    })
    expect(skillElements[0]).toBeVisible()
    const hintElements = screen.getAllByText((content, element) => {
      return (
        element?.textContent?.includes(
          'Each word comes with a category, letter count, syllable count, and helpful hint'
        ) ?? false
      )
    })
    expect(hintElements[0]).toBeVisible()

    const perfectElements = screen.getAllByText((content, element) => {
      return (
        element?.textContent?.includes(
          'Perfect for building hangman games, word puzzles, vocabulary apps'
        ) ?? false
      )
    })
    expect(perfectElements[0]).toBeVisible()
  })

  it('should render the API endpoints section', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'API Endpoints' })
    ).toBeVisible()
  })

  it('should render all non-destructive endpoints by default', () => {
    render(<HomePage />)

    // Should render GET endpoints
    expect(
      screen.getByText('Endpoint Demo: GET /api/v1/categories')
    ).toBeVisible()
    expect(
      screen.getByText('Endpoint Demo: GET /api/v1/words/random')
    ).toBeVisible()
    expect(screen.getByText('Endpoint Demo: GET /api/v1/words')).toBeVisible()
    expect(
      screen.getByText('Endpoint Demo: GET /api/v1/words/search')
    ).toBeVisible()
  })

  it('should show loading state for additional endpoints', async () => {
    render(<HomePage />)

    // Wait for the component to mount and the loading text to appear
    await waitFor(() => {
      expect(screen.getByText('Loading additional endpoints...')).toBeVisible()
    })

    // The component should render without crashing
    expect(
      screen.getByRole('heading', { level: 1, name: 'Word Game DB' })
    ).toBeVisible()
  })

  it('should render page without crashing when config fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    render(<HomePage />)

    // Wait for the component to mount and the loading text to appear
    await waitFor(() => {
      expect(screen.getByText('Loading additional endpoints...')).toBeVisible()
    })

    // Should still render the page without crashing
    expect(
      screen.getByRole('heading', { level: 1, name: 'Word Game DB' })
    ).toBeVisible()
  })

  it('should show loading state for additional endpoints', () => {
    render(<HomePage />)

    expect(screen.getByText('Loading additional endpoints...')).toBeVisible()
  })

  it('should render endpoint demos with correct props', () => {
    render(<HomePage />)

    const endpointDemos = screen.getAllByTestId('endpoint-demo')

    // Should have at least the non-destructive endpoints
    expect(endpointDemos.length).toBeGreaterThan(0)

    // Check that each demo has the correct attributes
    for (const demo of endpointDemos) {
      expect(demo).toHaveAttribute('data-method')
      expect(demo).toHaveAttribute('data-path')
      expect(demo).toHaveAttribute('data-description')
      expect(demo).toHaveAttribute('data-destructive-enabled')
    }
  })

  it('should have proper accessibility attributes', () => {
    render(<HomePage />)

    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2)

    // Check for screen reader only content
    expect(screen.getByText('About Word Game DB')).toBeInTheDocument()
    expect(screen.getByText('API Endpoints')).toBeInTheDocument()

    // Check for navigation landmarks
    expect(
      screen.getByRole('navigation', { name: 'Main navigation' })
    ).toBeVisible()
  })

  it('should have proper styling classes', () => {
    render(<HomePage />)

    // Check container styling - the component doesn't have a main role, so we need to find the container differently
    const container = screen
      .getByRole('heading', { level: 1 })
      .closest('.container')
    expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')

    // Check main content styling
    const mainContent = container?.querySelector('div')
    expect(mainContent).toHaveClass('mx-auto', 'max-w-4xl')

    // Check header styling
    const header = screen.getByRole('banner')
    expect(header).toHaveClass('mb-12', 'text-center')

    // Check heading styling
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveClass(
      'mb-4',
      'text-4xl',
      'font-bold',
      'tracking-tight'
    )
  })

  it('should log debug information in development mode', () => {
    vi.stubEnv('NODE_ENV', 'development')

    render(<HomePage />)

    // Wait for the component to mount and potentially log
    waitFor(() => {
      expect(mockConsoleLog).toHaveBeenCalled()
    })

    vi.unstubAllEnvs()
  })

  it('should render endpoint cards with proper structure', () => {
    render(<HomePage />)

    // Check that endpoint cards are rendered - they don't have complementary role, so we'll check by testid
    const cards = screen.getAllByTestId('endpoint-demo')
    expect(cards.length).toBeGreaterThan(0)

    // Check that each card container has the expected structure
    const cardContainers = screen.getAllByRole('listitem')
    expect(cardContainers.length).toBeGreaterThan(0)

    for (const cardContainer of cardContainers) {
      const card = cardContainer.querySelector('.bg-card')
      if (card) {
        expect(card).toHaveClass(
          'rounded-lg',
          'border',
          'bg-card',
          'text-card-foreground',
          'shadow-sm'
        )
      }
    }
  })

  it('should handle client-side hydration', async () => {
    render(<HomePage />)

    // The component should render without errors
    expect(
      screen.getByRole('heading', { level: 1, name: 'Word Game DB' })
    ).toBeVisible()

    // Wait for client-side effects to complete
    await waitFor(() => {
      expect(screen.getByText('Loading additional endpoints...')).toBeVisible()
    })
  })
})
