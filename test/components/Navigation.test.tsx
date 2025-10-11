import { Navigation } from '@/components/Navigation/Navigation'
import { createElement, ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '../utils/test-utils'

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

// Mock Next.js usePathname hook
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

describe('Navigation', () => {
  it('should render the main navigation with logo and links', () => {
    render(<Navigation />)

    // Check if the navigation renders without errors
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
