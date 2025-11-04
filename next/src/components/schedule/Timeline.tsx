import { pctInDay } from '@/lib/time'

type Booking = {
  id: string
  startTime: string | Date
  endTime: string | Date
  status: string
  purpose: string
}

type Vehicle = {
  id: string
  name: string
  bookings: Booking[]
  assignedDriver?: { name: string } | null
}

export default function Timeline({ vehicles, day, hours }: { vehicles: Vehicle[]; day: Date; hours: number[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative">
        <div className="flex text-xs text-slate-500">
          {hours.map((h) => (
            <div key={h} className="flex-1 text-center">{h}:00</div>
          ))}
        </div>
        <div className="absolute left-0 right-0 top-4 bottom-0 grid" style={{ gridTemplateColumns: `repeat(${hours.length - 1}, 1fr)` }}>
          {hours.slice(0, -1).map((h) => (
            <div key={h} className="border-l border-dashed border-slate-200" />
          ))}
        </div>
      </div>

      <div className="mt-3 space-y-4">
        {vehicles.map((v) => (
          <div key={v.id}>
            <div className="text-sm font-medium text-slate-700 mb-1">
              {v.name}
              {v.assignedDriver ? (
                <span className="text-xs text-slate-500 ml-2">(Driver: {v.assignedDriver.name})</span>
              ) : null}
            </div>
            <div className="relative h-10 rounded-lg bg-slate-50 overflow-hidden border border-slate-200">
              {v.bookings.map((b) => {
                const left = pctInDay(new Date(b.startTime), day)
                const right = pctInDay(new Date(b.endTime), day)
                const width = Math.max(5, right - left)
                const cls = b.status === 'InUse'
                  ? 'bg-red-100 text-red-700'
                  : b.status === 'Booked'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-600'
                return (
                  <div key={b.id} className={`absolute top-1 h-8 rounded-md px-2 text-xs flex items-center gap-1 ${cls}`} style={{ left: `${left}%`, width: `${width}%` }} title={`${new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${b.purpose}`}>
                    <span className="truncate">{new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

