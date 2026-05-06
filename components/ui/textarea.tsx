import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'placeholder:text-[#888888] flex field-sizing-content min-h-16 w-full rounded-md border border-[#EAEAEA] bg-white px-3 py-2 text-sm text-[#111111] outline-none',
        'transition-[border-color,box-shadow]',
        'hover:border-[#CCCCCC]',
        'focus-visible:border-[#725a42] focus-visible:ring-[3px] focus-visible:ring-[#725a4214]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:border-[#EF4444]',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
