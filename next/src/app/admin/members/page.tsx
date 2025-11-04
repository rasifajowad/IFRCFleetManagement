import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { adminChangeRole, adminDeleteUser, adminUpdateUser } from '@/app/actions'
import FormRefresh from '@/components/FormRefresh'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import ConfirmButton from '@/components/ui/confirm-button'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'

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
  const drivers = users.filter(u => u.role === 'driver')

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Members" subtitle="View and manage all users" />
        <a className="text-sm text-slate-700 underline" href="/admin">Back to Admin</a>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Email</TH>
              <TH>Phone</TH>
              <TH>Dept</TH>
              <TH>Title</TH>
              <TH>Role</TH>
              <TH>Active</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {users.map(u => (
              <TR key={u.id}>
                <TD>
                  <form action={adminUpdateUser} className="space-y-2 min-w-[220px]">
                    <input type="hidden" name="id" value={u.id} />
                    <Label className="text-xs">Name</Label>
                    <Input name="name" defaultValue={u.name} />
                    <Label className="text-xs">Email</Label>
                    <Input name="email" defaultValue={u.email || ''} placeholder="email" />
                    <FormRefresh />
                    <Button className="px-2 py-1 text-xs" type="submit">Save</Button>
                  </form>
                </TD>
                <TD></TD>
                <TD>
                  <form action={adminUpdateUser} className="space-y-2 min-w-[160px]">
                    <input type="hidden" name="id" value={u.id} />
                    <Label className="text-xs">Phone</Label>
                    <Input name="phone" defaultValue={u.phone || ''} placeholder="phone" />
                    <Label className="text-xs">Department</Label>
                    <Input name="department" defaultValue={u.department || ''} placeholder="department" />
                    <Label className="text-xs">Title</Label>
                    <Input name="title" defaultValue={u.title || ''} placeholder="title" />
                    <FormRefresh />
                    <Button className="px-2 py-1 text-xs" type="submit">Save</Button>
                  </form>
                </TD>
                <TD></TD>
                <TD>
                  <form action={adminChangeRole} className="space-y-2 min-w-[200px]">
                    <input type="hidden" name="id" value={u.id} />
                    <Label className="text-xs">Role</Label>
                    <Select key={`${u.id}:${u.role}`} name="role" defaultValue={u.role}>
                      <option value="staff">staff</option>
                      <option value="driver">driver</option>
                      <option value="officer">officer</option>
                    </Select>
                    <div className="text-xs text-slate-500">Reassign driver’s open items to:</div>
                    <Select name="reassignToDriverId">
                      <option value="">Select driver</option>
                      {drivers.filter(d => d.id !== u.id).map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </Select>
                    <FormRefresh />
                    <Button className="px-2 py-1 text-xs" type="submit">Change</Button>
                  </form>
                </TD>
                <TD>
                  <form action={adminUpdateUser} className="space-y-2">
                    <input type="hidden" name="id" value={u.id} />
                    <label className="flex items-center gap-2 text-xs">
                      <input type="checkbox" name="active" defaultChecked={u.active} className="rounded" />
                      Active
                    </label>
                    <FormRefresh />
                    <Button className="px-2 py-1 text-xs" type="submit">Update</Button>
                  </form>
                </TD>
                <TD>
                  <form action={adminDeleteUser}>
                    <input type="hidden" name="id" value={u.id} />
                    <ConfirmButton
                      className="text-red-600 hover:underline"
                      confirmTitle="Delete member"
                      confirmMessage="Are you sure you want to delete this member? This is blocked if they are last officer or have bookings."
                    >
                      Delete
                    </ConfirmButton>
                    <div className="text-xs text-slate-400">(blocked if last officer or has bookings)</div>
                    <FormRefresh />
                  </form>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </main>
  )
}
