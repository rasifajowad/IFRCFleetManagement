import { prisma } from '@/lib/db'
import { startOfDay, endOfDay, toISODate } from '@/lib/time'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import VehicleDashboard from '@/components/schedule/VehicleDashboard'
import FleetCalendar from '@/components/calendar/FleetCalendar'

export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: Promise<{ d?: string }> }) {
  const sp = await searchParams
  const base = sp?.d ? new Date(sp.d) : new Date()
  const day = startOfDay(base)
  const dayEnd = endOfDay(base)

  const rangeStart = new Date(day); rangeStart.setDate(rangeStart.getDate() - 14)
  const rangeEnd = new Date(dayEnd); rangeEnd.setDate(rangeEnd.getDate() + 45)
  const bookings = await prisma.booking.findMany({
    where: {
      AND: [
        { endTime: { gte: rangeStart } },
        { startTime: { lte: rangeEnd } },
      ],
    },
    include: { vehicle: true, driver: true, requester: true },
    orderBy: { startTime: 'asc' },
  })
  const vehicles = await prisma.vehicle.findMany({ include: { assignedDriver: true }, orderBy: { name: 'asc' } })

  const prev = new Date(day); prev.setDate(prev.getDate() - 1)
  const next = new Date(day); next.setDate(next.getDate() + 1)
  

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <SectionHeader title="Schedule" subtitle="Daily timeline across all vehicles" />
          <div className="text-xs text-slate-500 mt-1">{toISODate(day)}</div>
        </div>
        <div className="flex gap-2">
          <a className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" href={`?d=${toISODate(prev)}`}>Yesterday</a>
          <a className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" href={`?d=${toISODate(new Date())}`}>Today</a>
          <a className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" href={`?d=${toISODate(next)}`}>Tomorrow</a>
        </div>
      </div>

      <VehicleDashboard
        vehicles={vehicles as any}
        bookings={bookings.map(b => ({
          id: b.id,
          vehicleId: b.vehicleId,
          startTime: b.startTime as any,
          endTime: b.endTime as any,
          status: b.status,
          requester: { name: (b as any).requester?.name || '' },
          purpose: b.purpose,
          startLocation: (b as any).startLocation,
          endLocation: (b as any).endLocation,
        }))}
      />

      <Card>
        <CardContent className="p-3">
          <FleetCalendar
            initialDate={toISODate(day)}
            events={bookings.map((b) => ({
              id: b.id,
              title: `${b.vehicle.name} — ${b.purpose} (${b.status})`,
              start: new Date(b.startTime).toISOString(),
              end: new Date(b.endTime).toISOString(),
              color: b.status === 'InUse' ? '#ef4444' : b.status === 'Booked' ? '#f59e0b' : '#64748b',
            }))}
          />
        </CardContent>
      </Card>
    </main>
  )
}
