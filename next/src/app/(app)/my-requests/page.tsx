import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import RequestForm from '@/components/requests/RequestForm'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const me = await getCurrentUser()
  if (!me) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Please login</h1>
        <p className="text-slate-600">Login to submit a request.</p>
        <div className="mt-4 flex gap-3 text-sm">
          <a className="rounded-xl bg-slate-900 text-white px-3 py-2" href="/login">Login</a>
          <a className="text-slate-700 underline" href="/signup">Create account</a>
        </div>
      </main>
    )
  }
  const staff = await prisma.user.findMany({ orderBy: { name: 'asc' } })

  const now = new Date()
  const fmt = (d: Date) => new Date(d).toISOString().slice(0,16)
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2, 0)

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <SectionHeader title="New Request" subtitle="Request a vehicle and pickup/return time" />
      <Card>
        <CardContent className="p-4">
          <RequestForm staff={staff} meId={me.id} defaultStart={fmt(start)} defaultEnd={fmt(end)} />
        </CardContent>
      </Card>
    </main>
  )
}
