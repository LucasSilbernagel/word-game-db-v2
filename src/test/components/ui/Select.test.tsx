import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '../../utils/test-utils'

describe('Select Components', () => {
  describe('Select', () => {
    it('should render with default props', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByRole('combobox')).toBeVisible()
      expect(screen.getByText('Select an option')).toBeVisible()
    })

    it('should handle value changes', async () => {
      const handleValueChange = vi.fn()
      render(
        <Select onValueChange={handleValueChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeVisible()
      })

      fireEvent.click(screen.getByText('Option 1'))

      expect(handleValueChange).toHaveBeenCalledWith('option1')
    })

    it('should support controlled value', () => {
      render(
        <Select value="option2">
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByText('Option 2')).toBeVisible()
    })

    it('should support disabled state', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      expect(trigger).toBeDisabled()
    })
  })

  describe('SelectTrigger', () => {
    it('should render with default styling', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveClass(
        'bg-background',
        'border-input',
        'focus:ring-ring',
        'ring-offset-background',
        'placeholder:text-muted-foreground',
        'flex',
        'h-10',
        'w-full',
        'items-center',
        'justify-between',
        'rounded-md',
        'border',
        'px-3',
        'py-2',
        'text-sm'
      )
    })

    it('should accept custom className', () => {
      render(
        <Select>
          <SelectTrigger className="custom-trigger">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('should forward ref correctly', () => {
      const ref = vi.fn()
      render(
        <Select>
          <SelectTrigger ref={ref}>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      )

      expect(ref).toHaveBeenCalled()
    })

    it('should show chevron icon', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      )

      const chevron = screen.getByRole('combobox').querySelector('svg')
      expect(chevron).toBeInTheDocument()
    })
  })

  describe('SelectValue', () => {
    it('should render placeholder when no value is selected', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
        </Select>
      )

      expect(screen.getByText('Choose an option')).toBeVisible()
    })

    it('should render selected value', () => {
      render(
        <Select value="option1">
          <SelectTrigger>
            <SelectValue placeholder="Choose an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )

      expect(screen.getByText('Option 1')).toBeVisible()
    })
  })

  describe('SelectContent', () => {
    it('should render with default styling', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      // The content should be rendered in a portal
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    it('should accept custom className', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent className="custom-content">
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      const content = screen.getByRole('listbox')
      expect(content).toHaveClass('custom-content')
    })

    it('should support different positions', () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      // Content should be rendered
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })
  })

  describe('SelectItem', () => {
    it('should render with default styling', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      await waitFor(() => {
        const item = screen.getByRole('option', { name: 'Option 1' })
        expect(item).toHaveClass(
          'focus:bg-accent',
          'focus:text-accent-foreground',
          'relative',
          'flex',
          'w-full',
          'cursor-default',
          'items-center',
          'rounded-sm',
          'py-1.5',
          'pr-2',
          'pl-8',
          'text-sm',
          'outline-none',
          'select-none'
        )
      })
    })

    it('should accept custom className', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1" className="custom-item">
              Option 1
            </SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      await waitFor(() => {
        const item = screen.getByRole('option', { name: 'Option 1' })
        expect(item).toHaveClass('custom-item')
      })
    })

    it('should forward ref correctly', async () => {
      const ref = vi.fn()
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem ref={ref} value="option1">
              Option 1
            </SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      await waitFor(() => {
        expect(ref).toHaveBeenCalled()
      })
    })

    it('should be disabled when disabled prop is true', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1" disabled>
              Option 1
            </SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      await waitFor(() => {
        const item = screen.getByRole('option', { name: 'Option 1' })
        expect(item).toHaveAttribute('data-disabled', '')
        expect(item).toHaveClass(
          'data-[disabled]:pointer-events-none',
          'data-[disabled]:opacity-50'
        )
      })
    })

    it('should show check indicator when selected', async () => {
      render(
        <Select value="option1">
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      await waitFor(() => {
        const item = screen.getByRole('option', { name: 'Option 1' })
        const checkIcon = item.querySelector('svg')
        expect(checkIcon).toBeInTheDocument()
      })
    })
  })

  describe('SelectGroup', () => {
    it('should render with grouped items', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group 1</SelectLabel>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Group 2</SelectLabel>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Group 1')).toBeVisible()
        expect(screen.getByText('Group 2')).toBeVisible()
        expect(screen.getByRole('option', { name: 'Option 1' })).toBeVisible()
        expect(screen.getByRole('option', { name: 'Option 2' })).toBeVisible()
        expect(screen.getByRole('option', { name: 'Option 3' })).toBeVisible()
      })
    })
  })

  describe('SelectLabel', () => {
    it('should render with default styling', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Group Label</SelectLabel>
              <SelectItem value="option1">Option 1</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      await waitFor(() => {
        const label = screen.getByText('Group Label')
        expect(label).toHaveClass(
          'py-1.5',
          'pr-2',
          'pl-8',
          'text-sm',
          'font-semibold'
        )
      })
    })
  })

  describe('SelectSeparator', () => {
    it('should render with default styling', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectSeparator />
            <SelectItem value="option2">Option 2</SelectItem>
          </SelectContent>
        </Select>
      )

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      await waitFor(() => {
        // The separator has aria-hidden="true" so we need to find it by class instead
        const separator = screen
          .getByRole('listbox')
          .querySelector('[aria-hidden="true"][class*="bg-muted"]')
        expect(separator).toBeInTheDocument()
        expect(separator).toHaveClass('bg-muted', '-mx-1', 'my-1', 'h-px')
      })
    })
  })

  describe('Select Integration', () => {
    it('should render a complete select with all components', async () => {
      render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetables</SelectLabel>
              <SelectItem value="carrot">Carrot</SelectItem>
              <SelectItem value="broccoli">Broccoli</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      )

      expect(screen.getByText('Choose a fruit')).toBeVisible()

      const trigger = screen.getByRole('combobox')
      fireEvent.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Fruits')).toBeVisible()
        expect(screen.getByText('Vegetables')).toBeVisible()
        expect(screen.getByRole('option', { name: 'Apple' })).toBeVisible()
        expect(screen.getByRole('option', { name: 'Banana' })).toBeVisible()
        expect(screen.getByRole('option', { name: 'Orange' })).toBeVisible()
        expect(screen.getByRole('option', { name: 'Carrot' })).toBeVisible()
        expect(screen.getByRole('option', { name: 'Broccoli' })).toBeVisible()
      })
    })
  })
})
