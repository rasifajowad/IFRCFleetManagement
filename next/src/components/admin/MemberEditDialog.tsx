"use client"
import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { SubmitToast } from '@/components/ui/toast'
import FormRefresh from '@/components/FormRefresh'
import { adminChangeRole, adminUpdateUser } from '@/app/actions'

type UserLite = {
  id: string
  name: string
  email: string | null
  phone: string | null
  department: string | null
  title: string | null
  location: string | null
  role: 'staff' | 'driver' | 'officer'
  active: boolean
}

export default function MemberEditDialog({ user, drivers }: { user: UserLite; drivers: { id: string; name: string }[] }) {
  const [open, setOpen] = React.useState(false)
  const contentId = React.useMemo(() => `member-edit-${user.id}`, [user.id])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent id={contentId} className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit member</DialogTitle>
          <DialogDescription>Update member details and role.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <form action={adminUpdateUser} className="space-y-3">
            <input type="hidden" name="id" value={user.id} />
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input name="name" defaultValue={user.name} required />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input name="email" type="email" defaultValue={user.email || ''} placeholder="email" />
              <FieldDescription>Used for login. Must be unique.</FieldDescription>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input name="phone" defaultValue={user.phone || ''} placeholder="phone" />
              </Field>
              <Field>
                <FieldLabel>Department</FieldLabel>
                <Input name="department" defaultValue={user.department || ''} placeholder="department" />
              </Field>
              <Field>
                <FieldLabel>Title</FieldLabel>
                <Input name="title" defaultValue={user.title || ''} placeholder="title" />
              </Field>
              <Field>
                <FieldLabel>Location</FieldLabel>
                <Input name="location" defaultValue={user.location || ''} placeholder="location" />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked={user.active} className="rounded" />
              Active
            </label>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="submit">Save details</Button>
              <SubmitToast success="Member updated" error="Update failed" />
              <FormRefresh />
            </div>
          </form>

          <form action={adminChangeRole} className="space-y-3">
            <input type="hidden" name="id" value={user.id} />
            <Field>
              <FieldLabel>Role</FieldLabel>
              <Select key={`${user.id}:${user.role}`} name="role" defaultValue={user.role}>
                <option value="staff">staff</option>
                <option value="driver">driver</option>
                <option value="officer">officer</option>
              </Select>
            </Field>
            <FieldDescription>Changing role may require reassignment.</FieldDescription>
            <Field>
              <FieldLabel>Reassign to driver</FieldLabel>
              <Select name="reassignToDriverId" defaultValue="">
                <option value="">Select driver</option>
                {drivers.filter(d => d.id !== user.id).map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </Select>
            </Field>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="submit" variant="outline">Change role</Button>
              <SubmitToast success="Role updated" error="Role update failed" />
              <FormRefresh />
            </div>
          </form>
        </div>

        {/* Close handled by top-right icon in DialogContent */}
      </DialogContent>
    </Dialog>
  )
}
