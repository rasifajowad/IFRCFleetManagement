"use client"
import * as React from 'react'
import { Clock2Icon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel, FieldLegend } from '@/components/ui/field'

function toDateInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function getTimePart(value?: string) {
  if (!value) return '10:30:00'
  const t = value.split('T')[1] || value
  // ensure HH:MM:SS
  const parts = t.split(':')
  if (parts.length === 2) return `${parts[0]}:${parts[1]}:00`
  return `${parts[0] || '10'}:${parts[1] || '30'}:${parts[2] || '00'}`
}

export default function DateTimeRange({ defaultStart, defaultEnd }: { defaultStart?: string; defaultEnd?: string }) {
  const initialDate = React.useMemo(() => (defaultStart ? new Date(defaultStart) : new Date()), [defaultStart])
  const [date, setDate] = React.useState<Date | undefined>(initialDate)
  const [timeFrom, setTimeFrom] = React.useState<string>(getTimePart(defaultStart))
  const [timeTo, setTimeTo] = React.useState<string>(getTimePart(defaultEnd))
  const [error, setError] = React.useState<string | null>(null)
  const rootRef = React.useRef<HTMLDivElement>(null)

  const dateStr = date ? toDateInputValue(date) : toDateInputValue(new Date())
  const startValue = `${dateStr}T${timeFrom}`
  const endValue = `${dateStr}T${timeTo}`

  // Attach a submit handler to the nearest form to validate end >= start
  React.useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const form = el.closest('form')
    if (!form) return
    const handler = (e: Event) => {
      const start = new Date(startValue)
      const end = new Date(endValue)
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return
      if (end.getTime() < start.getTime()) {
        e.preventDefault()
        setError('Return time must be later than or equal to pickup time.')
      } else {
        setError(null)
      }
    }
    form.addEventListener('submit', handler)
    return () => form.removeEventListener('submit', handler)
  }, [startValue, endValue])

  return (
    <div ref={rootRef} className="w-full flex flex-col gap-4">
      <FieldLegend className="text-left">Date &amp; Time</FieldLegend>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field>
          <FieldLabel htmlFor="req-date">Date</FieldLabel>
          <Input
            id="req-date"
            type="date"
            value={dateStr}
            onChange={(e) => {
              const val = e.target.value
              if (!val) return
              const [y,m,d] = val.split('-').map(Number)
              setDate(new Date(y, (m || 1) - 1, d || 1))
            }}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="req-time-from">Pickup Time</FieldLabel>
          <div className="relative flex w-full items-center gap-2">
            <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
            <Input
              id="req-time-from"
              type="time"
              step="60"
              value={timeFrom}
              onChange={(e) => setTimeFrom(e.target.value)}
              className="appearance-none pl-8"
            />
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="req-time-to">Return Time</FieldLabel>
          <div className="relative flex w-full items-center gap-2">
            <Clock2Icon className="text-muted-foreground pointer-events-none absolute left-2.5 size-4 select-none" />
            <Input
              id="req-time-to"
              type="time"
              step="60"
              value={timeTo}
              onChange={(e) => setTimeTo(e.target.value)}
              className="appearance-none pl-8"
            />
          </div>
        </Field>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {/* Hidden inputs to submit in the expected format */}
      <input type="hidden" name="startTime" value={startValue} />
      <input type="hidden" name="endTime" value={endValue} />
    </div>
  )
}
