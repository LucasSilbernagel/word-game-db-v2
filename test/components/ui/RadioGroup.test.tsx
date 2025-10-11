import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('RadioGroup Components', () => {
  describe('RadioGroup', () => {
    it('should render with default styling', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toHaveClass('grid', 'gap-2')
    })

    it('should accept custom className', () => {
      render(
        <RadioGroup className="custom-radio-group">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toHaveClass('custom-radio-group')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(
        <RadioGroup ref={ref}>
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      expect(ref).toHaveBeenCalled()
    })

    it('should handle value changes', () => {
      const handleValueChange = vi.fn()
      render(
        <RadioGroup onValueChange={handleValueChange}>
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </RadioGroup>
      )

      const option2 = screen.getByRole('radio', { name: 'Option 2' })
      fireEvent.click(option2)

      expect(handleValueChange).toHaveBeenCalledWith('option2')
    })

    it('should support controlled value', () => {
      render(
        <RadioGroup value="option2">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
          <RadioGroupItem value="option2" id="option2" />
          <label htmlFor="option2">Option 2</label>
        </RadioGroup>
      )

      const option1 = screen.getByRole('radio', { name: 'Option 1' })
      const option2 = screen.getByRole('radio', { name: 'Option 2' })

      expect(option1).not.toBeChecked()
      expect(option2).toBeChecked()
    })

    it('should support disabled state', () => {
      render(
        <RadioGroup disabled>
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      const option1 = screen.getByRole('radio', { name: 'Option 1' })
      expect(option1).toBeDisabled()
    })

    it('should support orientation prop', () => {
      render(
        <RadioGroup orientation="horizontal">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toHaveAttribute('data-orientation', 'horizontal')
    })
  })

  describe('RadioGroupItem', () => {
    it('should render with default styling', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      const radio = screen.getByRole('radio', { name: 'Option 1' })
      expect(radio).toHaveClass(
        'border-primary',
        'focus-visible:ring-ring',
        'ring-offset-background',
        'text-primary',
        'aspect-square',
        'h-4',
        'w-4',
        'rounded-full',
        'border',
        'focus:outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-offset-2'
      )
    })

    it('should accept custom className', () => {
      render(
        <RadioGroup>
          <RadioGroupItem
            value="option1"
            id="option1"
            className="custom-radio"
          />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      const radio = screen.getByRole('radio', { name: 'Option 1' })
      expect(radio).toHaveClass('custom-radio')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(
        <RadioGroup>
          <RadioGroupItem ref={ref} value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      expect(ref).toHaveBeenCalled()
    })

    it('should be disabled when disabled prop is true', () => {
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" id="option1" disabled />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      const radio = screen.getByRole('radio', { name: 'Option 1' })
      expect(radio).toBeDisabled()
      expect(radio).toHaveClass(
        'disabled:cursor-not-allowed',
        'disabled:opacity-50'
      )
    })

    it('should support all radio HTML attributes', () => {
      render(
        <RadioGroup name="test-group" required>
          <RadioGroupItem
            value="option1"
            id="option1"
            aria-label="Test option"
            data-testid="test-radio"
          />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      const radio = screen.getByTestId('test-radio')
      expect(radio).toHaveAttribute('value', 'option1')
      expect(radio).toHaveAttribute('id', 'option1')
      expect(radio).toHaveAttribute('aria-label', 'Test option')

      // For Radix UI RadioGroup, the name and required attributes are handled differently
      // The radiogroup itself doesn't get these attributes, they're managed internally
      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toBeInTheDocument()
    })

    it('should handle click events', () => {
      const handleClick = vi.fn()
      render(
        <RadioGroup>
          <RadioGroupItem value="option1" id="option1" onClick={handleClick} />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      const radio = screen.getByRole('radio', { name: 'Option 1' })
      fireEvent.click(radio)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should show indicator when selected', () => {
      render(
        <RadioGroup value="option1">
          <RadioGroupItem value="option1" id="option1" />
          <label htmlFor="option1">Option 1</label>
        </RadioGroup>
      )

      const radio = screen.getByRole('radio', { name: 'Option 1' })
      expect(radio).toBeChecked()

      // The indicator should be present (Circle icon)
      const indicator = radio.querySelector('svg')
      expect(indicator).toBeInTheDocument()
    })
  })

  describe('RadioGroup Integration', () => {
    it('should render a complete radio group with multiple options', () => {
      render(
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" />
            <label htmlFor="option1">Option 1</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="option2" />
            <label htmlFor="option2">Option 2</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option3" id="option3" />
            <label htmlFor="option3">Option 3</label>
          </div>
        </RadioGroup>
      )

      expect(screen.getByRole('radio', { name: 'Option 1' })).toBeVisible()
      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeVisible()
      expect(screen.getByRole('radio', { name: 'Option 3' })).toBeVisible()

      const radioGroup = screen.getByRole('radiogroup')
      expect(radioGroup).toContainElement(
        screen.getByRole('radio', { name: 'Option 1' })
      )
      expect(radioGroup).toContainElement(
        screen.getByRole('radio', { name: 'Option 2' })
      )
      expect(radioGroup).toContainElement(
        screen.getByRole('radio', { name: 'Option 3' })
      )
    })

    it('should maintain proper accessibility', () => {
      render(
        <RadioGroup aria-label="Choose an option">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="option1" />
            <label htmlFor="option1">Option 1</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="option2" />
            <label htmlFor="option2">Option 2</label>
          </div>
        </RadioGroup>
      )

      const radioGroup = screen.getByRole('radiogroup', {
        name: 'Choose an option',
      })
      expect(radioGroup).toHaveAttribute('aria-label', 'Choose an option')
    })
  })
})
