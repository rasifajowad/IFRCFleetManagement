import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import RequestApprovalCard from '@/components/approvals/RequestApprovalCard'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-slate-600">Only fleet officers can view pending requests.</p>
        <div className="mt-4 flex gap-3 text-sm">
          <a className="rounded-xl bg-slate-900 text-white px-3 py-2" href="/admin/login">Officer Login</a>
          <a className="text-slate-700 underline" href="/login">Login</a>
        </div>
      </main>
    )
  }

  const pending = await prisma.request.findMany({ where: { status: 'Pending' }, orderBy: { createdAt: 'desc' } })
  const vehicles = await prisma.vehicle.findMany({ orderBy: { name: 'asc' } })
  const drivers = await prisma.user.findMany({ where: { role: 'driver' }, orderBy: { name: 'asc' } })

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pending Requests</h1>
        <p className="text-slate-500 text-sm">Approve and assign vehicles and drivers</p>
      </div>

      <div className="space-y-4">
        {pending.length === 0 && <div className="text-slate-500 text-sm">No pending requests</div>}
        {pending.map((req) => (
          <RequestApprovalCard key={req.id} req={req} vehicles={vehicles} drivers={drivers} />
        ))}
      </div>
    </main>
  )
}
