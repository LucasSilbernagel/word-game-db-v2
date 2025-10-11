import { MobileMenu } from '@/components/Navigation/MobileMenu/MobileMenu'
import { render, screen } from '@testing-library/react'
import { createElement, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'

// Mock browser APIs that Radix UI needs
Object.defineProperty(globalThis, 'setTimeout', {
  value: vi.fn((callback) => callback()),
  writable: true,
})

Object.defineProperty(globalThis, 'clearTimeout', {
  value: vi.fn(),
  writable: true,
})

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

const mockNavigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

describe('MobileMenu', () => {
  const mockSetIsOpen = vi.fn()

  it('should render the mobile menu button', () => {
    render(
      <MobileMenu
        isOpen={false}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/"
      />
    )

    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' })
    expect(menuButton).toBeInTheDocument()
    expect(menuButton).toHaveClass('md:hidden')
  })

  it('should render the menu button with Menu icon', () => {
    render(
      <MobileMenu
        isOpen={false}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/"
      />
    )

    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' })
    const icon = menuButton.querySelector('svg')
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('w-6', 'h-6')
  })

  it('should render navigation items when open', () => {
    render(
      <MobileMenu
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/"
      />
    )

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument()
  })

  it('should highlight the current page link', () => {
    render(
      <MobileMenu
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/about"
      />
    )

    const aboutLink = screen.getByRole('link', { name: 'About' })
    expect(aboutLink).toHaveClass('text-foreground')
    expect(aboutLink).toHaveAttribute('aria-current', 'page')
  })

  it('should not highlight non-current page links', () => {
    render(
      <MobileMenu
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/about"
      />
    )

    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveClass('text-muted-foreground')
    expect(homeLink).not.toHaveAttribute('aria-current')
  })

  it('should render all navigation links with correct hrefs', () => {
    render(
      <MobileMenu
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/"
      />
    )

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/'
    )
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'href',
      '/about'
    )
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/contact'
    )
  })

  it('should apply staggered animation delays', () => {
    render(
      <MobileMenu
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/"
      />
    )

    const links = [
      screen.getByRole('link', { name: 'Home' }),
      screen.getByRole('link', { name: 'About' }),
      screen.getByRole('link', { name: 'Contact' }),
    ]

    for (const [index, link] of links.entries()) {
      expect(link).toHaveStyle({
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both',
      })
    }
  })

  it('should have proper accessibility attributes', () => {
    render(
      <MobileMenu
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/"
      />
    )

    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('should apply mobile menu item classes', () => {
    render(
      <MobileMenu
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/"
      />
    )

    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveClass(
      'mobile-menu-item',
      'transform',
      'py-2',
      'font-medium',
      'text-xl',
      'transition-all',
      'duration-300',
      'ease-out'
    )
  })

  it('should apply hover and focus classes', () => {
    render(
      <MobileMenu
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/"
      />
    )

    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveClass(
      'hover:scale-105',
      'focus-visible:scale-105',
      'active:scale-95'
    )
  })

  it('should render hidden title for screen readers', () => {
    render(
      <MobileMenu
        isOpen={true}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/"
      />
    )

    // Check for the sr-only title text - there may be multiple due to Radix UI's internal rendering
    const titles = screen.getAllByText('Mobile Navigation Menu')
    expect(titles.length).toBeGreaterThan(0)
    for (const title of titles) {
      expect(title).toHaveClass('sr-only')
    }
  })

  it('should have consistent button styling', () => {
    render(
      <MobileMenu
        isOpen={false}
        setIsOpen={mockSetIsOpen}
        navigation={mockNavigation}
        pathname="/"
      />
    )

    const menuButton = screen.getByRole('button', { name: 'Open mobile menu' })
    expect(menuButton).toHaveClass('md:hidden')
  })
})
