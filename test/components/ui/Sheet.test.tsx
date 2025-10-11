import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '../../utils/test-utils'

describe('Sheet Components', () => {
  describe('Sheet', () => {
    it('should render with default props', () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>Sheet description</SheetDescription>
            </SheetHeader>
            <div>Sheet content</div>
          </SheetContent>
        </Sheet>
      )

      expect(screen.getByText('Open Sheet')).toBeVisible()
    })

    it('should handle open state changes', async () => {
      const handleOpenChange = vi.fn()
      render(
        <Sheet onOpenChange={handleOpenChange}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
            <div>Sheet content</div>
          </SheetContent>
        </Sheet>
      )

      const trigger = screen.getByText('Open Sheet')
      fireEvent.click(trigger)

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(true)
      })
    })

    it('should support controlled open state', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
            <div>Sheet content</div>
          </SheetContent>
        </Sheet>
      )

      expect(screen.getByText('Sheet Title')).toBeVisible()
    })

    it('should support default open state', () => {
      render(
        <Sheet defaultOpen={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
            <div>Sheet content</div>
          </SheetContent>
        </Sheet>
      )

      expect(screen.getByText('Sheet Title')).toBeVisible()
    })
  })

  describe('SheetTrigger', () => {
    it('should render as a button by default', () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const trigger = screen.getByRole('button', { name: 'Open Sheet' })
      expect(trigger).toBeVisible()
    })

    it('should accept custom children', () => {
      render(
        <Sheet>
          <SheetTrigger>
            <span>Custom trigger</span>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      expect(screen.getByText('Custom trigger')).toBeVisible()
    })

    it('should have proper data attributes', () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('data-slot', 'sheet-trigger')
    })
  })

  describe('SheetContent', () => {
    it('should render with default styling and right side', async () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
            <div>Sheet content</div>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass(
        'bg-background',
        'data-[state=closed]:animate-out',
        'data-[state=open]:animate-in',
        'fixed',
        'z-50',
        'flex',
        'flex-col',
        'gap-4',
        'shadow-lg',
        'transition',
        'ease-in-out'
      )
    })

    it('should render on different sides', () => {
      const { rerender } = render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Left Sheet</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      let content = screen.getByRole('dialog')
      expect(content).toHaveClass(
        'inset-y-0',
        'left-0',
        'h-full',
        'w-3/4',
        'border-r'
      )

      rerender(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent side="top">
            <SheetHeader>
              <SheetTitle>Top Sheet</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      content = screen.getByRole('dialog')
      expect(content).toHaveClass('inset-x-0', 'top-0', 'h-auto', 'border-b')

      rerender(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Bottom Sheet</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      content = screen.getByRole('dialog')
      expect(content).toHaveClass('inset-x-0', 'bottom-0', 'h-auto', 'border-t')
    })

    it('should accept custom className', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent className="custom-sheet">
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveClass('custom-sheet')
    })

    it('should render close button', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const closeButton = screen.getByRole('button', { name: 'Close' })
      expect(closeButton).toBeVisible()
      expect(closeButton).toHaveClass(
        'data-[state=open]:bg-secondary',
        'focus:ring-ring',
        'ring-offset-background',
        'absolute',
        'top-4',
        'right-4',
        'rounded-xs',
        'opacity-70',
        'transition-opacity',
        'hover:opacity-100',
        'focus:ring-2',
        'focus:ring-offset-2',
        'focus:outline-hidden',
        'focus-visible:opacity-100',
        'disabled:pointer-events-none'
      )
    })

    it('should have proper data attributes', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const content = screen.getByRole('dialog')
      expect(content).toHaveAttribute('data-slot', 'sheet-content')
    })
  })

  describe('SheetHeader', () => {
    it('should render with default styling', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>Sheet description</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const header = screen.getByText('Sheet Title').parentElement
      expect(header).toHaveClass('flex', 'flex-col', 'gap-1.5', 'p-4')
      expect(header).toHaveAttribute('data-slot', 'sheet-header')
    })

    it('should accept custom className', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader className="custom-header">
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const header = screen.getByText('Sheet Title').parentElement
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('SheetTitle', () => {
    it('should render with default styling', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const title = screen.getByRole('heading', {
        level: 2,
        name: 'Sheet Title',
      })
      expect(title).toHaveClass('text-foreground', 'font-semibold')
      expect(title).toHaveAttribute('data-slot', 'sheet-title')
    })

    it('should accept custom className', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="custom-title">Sheet Title</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const title = screen.getByRole('heading', { level: 2 })
      expect(title).toHaveClass('custom-title')
    })
  })

  describe('SheetDescription', () => {
    it('should render with default styling', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription>Sheet description</SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const description = screen.getByText('Sheet description')
      expect(description).toHaveClass('text-muted-foreground', 'text-sm')
      expect(description).toHaveAttribute('data-slot', 'sheet-description')
    })

    it('should accept custom className', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
              <SheetDescription className="custom-description">
                Sheet description
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )

      const description = screen.getByText('Sheet description')
      expect(description).toHaveClass('custom-description')
    })
  })

  describe('SheetFooter', () => {
    it('should render with default styling', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
            <SheetFooter>
              <button>Action</button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

      const footer = screen.getByRole('button', {
        name: 'Action',
      }).parentElement
      expect(footer).toHaveClass('mt-auto', 'flex', 'flex-col', 'gap-2', 'p-4')
      expect(footer).toHaveAttribute('data-slot', 'sheet-footer')
    })

    it('should accept custom className', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
            <SheetFooter className="custom-footer">
              <button>Action</button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

      const footer = screen.getByRole('button', {
        name: 'Action',
      }).parentElement
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('SheetClose', () => {
    it('should render with proper data attributes', () => {
      render(
        <Sheet open={true}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
            <SheetClose>Close Sheet</SheetClose>
          </SheetContent>
        </Sheet>
      )

      const closeButton = screen.getByRole('button', { name: 'Close Sheet' })
      expect(closeButton).toHaveAttribute('data-slot', 'sheet-close')
    })
  })

  describe('Sheet Integration', () => {
    it('should render a complete sheet with all components', () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Complete Sheet</SheetTitle>
              <SheetDescription>
                This is a complete sheet example
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 p-4">
              <p>This is the main content of the sheet.</p>
            </div>
            <SheetFooter>
              <button>Save</button>
              <SheetClose>Cancel</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )

      expect(screen.getByText('Open Sheet')).toBeVisible()

      const trigger = screen.getByRole('button', { name: 'Open Sheet' })
      fireEvent.click(trigger)

      expect(
        screen.getByRole('heading', { level: 2, name: 'Complete Sheet' })
      ).toBeVisible()
      expect(screen.getByText('This is a complete sheet example')).toBeVisible()
      expect(
        screen.getByText('This is the main content of the sheet.')
      ).toBeVisible()
      expect(screen.getByRole('button', { name: 'Save' })).toBeVisible()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeVisible()
    })

    it('should handle close functionality', async () => {
      const handleOpenChange = vi.fn()
      render(
        <Sheet onOpenChange={handleOpenChange}>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Sheet Title</SheetTitle>
            </SheetHeader>
            <SheetClose data-testid="sheet-close-button">Close</SheetClose>
          </SheetContent>
        </Sheet>
      )

      // Open the sheet
      const trigger = screen.getByRole('button', { name: 'Open Sheet' })
      fireEvent.click(trigger)

      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeVisible()
      })

      // Close the sheet - target the SheetClose component specifically
      // There are two close buttons, so we need to be more specific
      const sheetCloseButton = screen.getByTestId('sheet-close-button')
      expect(sheetCloseButton).toBeInTheDocument()
      fireEvent.click(sheetCloseButton)

      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false)
      })
    })
  })
})
