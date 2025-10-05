import AboutPage from '@/components/AboutPage/AboutPage'
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

describe('AboutPage', () => {
  it('should render the main heading and description', () => {
    render(<AboutPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'About' })
    ).toBeVisible()
    expect(
      screen.getByText('Learn more about the Word Game DB project')
    ).toBeVisible()
  })

  it('should render the project description section', () => {
    render(<AboutPage />)

    const wordGameDbTexts = screen.getAllByText('Word Game DB')
    expect(wordGameDbTexts[0]).toBeVisible()
    expect(
      screen.getByText(/is a REST API originally built with the MERN stack/)
    ).toBeVisible()
    expect(screen.getByText(/I was inspired to create/)).toBeVisible()
  })

  it('should render external links with correct attributes', () => {
    render(<AboutPage />)

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

    const cursorLink = screen.getByRole('link', { name: 'Cursor' })
    expect(cursorLink).toHaveAttribute('href', 'https://cursor.sh')
    expect(cursorLink).toHaveAttribute('target', '_blank')
    expect(cursorLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render internal navigation links', () => {
    render(<AboutPage />)

    const apiEndpointsLink = screen.getByRole('link', { name: 'API endpoints' })
    expect(apiEndpointsLink).toHaveAttribute('href', '/')

    const contactLink = screen.getByRole('link', { name: 'contact me' })
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('should render the tech stack section', () => {
    render(<AboutPage />)

    expect(screen.getByText('Tech Stack (2025 Rebuild)')).toBeVisible()
    expect(
      screen.getByText(
        'Modern full-stack technologies with AI-powered development'
      )
    ).toBeVisible()

    expect(screen.getByText('Frontend')).toBeVisible()
    expect(
      screen.getByText('Next.js 15, React 19, TypeScript, Tailwind CSS')
    ).toBeVisible()

    expect(screen.getByText('Backend')).toBeVisible()
    expect(
      screen.getByText('Next.js API Routes, MongoDB, Mongoose')
    ).toBeVisible()

    expect(screen.getByText('UI Components')).toBeVisible()
    expect(screen.getByText('Radix UI, Lucide Icons')).toBeVisible()

    expect(screen.getByText('Development')).toBeVisible()
    expect(screen.getByText('Cursor AI, ESLint, Prettier')).toBeVisible()
  })

  it('should render the use cases section', () => {
    render(<AboutPage />)

    expect(screen.getByText('Use Cases')).toBeVisible()
    expect(
      screen.getByText('Perfect for various educational projects')
    ).toBeVisible()

    expect(screen.getByText('Word Games')).toBeVisible()
    expect(
      screen.getByText('Hangman, Wordle, crossword puzzles, and more')
    ).toBeVisible()

    expect(screen.getByText('Educational Apps')).toBeVisible()
    expect(
      screen.getByText('Vocabulary builders, spelling games, language learning')
    ).toBeVisible()

    expect(screen.getByText('Creative Projects')).toBeVisible()
    expect(
      screen.getByText('Poetry generators, word art, creative writing tools')
    ).toBeVisible()

    expect(screen.getByText('Learning APIs')).toBeVisible()
    expect(
      screen.getByText('Practice building applications that consume REST APIs')
    ).toBeVisible()
  })

  it('should render the example implementation section', () => {
    render(<AboutPage />)

    expect(screen.getByText('Example Implementation')).toBeVisible()
    expect(screen.getByText('See the API in action')).toBeVisible()

    expect(screen.getByText('Hangman Game')).toBeVisible()
    expect(
      screen.getByText('The original inspiration for this API')
    ).toBeVisible()

    expect(screen.getByText('Build Your Own')).toBeVisible()
    expect(
      screen.getByText('Clone the repository and start building')
    ).toBeVisible()
  })

  it('should render hangman game links', () => {
    render(<AboutPage />)

    const liveDemoLink = screen.getByRole('link', { name: 'Live Demo' })
    expect(liveDemoLink).toHaveAttribute(
      'href',
      'https://lucassilbernagel.github.io/hangman/'
    )
    expect(liveDemoLink).toHaveAttribute('target', '_blank')
    expect(liveDemoLink).toHaveAttribute('rel', 'noopener noreferrer')

    const sourceCodeLink = screen.getByRole('link', { name: 'Source Code' })
    expect(sourceCodeLink).toHaveAttribute(
      'href',
      'https://github.com/LucasSilbernagel/hangman'
    )
    expect(sourceCodeLink).toHaveAttribute('target', '_blank')
    expect(sourceCodeLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('should render the get started section with action buttons', () => {
    render(<AboutPage />)

    expect(screen.getByText('Ready to get started?')).toBeVisible()
    expect(
      screen.getByText(
        'Explore the API endpoints and start building your next word game or educational application.'
      )
    ).toBeVisible()

    const viewApiButton = screen.getByRole('link', {
      name: 'View API Endpoints',
    })
    expect(viewApiButton).toHaveAttribute('href', '/')

    const contactButton = screen.getByRole('link', { name: 'Get in Touch' })
    expect(contactButton).toHaveAttribute('href', '/contact')
  })

  it('should have proper accessibility attributes', () => {
    render(<AboutPage />)

    // Check for proper heading hierarchy
    expect(screen.getByRole('heading', { level: 1 })).toBeVisible()
    const h2Headings = screen.getAllByRole('heading', { level: 2 })
    expect(h2Headings).toHaveLength(3) // Three h2 headings (all sr-only)
    const h3Headings = screen.getAllByRole('heading', { level: 3 })
    expect(h3Headings.length).toBeGreaterThan(0)

    // Check for screen reader only content
    expect(screen.getByText('Project Description')).toBeInTheDocument()
    expect(screen.getByText('Project Details')).toBeInTheDocument()
    expect(screen.getByText('Get Started')).toBeInTheDocument()

    // Check for proper navigation landmarks
    expect(
      screen.getByRole('navigation', { name: 'Hangman game links' })
    ).toBeVisible()
    expect(
      screen.getByRole('navigation', { name: 'Action navigation' })
    ).toBeVisible()
  })

  it('should render the Next.js rebuild information', () => {
    render(<AboutPage />)

    expect(screen.getByText('Next.js Rebuild:')).toBeVisible()
    expect(
      screen.getByText(
        /This version has been completely rebuilt using modern web technologies/
      )
    ).toBeVisible()
    expect(
      screen.getByText(/The entire development process was accelerated using/)
    ).toBeVisible()
  })
})
