/* eslint-disable @next/next/no-html-link-for-pages */
import { MobileMenuContent } from '@/components/Navigation/MobileMenu/MobileMenuContent/MobileMenuContent'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '../utils/test-utils'

// Mock browser APIs that Radix UI needs
Object.defineProperty(globalThis, 'setTimeout', {
  value: vi.fn((callback) => callback()),
  writable: true,
})

Object.defineProperty(globalThis, 'clearTimeout', {
  value: vi.fn(),
  writable: true,
})

// Wrapper component to provide Dialog context
const DialogWrapper = ({ children }: { children: React.ReactNode }) => (
  <SheetPrimitive.Root open>
    <SheetPrimitive.Trigger asChild>
      <button>Open</button>
    </SheetPrimitive.Trigger>
    {children}
  </SheetPrimitive.Root>
)

describe('MobileMenuContent', () => {
  it('should render with children content', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    expect(screen.getByText('Test content')).toBeVisible()
  })

  it('should render close button', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    const closeButton = screen.getByRole('button', {
      name: 'Close mobile menu',
    })
    expect(closeButton).toBeVisible()
    expect(closeButton).toHaveClass(
      'absolute',
      'top-3',
      'right-4',
      'z-10',
      'transition-all',
      'duration-200'
    )
  })

  it('should render overlay', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    const overlay = screen
      .getByRole('dialog')
      .parentElement?.querySelector('.mobile-menu-overlay')
    expect(overlay).toBeInTheDocument()
    expect(overlay).toHaveClass(
      'mobile-menu-overlay',
      'fixed',
      'inset-0',
      'z-50',
      'bg-black/50'
    )
  })

  it('should render content with proper styling', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    const content = screen.getByRole('dialog')
    expect(content).toHaveClass(
      'bg-background',
      'mobile-menu-content',
      'fixed',
      'inset-x-0',
      'top-0',
      'z-50',
      'flex',
      'h-auto',
      'w-full',
      'flex-col',
      'gap-4',
      'shadow-2xl'
    )
    expect(content).toHaveAttribute('data-slot', 'sheet-content')
  })

  it('should have default styling classes', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    const content = screen.getByRole('dialog')
    expect(content).toHaveClass('bg-background', 'mobile-menu-content')
  })

  it('should have proper data attributes', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    const content = screen.getByRole('dialog')
    expect(content).toHaveAttribute('data-slot', 'sheet-content')
  })

  it('should render close button with proper icon', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    const closeButton = screen.getByRole('button', {
      name: 'Close mobile menu',
    })
    const icon = closeButton.querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('h-6', 'w-6')
  })

  it('should have proper button styling', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    const closeButton = screen.getByRole('button', {
      name: 'Close mobile menu',
    })
    expect(closeButton).toHaveClass('h-10', 'w-10')
    expect(closeButton).toHaveClass('absolute', 'top-3', 'right-4')
  })

  it('should render in a portal', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    // The content should be rendered in a portal - check that it's outside the normal document structure
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    // Portal content is typically rendered at the end of the document body
    expect(dialog.parentElement?.nodeName).toBe('BODY')
  })

  it('should handle multiple children', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>First child</div>
          <div>Second child</div>
          <div>Third child</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    expect(screen.getByText('First child')).toBeVisible()
    expect(screen.getByText('Second child')).toBeVisible()
    expect(screen.getByText('Third child')).toBeVisible()
  })

  it('should render with proper z-index layering', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    const overlay = screen
      .getByRole('dialog')
      .parentElement?.querySelector('.mobile-menu-overlay')
    const content = screen.getByRole('dialog')

    expect(overlay).toHaveClass('z-50')
    expect(content).toHaveClass('z-50')
  })

  it('should have proper accessibility attributes', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    const closeButton = screen.getByRole('button', {
      name: 'Close mobile menu',
    })
    expect(closeButton).toHaveAttribute('aria-label', 'Close mobile menu')
  })

  it('should support complex children structure', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <nav>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
            </ul>
          </nav>
          <div>
            <button>Action</button>
          </div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    expect(screen.getByRole('navigation')).toBeVisible()
    expect(screen.getByRole('list')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Home' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'About' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Action' })).toBeVisible()
  })

  it('should maintain proper component structure', () => {
    render(
      <DialogWrapper>
        <MobileMenuContent>
          <div>Test content</div>
        </MobileMenuContent>
      </DialogWrapper>
    )

    const content = screen.getByRole('dialog')
    const closeButton = screen.getByRole('button', {
      name: 'Close mobile menu',
    })

    // Close button should be inside the content
    expect(content).toContainElement(closeButton)

    // Content should be rendered at document body level (portal behavior)
    expect(content.parentElement?.nodeName).toBe('BODY')
  })
})
