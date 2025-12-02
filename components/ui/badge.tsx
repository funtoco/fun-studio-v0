import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'neumorphic text-foreground [a&]:hover:neumorphic-pressed',
        secondary:
          'neumorphic text-secondary-foreground [a&]:hover:neumorphic-pressed',
        destructive:
          'neumorphic text-destructive [a&]:hover:neumorphic-pressed focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'neumorphic text-foreground [a&]:hover:neumorphic-pressed',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
