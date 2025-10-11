import { Textarea } from '@/components/ui/Textarea'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '../../utils/test-utils'

describe('Textarea', () => {
  it('should render with default styling', () => {
    render(<Textarea placeholder="Enter text" />)

    const textarea = screen.getByPlaceholderText('Enter text')
    expect(textarea).toBeVisible()
    expect(textarea).toHaveClass(
      'bg-background',
      'border-input',
      'focus-visible:ring-ring',
      'ring-offset-background',
      'placeholder:text-muted-foreground',
      'flex',
      'min-h-[80px]',
      'w-full',
      'rounded-md',
      'border',
      'px-3',
      'py-2',
      'text-sm',
      'focus-visible:ring-2',
      'focus-visible:ring-offset-2',
      'focus-visible:outline-none'
    )
  })

  it('should handle value changes', () => {
    const handleChange = vi.fn()
    render(<Textarea onChange={handleChange} placeholder="Type here" />)

    const textarea = screen.getByPlaceholderText('Type here')
    fireEvent.change(textarea, {
      target: { value: 'Hello World\nThis is a test' },
    })

    expect(handleChange).toHaveBeenCalledTimes(1)
    expect(textarea).toHaveValue('Hello World\nThis is a test')
  })

  it('should handle focus and blur events', () => {
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    render(
      <Textarea
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Focus test"
      />
    )

    const textarea = screen.getByPlaceholderText('Focus test')

    fireEvent.focus(textarea)
    expect(handleFocus).toHaveBeenCalledTimes(1)

    fireEvent.blur(textarea)
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />)

    const textarea = screen.getByPlaceholderText('Disabled textarea')
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveClass(
      'disabled:cursor-not-allowed',
      'disabled:opacity-50'
    )
  })

  it('should be required when required prop is true', () => {
    render(<Textarea required placeholder="Required textarea" />)

    const textarea = screen.getByPlaceholderText('Required textarea')
    expect(textarea).toHaveAttribute('required')
  })

  it('should accept custom className', () => {
    render(
      <Textarea className="custom-textarea" placeholder="Custom textarea" />
    )

    const textarea = screen.getByPlaceholderText('Custom textarea')
    expect(textarea).toHaveClass('custom-textarea')
  })

  it('should forward ref correctly', () => {
    const ref = vi.fn()
    render(<Textarea ref={ref} placeholder="Textarea with ref" />)

    expect(ref).toHaveBeenCalled()
  })

  it('should support all textarea HTML attributes', () => {
    render(
      <Textarea
        name="test-textarea"
        id="test-textarea"
        value="test value"
        rows={5}
        cols={30}
        minLength={10}
        maxLength={100}
        placeholder="Enter your message"
        readOnly
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        aria-label="Test textarea"
        data-testid="test-textarea"
      />
    )

    const textarea = screen.getByTestId('test-textarea')
    expect(textarea).toHaveAttribute('name', 'test-textarea')
    expect(textarea).toHaveAttribute('id', 'test-textarea')
    expect(textarea).toHaveValue('test value') // Use toHaveValue instead of toHaveAttribute for textarea content
    expect(textarea).toHaveAttribute('rows', '5')
    expect(textarea).toHaveAttribute('cols', '30')
    expect(textarea).toHaveAttribute('minLength', '10')
    expect(textarea).toHaveAttribute('maxLength', '100')
    expect(textarea).toHaveAttribute('placeholder', 'Enter your message')
    expect(textarea).toHaveAttribute('readonly')
    // Note: autofocus attribute is not automatically set in test environment
    expect(textarea).toHaveAttribute('aria-label', 'Test textarea')
  })

  it('should handle keyboard events', () => {
    const handleKeyDown = vi.fn()
    const handleKeyUp = vi.fn()
    render(
      <Textarea
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        placeholder="Keyboard test"
      />
    )

    const textarea = screen.getByPlaceholderText('Keyboard test')

    fireEvent.keyDown(textarea, { key: 'Enter' })
    expect(handleKeyDown).toHaveBeenCalledTimes(1)

    fireEvent.keyUp(textarea, { key: 'Enter' })
    expect(handleKeyUp).toHaveBeenCalledTimes(1)
  })

  it('should have proper focus styles', () => {
    render(<Textarea placeholder="Focus styles" />)

    const textarea = screen.getByPlaceholderText('Focus styles')
    expect(textarea).toHaveClass(
      'focus-visible:ring-2',
      'focus-visible:ring-offset-2',
      'focus-visible:outline-none'
    )
  })

  it('should render with placeholder text', () => {
    render(<Textarea placeholder="Enter your message here" />)

    const textarea = screen.getByPlaceholderText('Enter your message here')
    expect(textarea).toHaveAttribute('placeholder', 'Enter your message here')
    expect(textarea).toHaveClass('placeholder:text-muted-foreground')
  })

  it('should support controlled and uncontrolled modes', () => {
    // Controlled
    render(<Textarea value="controlled" onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('controlled')).toHaveValue('controlled')

    // Uncontrolled - create a new component instance
    const { unmount } = render(<Textarea defaultValue="uncontrolled" />)
    expect(screen.getByDisplayValue('uncontrolled')).toHaveValue('uncontrolled')
    unmount()
  })

  it('should handle resize behavior', () => {
    render(<Textarea placeholder="Resizable textarea" />)

    const textarea = screen.getByPlaceholderText('Resizable textarea')
    // The component doesn't have resize-none by default, so we test that it's resizable
    expect(textarea).not.toHaveClass('resize-none')

    // Test with resize-none class
    render(
      <Textarea placeholder="Non-resizable textarea" className="resize-none" />
    )
    const nonResizableTextarea = screen.getByPlaceholderText(
      'Non-resizable textarea'
    )
    expect(nonResizableTextarea).toHaveClass('resize-none')
  })

  it('should support different textarea sizes', () => {
    const { rerender } = render(
      <Textarea rows={3} placeholder="Small textarea" />
    )
    expect(screen.getByPlaceholderText('Small textarea')).toHaveAttribute(
      'rows',
      '3'
    )

    rerender(<Textarea rows={10} placeholder="Large textarea" />)
    expect(screen.getByPlaceholderText('Large textarea')).toHaveAttribute(
      'rows',
      '10'
    )
  })

  it('should handle form submission', () => {
    const handleSubmit = vi.fn()
    render(
      <form onSubmit={handleSubmit}>
        <Textarea name="message" placeholder="Enter message" />
        <button type="submit">Submit</button>
      </form>
    )

    const textarea = screen.getByPlaceholderText('Enter message')

    fireEvent.change(textarea, { target: { value: 'Test message' } })

    // Use fireEvent.submit on the form instead of clicking the button
    // to avoid the requestSubmit() method warning
    const form = textarea.closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })

  it('should support auto-resize behavior', () => {
    render(<Textarea placeholder="Auto-resize textarea" />)

    const textarea = screen.getByPlaceholderText('Auto-resize textarea')
    expect(textarea).toHaveClass('min-h-[80px]')
  })

  it('should handle selection events', () => {
    const handleSelect = vi.fn()
    render(<Textarea onSelect={handleSelect} placeholder="Select test" />)

    const textarea = screen.getByPlaceholderText('Select test')
    fireEvent.select(textarea)

    expect(handleSelect).toHaveBeenCalledTimes(1)
  })

  it('should support spell check', () => {
    render(<Textarea spellCheck placeholder="Spell check test" />)

    const textarea = screen.getByPlaceholderText('Spell check test')
    expect(textarea).toHaveAttribute('spellcheck', 'true')
  })

  it('should handle input events', () => {
    const handleInput = vi.fn()
    render(<Textarea onInput={handleInput} placeholder="Input test" />)

    const textarea = screen.getByPlaceholderText('Input test')
    fireEvent.input(textarea, { target: { value: 'Input text' } })

    expect(handleInput).toHaveBeenCalledTimes(1)
  })
})
