import { cn } from '@/lib/utils'
import React from 'react'

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700', className)} {...props} />
}

