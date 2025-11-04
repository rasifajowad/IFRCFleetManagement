import React from 'react'
import { cn } from '@/lib/utils'

export function FieldGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-4', className)} {...props} />
}

export function FieldSet({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('space-y-3', className)} {...props} />
}

export function FieldLegend({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('text-sm font-medium text-foreground', className)} {...props} />
}

export function FieldDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs text-muted-foreground', className)} {...props} />
}

export function FieldSeparator({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cn('my-3 border-border', className)} {...props} />
}

export function FieldLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('block text-sm text-foreground', className)} {...props} />
}

export function Field({ className, orientation = 'vertical', ...props }: React.HTMLAttributes<HTMLDivElement> & { orientation?: 'vertical' | 'horizontal' }) {
  const base = orientation === 'horizontal' ? 'flex items-center gap-2' : 'space-y-1'
  return <div className={cn(base, className)} {...props} />
}

