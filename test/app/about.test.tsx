import About from '@/app/about/page'
import { render, screen } from '@testing-library/react'
import { createElement, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

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

describe('About Page', () => {
  it('should render the AboutPage component', () => {
    render(<About />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'About' })
    ).toBeVisible()
    expect(
      screen.getByText('Learn more about the Word Game DB project')
    ).toBeVisible()
  })

  it('should render all AboutPage content', () => {
    render(<About />)

    // Check main heading
    expect(
      screen.getByRole('heading', { level: 1, name: 'About' })
    ).toBeVisible()

    // Check project description - there are multiple "Word Game DB" texts, so we need to be more specific
    const aboutTexts = screen.getAllByText((content, element) => {
      return (
        element?.textContent?.includes(
          'Word Game DB is a REST API originally built with the MERN stack'
        ) ?? false
      )
    })
    expect(aboutTexts[0]).toBeVisible()
    expect(
      screen.getByText(/is a REST API originally built with the MERN stack/)
    ).toBeVisible()

    // Check tech stack section
    expect(screen.getByText('Tech Stack (2025 Rebuild)')).toBeVisible()

    // Check use cases section
    expect(screen.getByText('Use Cases')).toBeVisible()

    // Check example implementation section
    expect(screen.getByText('Example Implementation')).toBeVisible()
  })

  it('should render external links', () => {
    render(<About />)

    const hangmanLink = screen.getByRole('link', { name: 'hangman game' })
    expect(hangmanLink).toHaveAttribute(
      'href',
      'https://github.com/LucasSilbernagel/hangman'
    )
    expect(hangmanLink).toHaveAttribute('target', '_blank')
    expect(hangmanLink).toHaveAttribute('rel', 'noopener noreferrer')

    const githubLink = screen.getByRole('link', { name: 'clone my repository' })
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/LucasSilbernagel/word-game-db-v2'
    )
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render internal navigation links', () => {
    render(<About />)

    const apiEndpointsLink = screen.getByRole('link', { name: 'API endpoints' })
    expect(apiEndpointsLink).toHaveAttribute('href', '/')

    const contactLink = screen.getByRole('link', { name: 'contact me' })
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('should render action buttons', () => {
    render(<About />)

    const viewApiButton = screen.getByRole('link', {
      name: 'View API Endpoints',
    })
    expect(viewApiButton).toHaveAttribute('href', '/')

    const contactButton = screen.getByRole('link', { name: 'Get in Touch' })
    expect(contactButton).toHaveAttribute('href', '/contact')
  })
})
