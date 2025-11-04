"use client"
import * as React from 'react'
import { DayPicker, type DayPickerSingleProps } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { cn } from '@/lib/utils'

type CalendarProps = DayPickerSingleProps & {
  className?: string
}

export function Calendar(props: CalendarProps) {
  const defaultClassNames: any = {
    day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
    day_today: 'border border-primary text-primary',
    nav_button: 'text-primary hover:bg-accent',
    head_cell: 'text-muted-foreground',
    caption_label: 'text-foreground font-medium',
  }
  return (
    <DayPicker
      {...props}
      mode={props.mode ?? 'single'}
      className={cn('mx-auto', props.className)}
      captionLayout={props.captionLayout ?? 'dropdown-buttons'}
      showOutsideDays
      classNames={{ ...defaultClassNames, ...(props as any).classNames }}
    />
  )
}
