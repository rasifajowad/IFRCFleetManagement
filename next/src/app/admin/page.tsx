import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import DriverList from '@/components/admin/DriverList'
import VehicleAssignmentList from '@/components/admin/VehicleAssignmentList'
import BookingsTable from '@/components/admin/BookingsTable'

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
  const drivers = await prisma.user.findMany({ where: { role: 'driver' }, orderBy: { name: 'asc' } })
  const vehicles = await prisma.vehicle.findMany({ include: { assignedDriver: true }, orderBy: { name: 'asc' } })
  const bookings = await prisma.booking.findMany({ include: { vehicle: true, driver: true, requester: true }, orderBy: { startTime: 'desc' } })

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-slate-500 text-sm">Manage drivers, vehicle assignments, and bookings</p>
      </div>

      <section className="grid lg:grid-cols-3 gap-6">
        <DriverList drivers={drivers} />
        <div className="lg:col-span-2">
          <VehicleAssignmentList vehicles={vehicles} drivers={drivers} />
        </div>
      </section>

      <BookingsTable bookings={bookings} />
    </main>
  )
}
