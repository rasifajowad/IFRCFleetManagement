"use client"
import React from 'react'
import { useFormStatus } from 'react-dom'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { SubmitToast } from '@/components/ui/toast'
import FormRefresh from '@/components/FormRefresh'
import { updateProfile } from '@/app/actions'

export default function ProfileEditDialog({
  user,
  isDriver,
}: {
  user: {
    name: string
    email?: string | null
    phone?: string | null
    department?: string | null
    title?: string | null
    location?: string | null
    avatarUrl?: string | null
    driverLicenseNo?: string | null
    driverLicenseExpiry?: Date | null
  }
  isDriver: boolean
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your personal details.</DialogDescription>
        </DialogHeader>
        <form action={updateProfile} className="space-y-3">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input name="name" defaultValue={user.name || ''} required />
          </Field>
          <Field>
            <FieldLabel>Profile Picture URL</FieldLabel>
            <Input name="avatarUrl" type="url" defaultValue={user.avatarUrl || ''} placeholder="https://…" />
          </Field>
          <Field>
            <FieldLabel>Upload Profile Picture</FieldLabel>
            <Input name="avatarFile" type="file" accept="image/*" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Input name="phone" defaultValue={user.phone || ''} />
            </Field>
            <Field>
              <FieldLabel>Department</FieldLabel>
              <Input name="department" defaultValue={user.department || ''} />
            </Field>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input name="title" defaultValue={user.title || ''} />
            </Field>
            <Field>
              <FieldLabel>Location</FieldLabel>
              <Input name="location" defaultValue={user.location || ''} />
            </Field>
          </div>
          {isDriver && (
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>License No (16 chars)</FieldLabel>
                <Input name="driverLicenseNo" defaultValue={user.driverLicenseNo || ''} minLength={16} maxLength={16} pattern="[A-Za-z0-9]{16}" />
              </Field>
              <Field>
                <FieldLabel>License Expiry</FieldLabel>
                <Input name="driverLicenseExpiry" type="date" defaultValue={user.driverLicenseExpiry ? new Date(user.driverLicenseExpiry).toISOString().slice(0,10) : ''} />
              </Field>
            </div>
          )}
          <DialogFooter>
            <Button type="submit">Save</Button>
            <SubmitToast success="Profile updated" />
            <FormRefresh />
            <CloseOnSubmit onDone={() => setOpen(false)} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CloseOnSubmit({ onDone }: { onDone: () => void }) {
  const { pending } = useFormStatus()
  const prev = React.useRef(false)
  React.useEffect(() => {
    if (prev.current && !pending) onDone()
    prev.current = pending
  }, [pending, onDone])
  return null
}
