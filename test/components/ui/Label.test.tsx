import { Label } from '@/components/ui/Label'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '../../utils/test-utils'

describe('Label', () => {
  it('should render with default styling', () => {
    render(<Label>Test Label</Label>)

    const label = screen.getByText('Test Label')
    expect(label).toBeVisible()
    expect(label).toHaveClass(
      'peer-disabled:opacity-70',
      'font-medium',
      'text-sm',
      'leading-none',
      'peer-disabled:cursor-not-allowed'
    )
  })

  it('should accept custom className', () => {
    render(<Label className="custom-label">Custom Label</Label>)

    const label = screen.getByText('Custom Label')
    expect(label).toHaveClass('custom-label')
  })

  it('should forward ref correctly', () => {
    const ref = vi.fn()
    render(<Label ref={ref}>Label with ref</Label>)

    expect(ref).toHaveBeenCalled()
  })

  it('should support htmlFor attribute', () => {
    render(<Label htmlFor="test-input">Label for input</Label>)

    const label = screen.getByText('Label for input')
    expect(label).toHaveAttribute('for', 'test-input')
  })

  it('should support all label HTML attributes', () => {
    render(
      <Label
        htmlFor="test-input"
        id="test-label"
        className="test-class"
        data-testid="test-label"
        aria-label="Test label"
      >
        Full Label
      </Label>
    )

    const label = screen.getByTestId('test-label')
    expect(label).toHaveAttribute('for', 'test-input')
    expect(label).toHaveAttribute('id', 'test-label')
    expect(label).toHaveAttribute('aria-label', 'Test label')
    expect(label).toHaveClass('test-class')
  })

  it('should work with form controls', () => {
    render(
      <div>
        <Label htmlFor="email">Email Address</Label>
        <input id="email" type="email" />
      </div>
    )

    const label = screen.getByText('Email Address')
    const input = screen.getByRole('textbox', { name: 'Email Address' })

    expect(label).toHaveAttribute('for', 'email')
    expect(input).toHaveAttribute('id', 'email')
  })

  it('should have proper accessibility attributes', () => {
    render(<Label id="accessible-label">Accessible Label</Label>)

    const label = screen.getByText('Accessible Label')
    expect(label).toHaveAttribute('id', 'accessible-label')
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Label onClick={handleClick}>Clickable Label</Label>)

    const label = screen.getByText('Clickable Label')
    label.click()

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should support complex content', () => {
    render(
      <Label>
        <span>Required</span>
        <span className="text-red-500">*</span>
      </Label>
    )

    expect(screen.getByText('Required')).toBeVisible()
    expect(screen.getByText('*')).toBeVisible()
    expect(screen.getByText('*')).toHaveClass('text-red-500')
  })

  it('should maintain proper semantic structure', () => {
    render(
      <div>
        <Label htmlFor="username">Username</Label>
        <input id="username" type="text" />
      </div>
    )

    const label = screen.getByText('Username')
    const input = screen.getByRole('textbox', { name: 'Username' })

    // The label should be properly associated with the input
    expect(label).toHaveAttribute('for', 'username')
    expect(input).toHaveAttribute('id', 'username')
  })
})
