'use client'

import { Button } from '@/components/ui/Button'
import { SheetClose } from '@/components/ui/Sheet'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ComponentProps, PropsWithChildren } from 'react'

export const MobileMenuContent = ({
  children,
}: PropsWithChildren<ComponentProps<typeof SheetPrimitive.Content>>) => {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="z-50 fixed inset-0 bg-black/50 mobile-menu-overlay" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className="top-0 z-50 fixed inset-x-0 flex flex-col gap-4 bg-background shadow-2xl w-full h-auto mobile-menu-content"
      >
        <SheetPrimitive.Title className="sr-only">
          Mobile Navigation Menu
        </SheetPrimitive.Title>
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="top-3 right-4 z-10 absolute transition-all duration-200"
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
