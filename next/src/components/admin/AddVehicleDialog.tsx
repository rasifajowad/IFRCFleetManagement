"use client"
import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { SubmitToast } from '@/components/ui/toast'
import FormRefresh from '@/components/FormRefresh'
import { addVehicle } from '@/app/actions'

export default function AddVehicleDialog() {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700">Add Vehicle</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add new vehicle</DialogTitle>
        </DialogHeader>
        <form action={addVehicle} className="space-y-3">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input name="name" placeholder="e.g., Toyota Hilux" required />
          </Field>
          <Field>
            <FieldLabel>Plate</FieldLabel>
            <Input name="plate" placeholder="Plate number" required />
          </Field>
          <DialogFooter>
            <Button type="submit">Save</Button>
            <SubmitToast success="Vehicle added" />
            <FormRefresh />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

