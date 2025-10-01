'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MobileMenuContent } from './mobile-menu-content'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export const Navigation = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav
      className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b"
      aria-label="Main navigation"
    >
      <div className="mx-auto px-4 container">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="font-bold text-xl"
              aria-label="Word Game DB - Home"
            >
              Word Game DB
            </Link>
            <ul className="hidden md:flex space-x-6">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'font-medium hover:text-primary text-sm transition-colors',
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
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <MobileMenuContent>
              <SheetPrimitive.Title className="sr-only">
                Mobile Navigation Menu
              </SheetPrimitive.Title>
              <nav className="flex flex-col items-center space-y-6 pt-8 pb-6">
                {navigation.map((item) => (
                  <SheetClose asChild key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'py-2 font-medium text-xl transition-colors',
                        pathname === item.href
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
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
