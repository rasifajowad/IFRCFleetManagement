import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import DriversTable from '@/components/admin/DriversTable'
import AssignedVehiclesTable from '@/components/admin/AssignedVehiclesTable'
import { VehicleAddButton } from '@/components/vehicle/VehicleEditDialog'
import AddDriverDialog from '@/components/admin/AddDriverDialog'
import BookingsTable from '@/components/admin/BookingsTable'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Button } from '@/components/ui/button'
import DocumentUploadDialog from '@/components/admin/DocumentUploadDialog'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-slate-600">Only fleet officers can access Admin.</p>
        <div className="mt-4 flex gap-3 text-sm">
          <a className="rounded-xl bg-slate-900 text-white px-3 py-2" href="/admin/login">Officer Login</a>
          <a className="text-slate-700 underline" href="/login">Login</a>
        </div>
      </main>
    )
  }
  const drivers = await prisma.user.findMany({ where: { role: 'driver' }, include: { assignedVehicles: true }, orderBy: { name: 'asc' } })
  const vehicles = await prisma.vehicle.findMany({ include: { assignedDriver: true, images: { select: { id: true, url: true }, orderBy: { createdAt: 'asc' } } }, orderBy: { name: 'asc' } })
  const bookings = await prisma.booking.findMany({ include: { vehicle: true, driver: true, requester: true }, orderBy: { startTime: 'desc' } })
  const bugCountRows = await prisma.$queryRaw<{ count: bigint }[]>`SELECT COUNT(*)::bigint AS count FROM "BugReport"`
  const bugCount = Number(bugCountRows[0]?.count ?? 0)

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      <SectionHeader title="Admin" subtitle="Manage drivers, vehicle assignments, and bookings" />

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <AddDriverDialog vehicles={vehicles} />
          <VehicleAddButton drivers={drivers.map((d: typeof drivers[number]) => ({ id: d.id, name: d.name }))} />
          <DocumentUploadDialog />
          <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
            <a href="/api/admin/bug-reports">Bug Reports ({bugCount})</a>
          </Button>
        </div>
        <DriversTable drivers={drivers as any} />
        <AssignedVehiclesTable vehicles={vehicles} drivers={drivers} />
      </section>

      <BookingsTable bookings={bookings} />

      <div className="mt-6">
        <a href="/admin/members" className="rounded-xl border border-slate-300 px-4 py-2 text-sm">Manage Members</a>
      </div>
    </main>
  )
}
