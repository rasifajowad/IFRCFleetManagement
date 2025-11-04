import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import RequestForm from '@/components/requests/RequestForm'

export default async function Page() {
  const me = await getCurrentUser()
  if (!me || me.role !== 'staff') {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Staff Access Only</h1>
        <p className="text-slate-600">Please login as staff to submit requests.</p>
        <div className="mt-4 flex gap-3 text-sm">
          <a className="rounded-xl bg-slate-900 text-white px-3 py-2" href="/login">Login</a>
          <a className="text-slate-700 underline" href="/signup">Create account</a>
        </div>
      </main>
    )
  }
  const staff = await prisma.user.findMany({ where: { role: 'staff' }, orderBy: { name: 'asc' } })
  const vehicles = await prisma.vehicle.findMany({ orderBy: { name: 'asc' } })

  const now = new Date()
  const fmt = (d: Date) => new Date(d).toISOString().slice(0,16)
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2, 0)

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">New Request</h1>
        <p className="text-slate-500 text-sm">Request a vehicle and pickup/return time</p>
      </div>

      <RequestForm staff={staff} vehicles={vehicles} meId={me.id} defaultStart={fmt(start)} defaultEnd={fmt(end)} />
    </main>
  )
}
