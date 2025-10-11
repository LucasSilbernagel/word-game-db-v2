import Home from '@/app/page'
import { act, render, screen, waitFor } from '@testing-library/react'
import { createElement, ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: ReactNode
    href: string
    [key: string]: unknown
  }) => {
    return createElement('a', { href, ...props }, children)
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
    return createElement(
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

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
    mockConsoleLog.mockClear()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should render the HomePage component', async () => {
    await act(async () => {
      render(<Home />)
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
    render(<Home />)

    const learnMoreButton = screen.getByRole('link', {
      name: 'Learn More About Word Game DB',
    })
    expect(learnMoreButton).toHaveAttribute('href', '/about')

    const contactButton = screen.getByRole('link', { name: 'Get in Touch' })
    expect(contactButton).toHaveAttribute('href', '/contact')
  })

  it('should render the about section', () => {
    render(<Home />)

    // Use getAllByText to handle multiple matches and check the first one
    const aboutTexts = screen.getAllByText((content, element) => {
      return (
        element?.textContent?.includes(
          'Word Game DB is designed for educational purposes'
        ) ?? false
      )
    })
    expect(aboutTexts[0]).toBeVisible()

    expect(
      screen.getByText(/helping developers practice their coding skills/)
    ).toBeVisible()
    // Use getAllByText to handle multiple matches and check the first one
    const hintTexts = screen.getAllByText((content, element) => {
      return (
        element?.textContent?.includes(
          'Each word comes with a category, letter count, syllable count, and helpful hint'
        ) ?? false
      )
    })
    expect(hintTexts[0]).toBeVisible()
  })

  it('should render the API endpoints section', () => {
    render(<Home />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'API Endpoints' })
    ).toBeVisible()
  })

  it('should render all non-destructive endpoints by default', () => {
    render(<Home />)

    // Should render GET endpoints
    expect(
      screen.getByText('Endpoint Demo: GET /api/v2/categories')
    ).toBeVisible()
    expect(
      screen.getByText('Endpoint Demo: GET /api/v2/words/random')
    ).toBeVisible()
    expect(screen.getByText('Endpoint Demo: GET /api/v2/words')).toBeVisible()
    expect(
      screen.getByText('Endpoint Demo: GET /api/v2/words/search')
    ).toBeVisible()
  })

  it('should show loading state for additional endpoints', () => {
    render(<Home />)

    expect(screen.getByText('Loading additional endpoints...')).toBeVisible()
  })

  it('should render endpoint demos with correct props', () => {
    render(<Home />)

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
    render(<Home />)

    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
    const h2Headings = screen.getAllByRole('heading', { level: 2 })
    expect(h2Headings).toHaveLength(3) // "About Word Game DB" (sr-only), "API Versions", and "API Endpoints"

    // Check for screen reader only content
    expect(screen.getByText('About Word Game DB')).toBeInTheDocument()
    // Check for the specific heading text instead of searching for "API endpoints" in content
    expect(
      screen.getByRole('heading', { level: 2, name: 'API Endpoints' })
    ).toBeInTheDocument()

    // Check for navigation landmarks
    expect(
      screen.getByRole('navigation', { name: 'Main navigation' })
    ).toBeVisible()
  })

  it('should have proper styling classes', () => {
    render(<Home />)

    // Check container styling - the main content is in a div, not a main element
    const container = screen
      .getByRole('heading', { level: 1 })
      .closest('.container')
    expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')

    // Check main content styling
    const mainContent = container?.querySelector('div')
    expect(mainContent).toHaveClass('mx-auto', 'max-w-4xl')

    // Check header styling
    const header = screen.getByRole('heading', { level: 1 }).closest('header')
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

  it('should render endpoint cards with proper structure', () => {
    render(<Home />)

    // Check that endpoint cards are rendered - they are divs with card classes
    const cards = screen.getAllByTestId('endpoint-demo')
    expect(cards.length).toBeGreaterThan(0)

    // Check that each card has the expected structure
    for (const card of cards) {
      // The card wrapper is the parent element
      const cardWrapper = card.closest('[class*="bg-card"]')
      expect(cardWrapper).toHaveClass(
        'rounded-lg',
        'border',
        'bg-card',
        'text-card-foreground',
        'shadow-sm'
      )
    }
  })

  it('should handle client-side hydration', async () => {
    render(<Home />)

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
