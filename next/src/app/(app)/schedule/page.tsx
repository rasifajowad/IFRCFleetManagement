import { prisma } from '@/lib/db'
import { startOfDay, endOfDay } from '@/lib/time'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import FleetCalendar from '@/components/calendar/FleetCalendar'
import { Button } from '@/components/ui/button'
import MobileScheduleAgenda from '@/components/schedule/MobileScheduleAgenda'
import MobileDayTimeline from '@/components/schedule/MobileDayTimeline'
import Link from 'next/link'


export const dynamic = 'force-dynamic'
export const revalidate = 0
export const dynamicParams = true
export const fetchCache = 'force-no-store'

export default async function Page({ searchParams }: { searchParams?: { d?: string | string[] } }) {
  const sp = searchParams || {}
  const dParam = Array.isArray(sp.d) ? sp.d[0] : sp.d
  // Use local midnight for the selected date to avoid UTC shifting issues on mobile
  const base = dParam ? new Date(`${dParam}T00:00:00`) : new Date()
  const toLocalISODate = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const dayNum = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${dayNum}`
  }
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

  const agendaBookings = bookings.map((b: (typeof bookings)[number]) => ({
    id: b.id,
    startTime: new Date(b.startTime).toISOString(),
    endTime: new Date(b.endTime).toISOString(),
    vehicleName: (b as any).vehicle.name as string,
    status: b.status,
    requester: (b as any).requester?.name || '',
    driver: (b as any).driver?.name || '',
    purpose: b.purpose,
    startLocation: (b as any).startLocation || '',
    endLocation: (b as any).endLocation || '',
  }))
  const todayIso = toLocalISODate(new Date())
  const readableDate = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }).format(day)

  const dayKey = toLocalISODate(day)

  return (
    <main key={dayKey} className="mx-auto max-w-5xl p-4 sm:p-6 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <SectionHeader title="Schedule" subtitle="Daily timeline across all vehicles" />
          <div className="text-xs text-slate-500 mt-1">{toLocalISODate(day)}</div>
        </div>
        <div className="flex justify-start sm:justify-end">
          <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white">
            <a href="/schedule/available">Available Vehicles</a>
          </Button>
        </div>
      </div>

      <div className="md:hidden">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Button asChild size="sm" variant="outline" className="h-9 px-3">
            <Link href={`/schedule?d=${todayIso}`} prefetch={false}>Today</Link>
          </Button>
        </div>
        <MobileScheduleAgenda key={dayKey} dateISO={toLocalISODate(day)} bookings={agendaBookings} label={readableDate} />
        <div className="mt-3">
          <MobileDayTimeline key={`timeline-${dayKey}`} dateISO={toLocalISODate(day)} bookings={agendaBookings} />
        </div>
      </div>

      <Card className="hidden md:block">
        <CardContent className="p-8">
          <FleetCalendar
            initialDate={toLocalISODate(day)}
            events={bookings.map((b: (typeof bookings)[number]) => ({
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
    </main>
  )
}


