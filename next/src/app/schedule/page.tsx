import { prisma } from '@/lib/db'
import Timeline from '@/components/schedule/Timeline'
import { startOfDay, endOfDay, hoursRange, toISODate } from '@/lib/time'

export default async function Page({ searchParams }: { searchParams: { d?: string } }) {
  const base = searchParams?.d ? new Date(searchParams.d) : new Date()
  const day = startOfDay(base)
  const dayEnd = endOfDay(base)

  const vehicles = await prisma.vehicle.findMany({
    include: {
      bookings: {
        where: {
          AND: [
            { endTime: { gte: day } },
            { startTime: { lte: dayEnd } },
          ],
        },
        orderBy: { startTime: 'asc' },
      },
      assignedDriver: true,
    },
    orderBy: { name: 'asc' },
  })

  const hours = hoursRange(8, 20)

  const prev = new Date(day); prev.setDate(prev.getDate() - 1)
  const next = new Date(day); next.setDate(next.getDate() + 1)
  

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Schedule</h1>
          <p className="text-slate-500 text-sm">Daily timeline across all vehicles</p>
          <div className="text-xs text-slate-500 mt-1">{toISODate(day)}</div>
        </div>
        <div className="flex gap-2">
          <a className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" href={`?d=${toISODate(prev)}`}>Yesterday</a>
          <a className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" href={`?d=${toISODate(new Date())}`}>Today</a>
          <a className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" href={`?d=${toISODate(next)}`}>Tomorrow</a>
        </div>
      </div>

      <Timeline vehicles={vehicles as any} day={day} hours={hours} />
    </main>
  )
}
