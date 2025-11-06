import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import RequestForm from '@/components/requests/RequestForm'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogTrigger, DialogContent, DialogHeader as ModalHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { SubmitToast } from '@/components/ui/toast'
import FormRefresh from '@/components/FormRefresh'
import { cancelRequest } from '@/app/actions'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'

export const dynamic = 'force-dynamic'

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
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
  const sp = await searchParams
  const openNew = !!(sp?.new)

  const now = new Date()
  const fmt = (d: Date) => new Date(d).toISOString().slice(0,16)
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0)
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2, 0)

  // Fetch my pending requests and trip history
  const [pendingReqs, history] = await Promise.all([
    prisma.request.findMany({ where: { requesterId: me.id, status: 'Pending' }, orderBy: { createdAt: 'desc' } }),
    prisma.booking.findMany({ where: { requesterId: me.id }, include: { vehicle: true, driver: true }, orderBy: { startTime: 'desc' }, take: 100 })
  ])

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="My Requests" subtitle="Create a new request, view pending and history" />
        <Dialog defaultOpen={openNew}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700">New Request</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <ModalHeader>
              <DialogTitle>New Request</DialogTitle>
            </ModalHeader>
            <RequestForm staff={staff} meId={me.id} defaultStart={fmt(start)} defaultEnd={fmt(end)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold text-slate-900">Pending Requests</h2>
        </CardHeader>
        <CardContent>
          {pendingReqs.length === 0 ? (
            <div className="text-sm text-slate-500">No pending requests.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Purpose</TH>
                    <TH>Start</TH>
                    <TH>End</TH>
                    <TH>Notes</TH>
                    <TH>Created</TH>
                    <TH>Action</TH>
                  </TR>
                </THead>
                <TBody>
                  {pendingReqs.map(r => (
                    <TR key={r.id}>
                      <TD className="font-medium text-slate-800">{r.purpose}</TD>
                      <TD>{new Date(r.startTime).toLocaleString()}</TD>
                      <TD>{new Date(r.endTime).toLocaleString()}</TD>
                      <TD className="max-w-[280px] truncate" title={r.notes}>{r.notes}</TD>
                      <TD>{new Date(r.createdAt).toLocaleString()}</TD>
                      <TD>
                        <form action={cancelRequest}>
                          <input type="hidden" name="reqId" value={r.id} />
                          <Button variant="outline" size="sm">Cancel</Button>
                          <SubmitToast success="Request cancelled" />
                          <FormRefresh />
                        </form>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold text-slate-900">History</h2>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-sm text-slate-500">No trips yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Vehicle</TH>
                    <TH>Driver</TH>
                    <TH>Purpose</TH>
                    <TH>Start</TH>
                    <TH>End</TH>
                    <TH>Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {history.map(b => (
                    <TR key={b.id}>
                      <TD className="font-medium text-slate-800">{b.vehicle.name}</TD>
                      <TD>{b.driver.name}</TD>
                      <TD>{b.purpose}</TD>
                      <TD>{new Date(b.startTime).toLocaleString()}</TD>
                      <TD>{new Date(b.endTime).toLocaleString()}</TD>
                      <TD>
                        <span className={`rounded px-2 py-0.5 text-xs ${b.status === 'Completed' ? 'bg-green-100 text-green-700' : b.status === 'InUse' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
