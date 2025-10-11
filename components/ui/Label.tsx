import { cn } from '@/lib/utils'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { ComponentPropsWithoutRef, ComponentRef, forwardRef } from 'react'

const labelVariants = cva(
  'peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed'
)

const Label = forwardRef<
  ComponentRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
