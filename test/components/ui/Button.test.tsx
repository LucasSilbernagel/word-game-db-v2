import { Button } from '@/components/ui/Button'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('Button', () => {
  it('should render with default variant and size', () => {
    render(<Button>Click me</Button>)

    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeVisible()
    expect(button).toHaveClass(
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary/90'
    )
    expect(button).toHaveClass('h-10', 'px-4', 'py-2')
  })

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass(
      'bg-destructive',
      'text-destructive-foreground'
    )

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass(
      'border',
      'border-input',
      'bg-background'
    )

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass(
      'bg-secondary',
      'text-secondary-foreground'
    )

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass(
      'hover:bg-accent',
      'hover:text-accent-foreground'
    )

    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toHaveClass(
      'text-primary',
      'underline-offset-4',
      'hover:underline'
    )
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-9', 'rounded-md', 'px-3')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-11', 'rounded-md', 'px-8')

    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10', 'w-10')
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass(
      'disabled:opacity-50',
      'disabled:pointer-events-none'
    )
  })

  it('should render as child when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )

    const link = screen.getByRole('link', { name: 'Link Button' })
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('should forward ref correctly', () => {
    const ref = vi.fn()
    render(<Button ref={ref}>Button with ref</Button>)

    expect(ref).toHaveBeenCalled()
  })

  it('should accept custom className', () => {
    render(<Button className="custom-class">Custom</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('custom-class')
  })

  it('should have proper accessibility attributes', () => {
    render(<Button aria-label="Custom label">Button</Button>)

    const button = screen.getByRole('button', { name: 'Custom label' })
    expect(button).toHaveAttribute('aria-label', 'Custom label')
  })

  it('should support all button HTML attributes', () => {
    render(
      <Button
        type="submit"
        form="test-form"
        name="test-button"
        value="test-value"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      >
        Submit Button
      </Button>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveAttribute('form', 'test-form')
    expect(button).toHaveAttribute('name', 'test-button')
    expect(button).toHaveAttribute('value', 'test-value')
    // Note: autofocus attribute is not automatically set in test environment
  })

  it('should have proper focus styles', () => {
    render(<Button>Focus me</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'focus-visible:outline-none',
      'focus-visible:ring-2',
      'focus-visible:ring-ring'
    )
  })

  it('should handle keyboard events', () => {
    const handleKeyDown = vi.fn()
    render(<Button onKeyDown={handleKeyDown}>Keyboard</Button>)

    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: 'Enter' })

    expect(handleKeyDown).toHaveBeenCalledTimes(1)
  })

  it('should render with all base classes', () => {
    render(<Button>Base Button</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'inline-flex',
      'justify-center',
      'items-center',
      'rounded-md',
      'focus-visible:outline-none',
      'font-medium',
      'text-sm',
      'whitespace-nowrap',
      'transition-colors'
    )
  })
})
