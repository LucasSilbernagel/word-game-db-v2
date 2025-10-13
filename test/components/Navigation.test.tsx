import { Navigation } from '@/components/Navigation/Navigation'
import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock the MobileMenu component
vi.mock('@/components/Navigation/MobileMenu/MobileMenu', () => ({
  MobileMenu: ({
    isOpen,
    navigation,
    pathname,
  }: {
    isOpen: boolean
    navigation: Array<{ name: string; href: string }>
    pathname: string
  }) => (
    <div
      data-testid="mobile-menu"
      data-is-open={isOpen}
      data-pathname={pathname}
    >
      {navigation.map((item) => (
        <div key={item.name} data-href={item.href}>
          {item.name}
        </div>
      ))}
    </div>
  ),
}))

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default to home page
    vi.mocked(usePathname).mockReturnValue('/')
  })

  it('should render the main navigation element', () => {
    render(<Navigation />)

    const nav = screen.getByRole('navigation')
    expect(nav).toBeVisible()
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')
  })

  it('should render the logo/brand link', () => {
    render(<Navigation />)

    const logoLink = screen.getByRole('link', { name: 'Word Game DB - Home' })
    expect(logoLink).toBeVisible()
    expect(logoLink).toHaveAttribute('href', '/')
    expect(logoLink).toHaveClass('text-xl', 'font-bold')
  })

  it('should render all desktop navigation links', () => {
    render(<Navigation />)

    // Check for Home link
    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toBeVisible()
    expect(homeLink).toHaveAttribute('href', '/')

    // Check for About link
    const aboutLink = screen.getByRole('link', { name: 'About' })
    expect(aboutLink).toBeVisible()
    expect(aboutLink).toHaveAttribute('href', '/about')

    // Check for Contact link
    const contactLink = screen.getByRole('link', { name: 'Contact' })
    expect(contactLink).toBeVisible()
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('should highlight the active page link', () => {
    vi.mocked(usePathname).mockReturnValue('/about')
    render(<Navigation />)

    const aboutLink = screen.getByRole('link', { name: 'About' })
    expect(aboutLink).toHaveAttribute('aria-current', 'page')
    expect(aboutLink).toHaveClass('text-foreground')

    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).not.toHaveAttribute('aria-current')
    expect(homeLink).toHaveClass('text-muted-foreground')
  })

  it('should apply correct styles to active and inactive links', () => {
    vi.mocked(usePathname).mockReturnValue('/')
    render(<Navigation />)

    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveClass('text-foreground')

    const aboutLink = screen.getByRole('link', { name: 'About' })
    expect(aboutLink).toHaveClass('text-muted-foreground')

    const contactLink = screen.getByRole('link', { name: 'Contact' })
    expect(contactLink).toHaveClass('text-muted-foreground')
  })

  it('should render the MobileMenu component after mount', () => {
    render(<Navigation />)

    // After mount, the MobileMenu should be rendered
    const mobileMenu = screen.getByTestId('mobile-menu')
    expect(mobileMenu).toBeInTheDocument()
  })

  it('should pass correct props to MobileMenu', () => {
    vi.mocked(usePathname).mockReturnValue('/contact')
    render(<Navigation />)

    const mobileMenu = screen.getByTestId('mobile-menu')
    expect(mobileMenu).toHaveAttribute('data-pathname', '/contact')
    expect(mobileMenu).toHaveAttribute('data-is-open', 'false')

    // Check that navigation items are passed
    expect(screen.getAllByText('Home')).toHaveLength(2) // Desktop + Mobile
    expect(screen.getAllByText('About')).toHaveLength(2)
    expect(screen.getAllByText('Contact')).toHaveLength(2)
  })

  it('should have proper navigation structure', () => {
    render(<Navigation />)

    const nav = screen.getByRole('navigation')
    const container = nav.querySelector('.container')
    expect(container).toHaveClass('mx-auto', 'px-4')

    const flexContainer = container?.querySelector('.flex')
    expect(flexContainer).toHaveClass('h-16', 'items-center', 'justify-between')
  })

  it('should render desktop links in a list', () => {
    render(<Navigation />)

    const lists = screen.getAllByRole('list')
    // Should have at least one list for desktop navigation
    expect(lists.length).toBeGreaterThan(0)

    const listItems = screen.getAllByRole('listitem')
    // Should have 3 list items for Home, About, Contact
    expect(listItems.length).toBeGreaterThan(0)
  })

  it('should have proper link styling classes', () => {
    render(<Navigation />)

    const homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveClass(
      'hover:text-primary',
      'focus-visible:text-primary',
      'text-sm',
      'font-medium',
      'transition-colors'
    )
  })

  it('should have proper navigation container styling', () => {
    render(<Navigation />)

    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass(
      'bg-background/95',
      'supports-[backdrop-filter]:bg-background/60',
      'border-b',
      'backdrop-blur'
    )
  })

  it('should render logo with correct text content', () => {
    render(<Navigation />)

    const logoLink = screen.getByRole('link', { name: 'Word Game DB - Home' })
    expect(logoLink).toHaveTextContent('Word Game DB')
  })

  it('should update active link when pathname changes', () => {
    const { rerender } = render(<Navigation />)

    // Initially on home page
    let homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).toHaveAttribute('aria-current', 'page')

    // Change to about page
    vi.mocked(usePathname).mockReturnValue('/about')
    rerender(<Navigation />)

    const aboutLink = screen.getByRole('link', { name: 'About' })
    expect(aboutLink).toHaveAttribute('aria-current', 'page')

    homeLink = screen.getByRole('link', { name: 'Home' })
    expect(homeLink).not.toHaveAttribute('aria-current')
  })

  it('should have accessible navigation landmark', () => {
    render(<Navigation />)

    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(nav).toBeVisible()
  })

  it('should render all navigation items with correct structure', () => {
    render(<Navigation />)

    const navItems = [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ]

    for (const item of navItems) {
      const link = screen.getByRole('link', { name: item.name })
      expect(link).toBeVisible()
      expect(link).toHaveAttribute('href', item.href)
    }
  })
})
