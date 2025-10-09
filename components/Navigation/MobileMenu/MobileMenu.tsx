'use client'

import { Button } from '@/components/ui/Button'
import { Sheet, SheetClose, SheetTrigger } from '@/components/ui/Sheet'
import { cn } from '@/lib/utils'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { MobileMenuContent } from './MobileMenuContent/MobileMenuContent'

export type MobileMenuProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  navigation: Array<{ name: string; href: string }>
  pathname: string
}

/**
 * Mobile menu component that renders a Sheet-based navigation menu.
 * Should only be rendered client-side after hydration to avoid hydration mismatches.
 */
export const MobileMenu = ({
  isOpen,
  setIsOpen,
  navigation,
  pathname,
}: MobileMenuProps) => {
  return (
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
  )
}
