import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { updateProfile } from '../actions'

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
          <label className="block">
            <span className="block text-sm text-slate-600 mb-1">Name</span>
            <input name="name" defaultValue={user?.name || ''} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
          <label className="block">
            <span className="block text-sm text-slate-600 mb-1">Phone</span>
            <input name="phone" defaultValue={user?.phone || ''} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </label>
          <div className="flex items-center gap-3">
            <button className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm" type="submit">Save</button>
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

