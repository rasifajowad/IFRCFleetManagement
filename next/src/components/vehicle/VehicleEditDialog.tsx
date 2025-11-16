"use client"
import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { SubmitToast } from '@/components/ui/toast'
import FormRefresh from '@/components/FormRefresh'
import { addVehicle, updateVehicleDetails } from '@/app/actions'
import { useFormStatus } from 'react-dom'

export type DriverOption = { id: string; name: string }
export type VehicleInfo = {
  id: string
  name: string
  plate?: string | null
  modelName?: string | null
  registrationNumber?: string | null
  assignedDriver?: { id: string; name: string } | null
  ifrcCode?: string | null
  organizationName?: string | null
  engineNumber?: string | null
  engineCapacity?: string | null
  chassisNumber?: string | null
  yearManufacture?: number | null
  deployedArea?: string | null
  contractExpiry?: Date | string | null
  registrationExpiry?: Date | string | null
  primaryImageUrl?: string | null
  images?: { id: string; url: string }[]
}

const blankVehicle: VehicleInfo = {
  id: '',
  name: '',
  plate: '',
  modelName: '',
  registrationNumber: '',
  assignedDriver: null,
}

export function VehicleAddButton({ drivers }: { drivers: DriverOption[] }) {
  return <VehicleEditDialog mode="create" vehicle={blankVehicle} drivers={drivers} trigger={<Button className="bg-red-600 hover:bg-red-700">Add Vehicle</Button>} />
}

export function VehicleEditDialog({ vehicle, drivers, trigger, mode = 'edit' }: { vehicle: VehicleInfo; drivers: DriverOption[]; trigger: React.ReactNode; mode?: 'edit' | 'create' }) {
  const [open, setOpen] = React.useState(false)
  const title = mode === 'create' ? 'Add Vehicle' : 'Edit Vehicle'
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <VehicleForm vehicle={vehicle} drivers={drivers} mode={mode} onCancel={() => setOpen(false)} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

function VehicleForm({ vehicle, drivers, mode, onCancel, onSuccess }: { vehicle: VehicleInfo; drivers: DriverOption[]; mode: 'edit' | 'create'; onCancel: () => void; onSuccess: () => void }) {
  const formAction = mode === 'create' ? addVehicle : updateVehicleDetails
  const submitLabel = mode === 'create' ? 'Add Vehicle' : 'Save Changes'
  const currentModel = getModel(vehicle)
  const currentReg = getRegistration(vehicle)
  const defaultDriverId = vehicle.assignedDriver?.id || ''

  return (
    <form action={formAction} className="space-y-3">
      {mode === 'edit' && <input type="hidden" name="vehicleId" value={vehicle.id} />}
      <Field>
        <FieldLabel>Model</FieldLabel>
        <Input name="modelName" defaultValue={currentModel} required />
      </Field>
      <Field>
        <FieldLabel>Registration Number</FieldLabel>
        <Input name="registrationNumber" defaultValue={currentReg} required />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Organization Using</FieldLabel>
          <Input name="organizationName" defaultValue={vehicle.organizationName || ''} />
        </Field>
        <Field>
          <FieldLabel>IFRC Vehicle Code</FieldLabel>
          <Input name="ifrcCode" defaultValue={vehicle.ifrcCode || ''} />
        </Field>
        <Field>
          <FieldLabel>Engine Number</FieldLabel>
          <Input name="engineNumber" defaultValue={vehicle.engineNumber || ''} />
        </Field>
        <Field>
          <FieldLabel>Engine Capacity</FieldLabel>
          <Input name="engineCapacity" defaultValue={vehicle.engineCapacity || ''} />
        </Field>
        <Field>
          <FieldLabel>Chassis Number</FieldLabel>
          <Input name="chassisNumber" defaultValue={vehicle.chassisNumber || ''} />
        </Field>
        <Field>
          <FieldLabel>Year of Manufacture</FieldLabel>
          <Input name="yearManufacture" type="number" defaultValue={vehicle.yearManufacture ? String(vehicle.yearManufacture) : ''} />
        </Field>
        <Field>
          <FieldLabel>Deployed Area</FieldLabel>
          <Input name="deployedArea" defaultValue={vehicle.deployedArea || ''} />
        </Field>
        <Field>
          <FieldLabel>Contract Expiry Date</FieldLabel>
          <Input name="contractExpiry" type="date" defaultValue={vehicle.contractExpiry ? new Date(vehicle.contractExpiry).toISOString().slice(0,10) : ''} />
        </Field>
        <Field>
          <FieldLabel>Registration Expiry Date</FieldLabel>
          <Input name="registrationExpiry" type="date" defaultValue={vehicle.registrationExpiry ? new Date(vehicle.registrationExpiry).toISOString().slice(0,10) : ''} />
        </Field>
      </div>
      <Field>
        <FieldLabel>Assign Driver</FieldLabel>
        <Select name="driverId" defaultValue={defaultDriverId}>
          <option value="">Unassigned</option>
          {drivers.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </Select>
      </Field>
      <Field>
        <FieldLabel>Upload Images</FieldLabel>
        <Input name="images" type="file" accept="image/*" multiple />
        <FieldDescription>New uploads append to the gallery. First image becomes the card preview.</FieldDescription>
      </Field>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{submitLabel}</Button>
        <SubmitToast success={mode === 'create' ? 'Vehicle added' : 'Vehicle updated'} />
        <FormRefresh />
        <CloseOnSuccess onDone={onSuccess} />
      </div>
    </form>
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

const getModel = (v: VehicleInfo) => v.modelName || v.name || 'Vehicle'
const getRegistration = (v: VehicleInfo) => v.registrationNumber || v.plate || 'N/A'
