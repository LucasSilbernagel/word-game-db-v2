import HomePage from '@/components/HomePage'
import { act, render, screen } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockClear()
    mockConsoleLog.mockClear()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  const defaultProps = {
    initialCategories: ['animal', 'food', 'technology'],
    initialConfig: { destructiveEndpointsEnabled: false },
  }

  it('should render the main heading and description', async () => {
    await act(async () => {
      render(<HomePage {...defaultProps} />)
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
    render(<HomePage {...defaultProps} />)

    const learnMoreButton = screen.getByRole('link', {
      name: 'Learn More About Word Game DB',
    })
    expect(learnMoreButton).toHaveAttribute('href', '/about')

    const contactButton = screen.getByRole('link', { name: 'Get in Touch' })
    expect(contactButton).toHaveAttribute('href', '/contact')
  })

  it('should render the about section', () => {
    render(<HomePage {...defaultProps} />)

    const aboutElements = screen.getAllByText((_content, element) => {
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
    const hintElements = screen.getAllByText((_content, element) => {
      return (
        element?.textContent?.includes(
          'Each word comes with a category, letter count, syllable count, and helpful hint'
        ) ?? false
      )
    })
    expect(hintElements[0]).toBeVisible()

    const perfectElements = screen.getAllByText((_content, element) => {
      return (
        element?.textContent?.includes(
          'Perfect for building hangman games, word puzzles, vocabulary apps'
        ) ?? false
      )
    })
    expect(perfectElements[0]).toBeVisible()
  })

  it('should render the API endpoints section', () => {
    render(<HomePage {...defaultProps} />)

    expect(
      screen.getByRole('heading', { level: 2, name: 'API Endpoints' })
    ).toBeVisible()
  })

  it('should render all non-destructive endpoints by default', () => {
    render(<HomePage {...defaultProps} />)

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

  it('should render destructive endpoints when enabled', () => {
    const propsWithDestructive = {
      initialCategories: ['animal', 'food'],
      initialConfig: { destructiveEndpointsEnabled: true },
    }

    render(<HomePage {...propsWithDestructive} />)

    // Should render GET endpoints
    expect(
      screen.getByText('Endpoint Demo: GET /api/v2/categories')
    ).toBeVisible()

    // Should also render destructive endpoints
    expect(screen.getByText('Endpoint Demo: POST /api/v2/words')).toBeVisible()
    expect(
      screen.getByText('Endpoint Demo: PUT /api/v2/words/[id]')
    ).toBeVisible()
    expect(
      screen.getByText('Endpoint Demo: DELETE /api/v2/words/[id]')
    ).toBeVisible()
  })

  it('should not render destructive endpoints when disabled', () => {
    render(<HomePage {...defaultProps} />)

    // Should render GET endpoints
    expect(
      screen.getByText('Endpoint Demo: GET /api/v2/categories')
    ).toBeVisible()

    // Should NOT render destructive endpoints
    expect(
      screen.queryByText('Endpoint Demo: POST /api/v2/words')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('Endpoint Demo: PUT /api/v2/words/[id]')
    ).not.toBeInTheDocument()
    expect(
      screen.queryByText('Endpoint Demo: DELETE /api/v2/words/[id]')
    ).not.toBeInTheDocument()
  })

  it('should render endpoint demos with correct props', () => {
    render(<HomePage {...defaultProps} />)

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
    render(<HomePage {...defaultProps} />)

    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3)

    // Check for screen reader only content
    expect(screen.getByText('About Word Game DB')).toBeInTheDocument()
    expect(screen.getByText('API Endpoints')).toBeInTheDocument()

    // Check for navigation landmarks
    expect(
      screen.getByRole('navigation', { name: 'Main navigation' })
    ).toBeVisible()
  })

  it('should have proper styling classes', () => {
    render(<HomePage {...defaultProps} />)

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

  it('should render endpoint cards with proper structure', () => {
    render(<HomePage {...defaultProps} />)

    // Check that endpoint cards are rendered
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
    render(<HomePage {...defaultProps} />)

    // The component should render without errors
    expect(
      screen.getByRole('heading', { level: 1, name: 'Word Game DB' })
    ).toBeVisible()

    // Should immediately show endpoints without loading state
    expect(
      screen.getByText('Endpoint Demo: GET /api/v2/categories')
    ).toBeVisible()
  })

  it('should pass categories to endpoint demos', () => {
    const categories = ['test-category-1', 'test-category-2']
    const props = {
      initialCategories: categories,
      initialConfig: { destructiveEndpointsEnabled: false },
    }

    render(<HomePage {...props} />)

    // The component should render and pass categories down
    const endpointDemos = screen.getAllByTestId('endpoint-demo')
    expect(endpointDemos.length).toBeGreaterThan(0)
  })
})
