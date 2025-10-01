'use client'

import { Button } from '@/components/ui/button'
import { SheetClose } from '@/components/ui/sheet'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ComponentProps, PropsWithChildren } from 'react'

export const MobileMenuContent = ({
  children,
}: PropsWithChildren<ComponentProps<typeof SheetPrimitive.Content>>) => {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50" />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className="data-[state=closed]:slide-out-to-top bg-background data-[state=open]:slide-in-from-top data-[state=closed]:animate-out data-[state=open]:animate-in fixed inset-x-0 top-0 z-50 flex h-auto w-full flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500"
      >
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-4 z-10"
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
