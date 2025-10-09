'use client'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MobileMenu } from './MobileMenu/MobileMenu'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export const Navigation = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted after hydration to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close mobile menu when screen becomes desktop-sized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <nav
      className="bg-background/95 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-xl font-bold"
              aria-label="Word Game DB - Home"
            >
              Word Game DB
            </Link>
            <ul className="hidden space-x-6 md:flex">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'hover:text-primary focus-visible:text-primary text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile menu - only render after hydration to avoid mismatch */}
          {isMounted ? (
            <MobileMenu
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              navigation={navigation}
              pathname={pathname}
            />
          ) : (
            // Placeholder button during SSR to prevent layout shift
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open mobile menu"
              disabled
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
