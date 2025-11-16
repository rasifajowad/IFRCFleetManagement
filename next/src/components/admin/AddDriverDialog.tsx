"use client"
import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Field, FieldLabel } from '@/components/ui/field'
import { SubmitToast } from '@/components/ui/toast'
import FormRefresh from '@/components/FormRefresh'
import { addDriver } from '@/app/actions'
import { useFormStatus } from 'react-dom'

export default function AddDriverDialog({ vehicles }: { vehicles: { id: string; name: string; plate: string }[] }) {
  const [open, setOpen] = React.useState(false)
  const today = new Date().toISOString().slice(0,10)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700">Add Driver</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add new driver</DialogTitle>
        </DialogHeader>
        <form action={addDriver} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Name</FieldLabel>
              <Input name="name" placeholder="Driver name" required />
            </Field>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input name="email" type="email" placeholder="email@example.com" required />
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input name="password" type="password" placeholder="Temporary password" minLength={8} required />
            </Field>
            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input name="confirmPassword" type="password" placeholder="Re-enter password" minLength={8} required />
            </Field>
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <Input name="phone" placeholder="phone" />
            </Field>
            <Field>
              <FieldLabel>Department</FieldLabel>
              <Input name="department" placeholder="department" />
            </Field>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <Input name="title" placeholder="designation" />
            </Field>
            <Field>
              <FieldLabel>Location</FieldLabel>
              <Input name="location" placeholder="location" />
            </Field>
            <Field>
              <FieldLabel>Driver License Number</FieldLabel>
              <Input name="driverLicenseNo" placeholder="16 alphanumeric characters" required pattern="[A-Za-z0-9]{16}" />
            </Field>
            <Field>
              <FieldLabel>License Expiry Date</FieldLabel>
              <Input name="driverLicenseExpiry" type="date" min={today} required />
            </Field>
          </div>
          <Field>
            <FieldLabel>Assign vehicle (optional)</FieldLabel>
            <Select name="vehicleId" defaultValue="">
              <option value="">Unassigned</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.name} • {v.plate}</option>
              ))}
            </Select>
          </Field>
          <DialogFooter>
            <Button type="submit">Save</Button>
            <SubmitToast success="Driver added" />
            <FormRefresh />
            <CloseOnSuccess onDone={() => setOpen(false)} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CloseOnSuccess({ onDone }: { onDone: () => void }) {
  const { pending } = useFormStatus()
  const prev = React.useRef(false)
  React.useEffect(() => {
    if (prev.current && !pending) onDone()
    prev.current = pending
  }, [pending, onDone])
  return null
}
