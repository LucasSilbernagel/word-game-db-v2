import { Input } from '@/components/ui/Input'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '../../utils/test-utils'

describe('Input', () => {
  it('should render with default styling', () => {
    render(<Input placeholder="Enter text" />)

    const input = screen.getByPlaceholderText('Enter text')
    expect(input).toBeVisible()
    expect(input).toHaveClass(
      'bg-background',
      'border-input',
      'focus-visible:ring-ring',
      'ring-offset-background',
      'placeholder:text-muted-foreground',
      'flex',
      'h-10',
      'w-full',
      'rounded-md',
      'border',
      'px-3',
      'py-2',
      'text-sm'
    )
  })

  it('should render with different input types', () => {
    const { rerender } = render(<Input type="text" placeholder="Text input" />)
    expect(screen.getByPlaceholderText('Text input')).toHaveAttribute(
      'type',
      'text'
    )

    rerender(<Input type="email" placeholder="Email input" />)
    expect(screen.getByPlaceholderText('Email input')).toHaveAttribute(
      'type',
      'email'
    )

    rerender(<Input type="password" placeholder="Password input" />)
    expect(screen.getByPlaceholderText('Password input')).toHaveAttribute(
      'type',
      'password'
    )

    rerender(<Input type="number" placeholder="Number input" />)
    expect(screen.getByPlaceholderText('Number input')).toHaveAttribute(
      'type',
      'number'
    )
  })

  it('should handle value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="Type here" />)

    const input = screen.getByPlaceholderText('Type here')
    fireEvent.change(input, { target: { value: 'Hello World' } })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('Hello World')
  })

  it('should handle focus and blur events', () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    render(
      <Input
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Focus test"
      />
    )

    const input = screen.getByPlaceholderText('Focus test')

    fireEvent.focus(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)

    fireEvent.blur(input)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />)

    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass(
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    )
  })

  it('should be required when required prop is true', () => {
    render(<Input required placeholder="Required input" />)

    const input = screen.getByPlaceholderText('Required input')
    expect(input).toHaveAttribute('required')
  })

  it('should accept custom className', () => {
    render(<Input className="custom-input" placeholder="Custom input" />)

    const input = screen.getByPlaceholderText('Custom input')
    expect(input).toHaveClass('custom-input')
  })

  it('should forward ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} placeholder="Input with ref" />)

    expect(ref).toHaveBeenCalled()
  })

  it('should support all input HTML attributes', () => {
    render(
      <Input
        name="test-input"
        id="test-input"
        value="test value"
        minLength={5}
        maxLength={20}
        min={0}
        max={100}
        step={1}
        pattern="[a-zA-Z]+"
        autoComplete="name"
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        readOnly
        aria-label="Test input"
        data-testid="test-input"
      />
    )

    const input = screen.getByTestId('test-input')
    expect(input).toHaveAttribute('name', 'test-input')
    expect(input).toHaveAttribute('id', 'test-input')
    expect(input).toHaveAttribute('value', 'test value')
    expect(input).toHaveAttribute('minLength', '5')
    expect(input).toHaveAttribute('maxLength', '20')
    expect(input).toHaveAttribute('min', '0')
    expect(input).toHaveAttribute('max', '100')
    expect(input).toHaveAttribute('step', '1')
    expect(input).toHaveAttribute('pattern', '[a-zA-Z]+')
    expect(input).toHaveAttribute('autocomplete', 'name')
    // Note: autofocus attribute is not automatically set in test environment
    expect(input).toHaveAttribute('readonly')
    expect(input).toHaveAttribute('aria-label', 'Test input')
  })

  it('should handle keyboard events', () => {
    const handleKeyDown = vi.fn()
    const handleKeyUp = vi.fn()
    render(
      <Input
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="Keyboard test"
      />
    )

    const input = screen.getByPlaceholderText('Keyboard test')

    fireEvent.keyDown(input, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)

    fireEvent.keyUp(input, { key: 'Enter' })
    expect(handleKeyUp).toHaveBeenCalledTimes(1)
  })

  it('should have proper focus styles', () => {
    render(<Input placeholder="Focus styles" />)

    const input = screen.getByPlaceholderText('Focus styles')
    expect(input).toHaveClass(
      'focus-visible:ring-2',
      'focus-visible:ring-offset-2',
      'focus-visible:outline-none'
    )
  })

  it('should handle file input type', () => {
    render(<Input type="file" />)

    const input = screen.getByDisplayValue('') // File inputs don't have a specific role
    expect(input).toHaveAttribute('type', 'file')
    expect(input).toHaveClass(
      'file:border-0',
      'file:bg-transparent',
      'file:text-sm',
      'file:font-medium'
    )
  })

  it('should render with placeholder text', () => {
    render(<Input placeholder="Enter your name" />)

    const input = screen.getByPlaceholderText('Enter your name')
    expect(input).toHaveAttribute('placeholder', 'Enter your name')
    expect(input).toHaveClass('placeholder:text-muted-foreground')
  })

  it('should support controlled and uncontrolled modes', () => {
    // Controlled
    render(<Input value="controlled" onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('controlled')).toHaveValue('controlled')

    // Uncontrolled - create a new component instance
    const { unmount } = render(<Input defaultValue="uncontrolled" />)
    expect(screen.getByDisplayValue('uncontrolled')).toHaveValue('uncontrolled')
    unmount()
  })
})
