import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { adminDeleteUser } from '@/app/actions'
import SectionHeader from '@/components/aceternity/SectionHeader'
import MembersTable from '@/components/admin/MembersTable'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-slate-600">Only fleet officers can access Members.</p>
        <div className="mt-4 flex gap-3 text-sm">
          <a className="rounded-xl bg-slate-900 text-white px-3 py-2" href="/admin/login">Officer Login</a>
          <a className="text-slate-700 underline" href="/login">Login</a>
        </div>
      </main>
    )
  }

  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } })
  const drivers = users.filter((u: typeof users[number]) => u.role === 'driver')

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Members" subtitle="View and manage all users" />
        <a className="text-sm text-slate-700 underline" href="/admin">Back to Admin</a>
      </div>

      <MembersTable users={users} drivers={drivers} />
    </main>
  )
}

