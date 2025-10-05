import Footer from '@/components/Footer/Footer'
import { describe, expect, it } from 'vitest'
import { render, screen } from '../utils/test-utils'

describe('Footer', () => {
  it('should render with proper structure', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeVisible()
    expect(footer).toHaveClass('bg-background', 'border-t')
  })

  it('should render the author link', () => {
    render(<Footer />)

    const authorLink = screen.getByRole('link', { name: 'Lucas Silbernagel' })
    expect(authorLink).toBeVisible()
    expect(authorLink).toHaveAttribute('href', 'https://lucassilbernagel.com/')
    expect(authorLink).toHaveAttribute('target', '_blank')
    expect(authorLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(authorLink).toHaveClass('text-primary')
  })

  it('should render the built by text', () => {
    render(<Footer />)

    expect(screen.getByText('Built by')).toBeVisible()
    expect(screen.getByText('Lucas Silbernagel')).toBeVisible()
  })

  it('should have proper container styling', () => {
    render(<Footer />)

    const container = screen
      .getByRole('contentinfo')
      .querySelector('.container')
    expect(container).toHaveClass('mx-auto', 'px-4', 'py-8')

    const content = container?.querySelector('div')
    expect(content).toHaveClass('mx-auto', 'max-w-4xl', 'text-center')
  })

  it('should have proper text styling', () => {
    render(<Footer />)

    const text = screen.getByText('Built by')
    expect(text).toHaveClass('text-muted-foreground', 'text-sm')
  })

  it('should be accessible', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeVisible()

    const authorLink = screen.getByRole('link', { name: 'Lucas Silbernagel' })
    expect(authorLink).toBeVisible()
    expect(authorLink).toHaveAttribute('target', '_blank')
    expect(authorLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should have proper semantic structure', () => {
    render(<Footer />)

    const footer = screen.getByRole('contentinfo')
    const container = footer.querySelector('.container')
    const content = container?.querySelector('div')
    const paragraph = content?.querySelector('p')
    const link = paragraph?.querySelector('a')

    expect(container).toBeInTheDocument()
    expect(content).toBeInTheDocument()
    expect(paragraph).toBeInTheDocument()
    expect(link).toBeInTheDocument()
  })

  it('should handle external link properly', () => {
    render(<Footer />)

    const authorLink = screen.getByRole('link', { name: 'Lucas Silbernagel' })

    // Check that it's an external link
    expect(authorLink).toHaveAttribute('target', '_blank')
    expect(authorLink).toHaveAttribute('rel', 'noopener noreferrer')

    // Check the URL
    expect(authorLink).toHaveAttribute('href', 'https://lucassilbernagel.com/')
  })

  it('should have proper text content structure', () => {
    render(<Footer />)

    const paragraph = screen.getByText('Built by').parentElement
    expect(paragraph).toHaveTextContent('Built by Lucas Silbernagel')

    // Check that the text is split correctly
    expect(screen.getByText('Built by')).toBeVisible()
    expect(screen.getByText('Lucas Silbernagel')).toBeVisible()
  })
})
