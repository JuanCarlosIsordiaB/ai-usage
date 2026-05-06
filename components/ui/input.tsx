import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'placeholder:text-[#888888] h-9 w-full min-w-0 rounded-md border border-[#EAEAEA] bg-white px-3 py-1 text-sm text-[#111111] outline-none',
        'transition-[border-color,box-shadow]',
        'hover:border-[#CCCCCC]',
        'focus-visible:border-[#725a42] focus-visible:ring-[3px] focus-visible:ring-[#725a421A]',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-[#EF4444]',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
