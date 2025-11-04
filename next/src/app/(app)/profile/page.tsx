import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { updateProfile } from '../actions'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const me = await getCurrentUser()
  if (!me) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Please login</h1>
        <a className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm" href="/login">Go to Login</a>
      </main>
    )
  }

  const user = await prisma.user.findUnique({ where: { id: me.id } })
  const isDriver = me.role === 'driver'
  const todayIso = new Date().toISOString().slice(0,10)
  const bookings = await prisma.booking.findMany({
    where: isDriver ? { driverId: me.id } : { requesterId: me.id },
    include: { vehicle: true },
    orderBy: { startTime: 'desc' },
    take: 50,
  })

  return (
    <main className="mx-auto max-w-5xl p-6 grid lg:grid-cols-3 gap-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-medium text-slate-800 mb-3">Profile</h2>
        <form action={updateProfile} className="space-y-3">
          <div className="block">
            <Label>Name</Label>
            <Input name="name" defaultValue={user?.name || ''} />
          </div>
          <div className="block">
            <Label>Phone</Label>
            <Input name="phone" defaultValue={user?.phone || ''} />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="block">
              <Label>Department</Label>
              <Input name="department" defaultValue={user?.department || ''} />
            </div>
            <div className="block">
              <Label>Title</Label>
              <Input name="title" defaultValue={user?.title || ''} />
            </div>
            <div className="block">
              <Label>Location</Label>
              <Input name="location" defaultValue={user?.location || ''} />
            </div>
          </div>
          {isDriver && (
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="block">
                <Label>License No</Label>
                <Input
                  name="driverLicenseNo"
                  defaultValue={user?.driverLicenseNo || ''}
                  required
                  minLength={16}
                  maxLength={16}
                  pattern="[A-Za-z0-9]{16}"
                  title="Exactly 16 alphanumeric characters"
                />
              </div>
              <div className="block">
                <Label>License Expiry</Label>
                <Input
                  type="date"
                  name="driverLicenseExpiry"
                  defaultValue={user?.driverLicenseExpiry ? new Date(user.driverLicenseExpiry).toISOString().slice(0,10) : ''}
                  min={todayIso}
                  required
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </section>

      <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-medium text-slate-800 mb-3">Trip History</h2>
        {bookings.length === 0 && (
          <div className="text-sm text-slate-500">No trips yet.</div>
        )}
        <div className="divide-y">
          {bookings.map(b => (
            <div key={b.id} className="py-3 flex items-center justify-between text-sm">
              <div>
                <div className="font-medium text-slate-800">{b.vehicle.name}</div>
                <div className="text-slate-600">{new Date(b.startTime).toLocaleString()} - {new Date(b.endTime).toLocaleString()}</div>
              </div>
              <div>
                <span className={`rounded px-2 py-0.5 ${b.status === 'Completed' ? 'bg-green-100 text-green-700' : b.status === 'InUse' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
