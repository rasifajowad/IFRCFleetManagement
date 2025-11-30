import { prisma } from '@/lib/db'
import { startOfDay, endOfDay } from '@/lib/time'
import SectionHeader from '@/components/aceternity/SectionHeader'
import VehicleDashboard from '@/components/schedule/VehicleDashboard'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AvailableVehiclesPage() {
  const today = new Date()
  const day = startOfDay(today)
  const dayEnd = endOfDay(today)
  const rangeStart = new Date(day); rangeStart.setDate(rangeStart.getDate() - 14)
  const rangeEnd = new Date(dayEnd); rangeEnd.setDate(rangeEnd.getDate() + 45)

  const vehicles = await prisma.vehicle.findMany({
    include: {
      assignedDriver: true,
      images: { select: { url: true }, orderBy: { createdAt: 'asc' }, take: 1 },
    },
    orderBy: { name: 'asc' }
  })
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
      requester: { select: { name: true } },
    },
    orderBy: { startTime: 'asc' },
  })

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Available Vehicles" subtitle="View live availability across the fleet" />
        <Button asChild size="sm" className="bg-red-600 hover:bg-red-700 text-white">
          <a href="/schedule">Back</a>
        </Button>
      </div>
      <VehicleDashboard
        vehicles={vehicles as any}
        bookings={bookings.map((b: (typeof bookings)[number]) => ({
          id: b.id,
          vehicleId: b.vehicleId,
          startTime: b.startTime as any,
          endTime: b.endTime as any,
          status: b.status,
          requester: { name: (b as any).requester?.name || '' },
          purpose: b.purpose,
          startLocation: b.startLocation,
          endLocation: b.endLocation,
        }))}
      />
    </main>
  )
}
