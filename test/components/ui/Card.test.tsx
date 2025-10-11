import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render with default props', () => {
      render(<Card>Test content</Card>)

      const card = screen.getByText('Test content').closest('div')
      expect(card).toHaveClass(
        'rounded-lg',
        'border',
        'bg-card',
        'text-card-foreground',
        'shadow-sm'
      )
    })

    it('should render with custom className', () => {
      render(<Card className="custom-class">Test content</Card>)

      const card = screen.getByText('Test content').closest('div')
      expect(card).toHaveClass('custom-class')
    })

    it('should forward ref correctly', () => {
      const ref = createRef<HTMLDivElement>()
      render(<Card ref={ref}>Test content</Card>)

      expect(ref.current).toBeInTheDocument()
      expect(ref.current).toHaveClass(
        'rounded-lg',
        'border',
        'bg-card',
        'text-card-foreground',
        'shadow-sm'
      )
    })
  })

  describe('CardHeader', () => {
    it('should render with default props', () => {
      render(
        <Card>
          <CardHeader>Header content</CardHeader>
        </Card>
      )

      const header = screen.getByText('Header content').closest('div')
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })

    it('should render with custom className', () => {
      render(
        <Card>
          <CardHeader className="custom-header">Header content</CardHeader>
        </Card>
      )

      const header = screen.getByText('Header content').closest('div')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('CardTitle', () => {
    it('should render with default props', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>
      )

      const title = screen.getByText('Card Title')
      expect(title).toHaveClass(
        'text-2xl',
        'font-semibold',
        'leading-none',
        'tracking-tight'
      )
    })

    it('should render with custom className', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle className="custom-title">Card Title</CardTitle>
          </CardHeader>
        </Card>
      )

      const title = screen.getByText('Card Title')
      expect(title).toHaveClass('custom-title')
    })
  })

  describe('CardDescription', () => {
    it('should render with default props', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
        </Card>
      )

      const description = screen.getByText('Card description')
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })

    it('should render with custom className', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription className="custom-description">
              Card description
            </CardDescription>
          </CardHeader>
        </Card>
      )

      const description = screen.getByText('Card description')
      expect(description).toHaveClass('custom-description')
    })
  })

  describe('CardContent', () => {
    it('should render with default props', () => {
      render(
        <Card>
          <CardContent>Content text</CardContent>
        </Card>
      )

      const content = screen.getByText('Content text').closest('div')
      expect(content).toHaveClass('p-6', 'pt-0')
    })

    it('should render with custom className', () => {
      render(
        <Card>
          <CardContent className="custom-content">Content text</CardContent>
        </Card>
      )

      const content = screen.getByText('Content text').closest('div')
      expect(content).toHaveClass('custom-content')
    })
  })

  describe('CardFooter', () => {
    it('should render with default props', () => {
      render(
        <Card>
          <CardFooter>Footer content</CardFooter>
        </Card>
      )

      const footer = screen.getByText('Footer content').closest('div')
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })

    it('should render with custom className', () => {
      render(
        <Card>
          <CardFooter className="custom-footer">Footer content</CardFooter>
        </Card>
      )

      const footer = screen.getByText('Footer content').closest('div')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('Complete Card Structure', () => {
    it('should render a complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
            <CardDescription>This is a test card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
          </CardContent>
          <CardFooter>
            <button>Action Button</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Test Card')).toBeInTheDocument()
      expect(
        screen.getByText('This is a test card description')
      ).toBeInTheDocument()
      expect(
        screen.getByText('This is the main content of the card.')
      ).toBeInTheDocument()
      expect(screen.getByText('Action Button')).toBeInTheDocument()
    })

    it('should have proper accessibility structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>
              This card has proper heading structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content with proper semantic structure.</p>
          </CardContent>
        </Card>
      )

      const title = screen.getByRole('heading', { name: 'Accessible Card' })
      expect(title).toBeInTheDocument()
      expect(title.tagName).toBe('H3') // CardTitle renders as h3 by default
    })
  })
})
