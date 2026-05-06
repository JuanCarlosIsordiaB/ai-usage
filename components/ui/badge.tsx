import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-[#725a4214] text-[#725a42]',
        primary:
          'bg-[#725a4214] text-[#725a42]',
        success:
          'bg-[#ECFDF5] text-[#065F46]',
        danger:
          'bg-[var(--badge-red-bg)] text-[var(--badge-red-text)]',
        warning:
          'bg-[var(--badge-amber-bg)] text-[var(--badge-amber-text)]',
        neutral:
          'bg-[var(--bg-light)] text-[var(--color-slate-600)] border border-[var(--border-default)]',
        secondary:
          'bg-[var(--bg-light)] text-[var(--color-slate-600)]',
        destructive:
          'bg-[var(--badge-red-bg)] text-[var(--badge-red-text)]',
        outline:
          'text-[var(--color-slate-700)] border border-[var(--border-default)]',
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
