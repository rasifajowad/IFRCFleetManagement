"use client"
import React from 'react'
import { Badge } from '@/components/ui/badge'

type AgendaBooking = {
  id: string
  startTime: string
  endTime: string
  vehicleName: string
  status: string
  requester: string
  driver: string
  purpose: string
  startLocation?: string | null
  endLocation?: string | null
}

const statusColors: Record<string, string> = {
  Booked: 'bg-amber-100 text-amber-700',
  InUse: 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-700',
}

export default function MobileScheduleAgenda({ bookings, dateISO, label }: { bookings: AgendaBooking[]; dateISO: string; label?: string }) {
  const dayStart = new Date(dateISO)
  const dayEnd = new Date(dateISO); dayEnd.setDate(dayEnd.getDate() + 1)

  const dayBookings = React.useMemo(() => {
    return bookings
      .filter(b => {
        const start = new Date(b.startTime)
        const end = new Date(b.endTime)
        return start < dayEnd && end > dayStart
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  }, [bookings, dayStart, dayEnd])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-slate-700">
        <div className="font-medium text-slate-900">{label || dayStart.toDateString()}</div>
        <div className="text-xs text-slate-500">{dayBookings.length} trip{dayBookings.length === 1 ? '' : 's'}</div>
      </div>
      {dayBookings.length === 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
          No trips scheduled for this day.
        </div>
      )}
      {dayBookings.map((b) => (
        <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">{b.vehicleName}</div>
              <div className="text-xs text-slate-500">{b.purpose}</div>
            </div>
            <Badge className={`${statusColors[b.status] || 'bg-slate-100 text-slate-700'} capitalize`}>
              {b.status}
            </Badge>
          </div>
          <div className="mt-2 text-sm text-slate-800">
            {formatTime(b.startTime)} – {formatTime(b.endTime)}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div>
              <div className="font-medium text-slate-800">Requester</div>
              <div>{b.requester || '-'}</div>
            </div>
            <div className="text-right">
              <div className="font-medium text-slate-800">Driver</div>
              <div>{b.driver || '-'}</div>
            </div>
            {b.startLocation && (
              <div className="col-span-2">
                <div className="font-medium text-slate-800">Start</div>
                <div>{b.startLocation}</div>
              </div>
            )}
            {b.endLocation && (
              <div className="col-span-2">
                <div className="font-medium text-slate-800">Destination</div>
                <div>{b.endLocation}</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}
