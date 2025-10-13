import NotFound from '@/app/not-found'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Not Found Page', () => {
  it('should render the NotFoundPage component', () => {
    render(<NotFound />)

    expect(screen.getByText('404')).toBeVisible()
    expect(
      screen.getByRole('heading', { level: 2, name: 'Page Not Found' })
    ).toBeVisible()
    expect(
      screen.getByText(/Sorry, we couldn't find the page you're looking for/)
    ).toBeVisible()
  })

  it('should render navigation buttons', () => {
    render(<NotFound />)

    const goHomeButton = screen.getByRole('link', { name: 'Go Home' })
    expect(goHomeButton).toHaveAttribute('href', '/')

    const contactButton = screen.getByRole('link', { name: 'Get in Touch' })
    expect(contactButton).toHaveAttribute('href', '/contact')
  })

  it('should render helpful links section', () => {
    render(<NotFound />)

    expect(
      screen.getByText(/Here are some helpful links to get you back on track/)
    ).toBeVisible()
  })

  it('should have proper styling', () => {
    render(<NotFound />)

    // Check container styling - the main content is in a div, not a main element
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
  })

  it('should be accessible', () => {
    render(<NotFound />)

    // Check that all interactive elements are accessible
    const goHomeButton = screen.getByRole('link', { name: 'Go Home' })
    const contactButton = screen.getByRole('link', { name: 'Get in Touch' })

    expect(goHomeButton).toBeVisible()
    expect(contactButton).toBeVisible()

    // Check that buttons are keyboard accessible
    expect(goHomeButton).not.toHaveAttribute('tabindex', '-1')
    expect(contactButton).not.toHaveAttribute('tabindex', '-1')
  })

  it('should have proper semantic structure', () => {
    render(<NotFound />)

    // Check that the main heading is properly structured
    const errorNumber = screen.getByText('404')
    const heading = screen.getByRole('heading', { level: 2 })

    // Check that both elements are present and visible
    expect(errorNumber).toBeVisible()
    expect(heading).toBeVisible()
  })
})
