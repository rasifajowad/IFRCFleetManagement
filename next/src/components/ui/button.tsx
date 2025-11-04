import { cn } from '@/lib/utils'
import React from 'react'

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  children?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', asChild = false, children, ...rest }, ref) => {
    const base = 'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
    const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary: 'bg-slate-900 text-white hover:opacity-90 focus:ring-slate-400',
      secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-300',
      outline: 'border border-slate-300 text-slate-900 hover:bg-slate-50 focus:ring-slate-300',
      ghost: 'text-slate-900 hover:bg-slate-100/70',
    }
    const sizes: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-5 text-base',
    }
    const composed = cn(base, variants[variant], sizes[size], className)

    if (asChild && React.isValidElement(children)) {
      // Merge className into the single child and return it
      const child: any = children
      const childClass = child.props?.className
      return React.cloneElement(child, { className: cn(composed, childClass) })
    }

    return (
      <button ref={ref} className={composed} {...rest}>
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
