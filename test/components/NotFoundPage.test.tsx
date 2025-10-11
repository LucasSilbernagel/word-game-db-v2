import NotFoundPage from '@/components/NotFoundPage/NotFoundPage'
import { createElement, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '../utils/test-utils'

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

describe('NotFoundPage', () => {
  it('should render the 404 heading and error message', () => {
    render(<NotFoundPage />)

    expect(screen.getByText('404')).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Page Not Found' })
    ).toBeVisible()
    expect(
      screen.getByText(/Sorry, we couldn't find the page you're looking for/)
    ).toBeVisible()
  })

  it('should render the helpful links section', () => {
    render(<NotFoundPage />)

    expect(
      screen.getByText(/Here are some helpful links to get you back on track/)
    ).toBeVisible()
  })

  it('should render navigation buttons with correct links', () => {
    render(<NotFoundPage />)

    const goHomeButton = screen.getByRole('link', { name: 'Go Home' })
    expect(goHomeButton).toHaveAttribute('href', '/')

    const contactButton = screen.getByRole('link', { name: 'Get in Touch' })
    expect(contactButton).toHaveAttribute('href', '/contact')
  })

  it('should have proper styling classes', () => {
    render(<NotFoundPage />)

    // Check container styling - find container by class since there's no main role
    const container = screen.getByText('404').closest('.container')
    expect(container).toHaveClass('container', 'mx-auto', 'px-4', 'py-8')

    // Check main content styling
    const mainContent = container?.querySelector('div')
    expect(mainContent).toHaveClass('mx-auto', 'max-w-2xl', 'text-center')

    // Check 404 number styling
    const errorNumber = screen.getByText('404')
    expect(errorNumber).toHaveClass(
      'text-primary',
      'mb-4',
      'text-6xl',
      'font-bold'
    )

    // Check heading styling
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveClass('mb-4', 'text-3xl', 'font-semibold')

    // Check paragraph styling
    const paragraph = screen.getByText(/Sorry, we couldn't find the page/)
    expect(paragraph).toHaveClass('text-muted-foreground', 'text-lg')

    // Check card styling - find card by class since it doesn't have complementary role
    const card = screen
      .getByText(/Here are some helpful links/)
      .closest('.bg-card')
    expect(card).toHaveClass('mb-8')
  })

  it('should have proper button styling', () => {
    render(<NotFoundPage />)

    const buttons = screen.getAllByRole('link')

    // Both buttons should be rendered
    expect(buttons).toHaveLength(2)

    // Check that buttons are in a flex container
    const buttonContainer = buttons[0].parentElement
    expect(buttonContainer).toHaveClass(
      'flex',
      'flex-col',
      'gap-3',
      'sm:flex-row',
      'sm:justify-center'
    )
  })

  it('should have proper semantic structure', () => {
    render(<NotFoundPage />)

    // Check that the main heading is properly structured
    const errorNumber = screen.getByText('404')
    const heading = screen.getByRole('heading', { level: 2 })

    // The 404 should come before the heading
    expect(errorNumber.compareDocumentPosition(heading)).toBe(4)
  })

  it('should be accessible', () => {
    render(<NotFoundPage />)

    // Check that all interactive elements are accessible
    const goHomeButton = screen.getByRole('link', { name: 'Go Home' })
    const contactButton = screen.getByRole('link', { name: 'Get in Touch' })

    expect(goHomeButton).toBeVisible()
    expect(contactButton).toBeVisible()

    // Check that buttons are keyboard accessible
    expect(goHomeButton).not.toHaveAttribute('tabindex', '-1')
    expect(contactButton).not.toHaveAttribute('tabindex', '-1')
  })
})
