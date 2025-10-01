'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MobileMenuContent } from './mobile-menu-content'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export const Navigation = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close mobile menu when screen becomes desktop-sized
  useEffect(() => {
    const handleResize = () => {
      if (
        globalThis.window !== undefined &&
        globalThis.window.innerWidth >= 768
      ) {
        // md breakpoint
        setIsOpen(false)
      }
    }

    if (globalThis.window !== undefined) {
      globalThis.window.addEventListener('resize', handleResize)

      // Cleanup event listener on component unmount
      return () => {
        globalThis.window.removeEventListener('resize', handleResize)
      }
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

          {/* Mobile menu using Sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open mobile menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <MobileMenuContent>
              <SheetPrimitive.Title className="sr-only">
                Mobile Navigation Menu
              </SheetPrimitive.Title>
              <nav className="flex flex-col items-center space-y-6 pt-8 pb-6">
                {navigation.map((item, index) => (
                  <SheetClose asChild key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'mobile-menu-item transform py-2 text-xl font-medium transition-all duration-300 ease-out',
                        'hover:scale-105 focus-visible:scale-105 active:scale-95',
                        pathname === item.href
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground focus-visible:text-foreground'
                      )}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'both',
                      }}
                      aria-current={pathname === item.href ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </MobileMenuContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
