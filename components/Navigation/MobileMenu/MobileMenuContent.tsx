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
      <SheetPrimitive.Overlay className="mobile-menu-overlay fixed inset-0 z-50 bg-black/50" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className="bg-background mobile-menu-content fixed inset-x-0 top-0 z-50 flex h-auto w-full flex-col gap-4 shadow-2xl"
      >
        <SheetPrimitive.Title className="sr-only">
          Mobile Navigation Menu
        </SheetPrimitive.Title>
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-4 z-10 transition-all duration-200"
            aria-label="Close mobile menu"
          >
            <X className="h-6 w-6" />
          </Button>
        </SheetClose>
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}
