import { prisma } from '@/lib/db'
import { endTrip, startTrip } from '../actions'
import { getCurrentUser } from '@/lib/auth'

export default async function Page({ searchParams }: { searchParams?: { driverId?: string } }) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'driver') {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Driver Access Only</h1>
        <p className="text-slate-600">Please login as a driver to view and manage trips.</p>
        <div className="mt-4 flex gap-3 text-sm">
          <a className="rounded-xl bg-slate-900 text-white px-3 py-2" href="/login?role=driver">Driver Login</a>
          <a className="text-slate-700 underline" href="/login">Login</a>
        </div>
      </main>
    )
  }
  const drivers = await prisma.user.findMany({ where: { role: 'driver' }, orderBy: { name: 'asc' } })
  const driverId = searchParams?.driverId || me.id

  const bookings = driverId
    ? await prisma.booking.findMany({
        where: { driverId, status: { in: ['Booked', 'InUse'] } },
        include: { vehicle: true, requester: true },
        orderBy: { startTime: 'asc' },
      })
    : []

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My Trips</h1>
        <p className="text-slate-500 text-sm">Start and end trips assigned to a driver</p>
      </div>

      <form className="flex items-center gap-3" action="" method="get">
        <label className="text-sm text-slate-600">Driver</label>
        <select name="driverId" defaultValue={driverId} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300">
          {drivers.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <button className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm" type="submit">View</button>
      </form>

      <div className="space-y-4">
        {bookings.length === 0 && (
          <div className="text-sm text-slate-500">No trips to show.</div>
        )}
        {bookings.map((b) => (
          <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-slate-800">{b.vehicle.name} • {b.vehicle.plate}</div>
                <div className="text-xs text-slate-500">{new Date(b.startTime).toLocaleString()} - {new Date(b.endTime).toLocaleString()}</div>
                <div className="text-xs text-slate-500">Purpose: {b.purpose} (Requester: {b.requester.name})</div>
                <div className="text-xs mt-1">
                  <span className={`rounded px-2 py-0.5 ${b.status === 'Booked' ? 'bg-amber-100 text-amber-700' : b.status === 'InUse' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>{b.status}</span>
                </div>
              </div>
            </div>

            {b.status === 'Booked' && (
              <form action={startTrip} className="mt-3 grid sm:grid-cols-4 gap-3 items-end">
                <input type="hidden" name="bookingId" value={b.id} />
                <label className="block">
                  <span className="block text-xs text-slate-600 mb-1">Start Location</span>
                  <select name="startLocationType" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
                    <option value="Office">Office</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="block">
                  <span className="block text-xs text-slate-600 mb-1">Other (if selected)</span>
                  <input name="startLocationOther" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2" placeholder="Custom location" />
                </label>
                <label className="block">
                  <span className="block text-xs text-slate-600 mb-1">Odometer Start</span>
                  <input type="number" inputMode="numeric" name="odometerStart" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2" required />
                </label>
                <div>
                  <button type="submit" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90">Start Trip</button>
                </div>
              </form>
            )}

            {b.status === 'InUse' && (
              <form action={endTrip} className="mt-3 grid sm:grid-cols-4 gap-3 items-end">
                <input type="hidden" name="bookingId" value={b.id} />
                <label className="block">
                  <span className="block text-xs text-slate-600 mb-1">End Location</span>
                  <select name="endLocationType" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
                    <option value="Office">Office</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Other">Other</option>
                  </select>
                </label>
                <label className="block">
                  <span className="block text-xs text-slate-600 mb-1">Other (if selected)</span>
                  <input name="endLocationOther" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2" placeholder="Custom location" />
                </label>
                <label className="block">
                  <span className="block text-xs text-slate-600 mb-1">Odometer End</span>
                  <input type="number" inputMode="numeric" name="odometerEnd" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2" required />
                </label>
                <div>
                  <button type="submit" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90">End Trip</button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
