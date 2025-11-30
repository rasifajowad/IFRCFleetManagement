"use client"
import React from 'react'

type TimelineBooking = {
  id: string
  startTime: string
  endTime: string
  vehicleName: string
  status: string
}

const statusBg: Record<string, string> = {
  Booked: 'bg-amber-300',
  InUse: 'bg-blue-400',
  Completed: 'bg-emerald-400',
}

export default function MobileDayTimeline({ bookings, dateISO }: { bookings: TimelineBooking[]; dateISO: string }) {
  const dayStart = new Date(dateISO)
  const dayEnd = new Date(dateISO); dayEnd.setDate(dayEnd.getDate() + 1)
  const dayMs = dayEnd.getTime() - dayStart.getTime()

  const dayBookings = React.useMemo(() => {
    const withBounds = bookings
      .map(b => {
        const start = new Date(b.startTime)
        const end = new Date(b.endTime)
        if (end <= dayStart || start >= dayEnd) return null
        const s = Math.max(start.getTime(), dayStart.getTime())
        const e = Math.min(end.getTime(), dayEnd.getTime())
        return { ...b, startMs: s, endMs: e }
      })
      .filter((b): b is TimelineBooking & { startMs: number; endMs: number } => Boolean(b))

    return withBounds.sort((a, b) => a.startMs - b.startMs)
  }, [bookings, dayStart, dayEnd])

  if (dayBookings.length === 0) return null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 text-sm font-semibold text-slate-900">Day timeline</div>
      <div className="relative h-16 w-full rounded-lg bg-slate-100 overflow-hidden">
        {dayBookings.map((b) => {
          const left = ((b.startMs - dayStart.getTime()) / dayMs) * 100
          const width = ((b.endMs - b.startMs) / dayMs) * 100
          return (
            <div
              key={b.id}
              className={`absolute top-1/4 h-1/2 rounded-full ${statusBg[b.status] || 'bg-slate-400'}`}
              style={{ left: `${left}%`, width: `${Math.max(width, 3)}%` }}
              title={`${b.vehicleName} (${b.status})`}
            />
          )
        })}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-slate-500">
        <span>12a</span>
        <span>6a</span>
        <span>Noon</span>
        <span>6p</span>
        <span>12a</span>
      </div>
    </div>
  )
}
