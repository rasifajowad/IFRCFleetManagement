import { cn } from '@/lib/utils'
import React from 'react'

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('block text-sm text-slate-600 mb-1', className)} {...props} />
}

