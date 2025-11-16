import { prisma } from '@/lib/db'
import { startOfDay, endOfDay, toISODate } from '@/lib/time'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import FleetCalendar from '@/components/calendar/FleetCalendar'
import { Button } from '@/components/ui/button'


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
    select: {
      id: true,
      vehicleId: true,
      startTime: true,
      endTime: true,
      status: true,
      purpose: true,
      startLocation: true,
      endLocation: true,
      vehicle: { select: { name: true } },
      requester: { select: { name: true } },
      driver: { select: { name: true } },
    },
    orderBy: { startTime: 'asc' },
  })

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <SectionHeader title="Schedule" subtitle="Daily timeline across all vehicles" />
          <div className="text-xs text-slate-500 mt-1">{toISODate(day)}</div>
        </div>
      </div>

      <Card>
        <CardContent className="p-8">
          <FleetCalendar
            initialDate={toISODate(day)}
            events={bookings.map((b) => ({
              id: b.id,
              title: `${(b as any).vehicle.name} - ${b.purpose}`,
              start: new Date(b.startTime).toISOString(),
              end: new Date(b.endTime).toISOString(),
              status: b.status as any,
              driver: (b as any).driver?.name,
              requester: (b as any).requester?.name,
              startLocation: (b as any).startLocation,
              endLocation: (b as any).endLocation,
            }))}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white">
          <a href="/schedule/available">Available Vehicles</a>
        </Button>
      </div>
    </main>
  )
}


