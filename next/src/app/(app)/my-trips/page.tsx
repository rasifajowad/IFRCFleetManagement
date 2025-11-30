import { prisma } from '@/lib/db'
import { endTrip, startTrip } from '@/app/actions'
import { getCurrentUser } from '@/lib/auth'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SubmitToast } from '@/components/ui/toast'

export const dynamic = 'force-dynamic'

export default async function Page() {
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
  const driverId = me.id

  const bookings = driverId
    ? await prisma.booking.findMany({
        where: { driverId, status: { in: ['Booked', 'InUse'] } },
        include: { vehicle: true, requester: true },
        orderBy: { startTime: 'asc' },
      })
    : []

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <SectionHeader title="My Trips" subtitle="Start and end trips assigned to you" />

      <div className="space-y-4">
        {bookings.length === 0 && (
          <div className="text-sm text-slate-500">No trips to show.</div>
        )}
        {bookings.map((b: (typeof bookings)[number]) => (
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
                <div className="block">
                  <Label className="text-xs">Start Location</Label>
                  <Select name="startLocationType">
                    <option value="Office">Office</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
                <div className="block">
                  <Label className="text-xs">Other (if selected)</Label>
                  <Input name="startLocationOther" placeholder="Custom location" />
                </div>
                <div className="block">
                  <Label className="text-xs">Odometer Start</Label>
                  <Input type="number" inputMode="numeric" name="odometerStart" required />
                </div>
                <div>
                  <Button type="submit">Start Trip</Button>
                  <SubmitToast success="Trip started" />
                </div>
              </form>
            )}

            {b.status === 'InUse' && (
              <form action={endTrip} className="mt-3 grid sm:grid-cols-4 gap-3 items-end">
                <input type="hidden" name="bookingId" value={b.id} />
                <div className="block">
                  <Label className="text-xs">End Location</Label>
                  <Select name="endLocationType">
                    <option value="Office">Office</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Other">Other</option>
                  </Select>
                </div>
                <div className="block">
                  <Label className="text-xs">Other (if selected)</Label>
                  <Input name="endLocationOther" placeholder="Custom location" />
                </div>
                <div className="block">
                  <Label className="text-xs">Odometer End</Label>
                  <Input type="number" inputMode="numeric" name="odometerEnd" required />
                </div>
                <div>
                  <Button type="submit">End Trip</Button>
                  <SubmitToast success="Trip ended" />
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
