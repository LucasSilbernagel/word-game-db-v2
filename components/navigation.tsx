'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps, useState } from 'react'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

function CustomSheetContent({
  className,
  children,
  side = 'top',
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="z-50 fixed inset-0 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'z-50 fixed flex flex-col gap-4 bg-background shadow-lg transition data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500 ease-in-out',
          side === 'right' &&
            'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
          side === 'left' &&
            'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
          side === 'top' &&
            'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
          side === 'bottom' &&
            'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
          className
        )}
        {...props}
      >
        {/* Close button positioned in the same location as the trigger button */}
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="top-3 right-4 z-10 absolute"
            aria-label="Close mobile menu"
          >
            <X className="w-6 h-6" />
          </Button>
        </SheetClose>
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

export function Navigation() {
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
            <CustomSheetContent side="top" className="w-full">
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
            </CustomSheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
