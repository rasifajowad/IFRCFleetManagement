import { prisma } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import React from 'react'
import { VehicleEditDialog, VehicleInfo, DriverOption } from '@/components/vehicle/VehicleEditDialog'

export default async function AssignedVehiclesTable({ vehicles, drivers }: {
  vehicles: VehicleInfo[]
  drivers: DriverOption[]
}) {
  // availability: vehicle is available if not currently InUse
  const inUse = await prisma.booking.findMany({ where: { status: 'InUse' }, select: { vehicleId: true } })
  const inUseSet = new Set(inUse.map(b => b.vehicleId))
  // current odometer: max(odometerEnd) from completed bookings
  const odometers: Record<string, number | null> = {}
  await Promise.all(vehicles.map(async (v) => {
    try {
      const agg = await prisma.booking.aggregate({ _max: { odometerEnd: true }, where: { vehicleId: v.id } as any }) as any
      odometers[v.id] = agg?._max?.odometerEnd ?? null
    } catch { odometers[v.id] = null }
  }))

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-medium text-slate-800 mb-3">Assigned Vehicles</h2>
      <div className="overflow-x-auto">
        <Table>
          <THead>
            <TR>
              <TH>Vehicle</TH>
              <TH>Plate</TH>
              <TH>Assigned Driver</TH>
              <TH>Availability</TH>
              <TH>Current Odometer</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {vehicles.map(v => (
              <TR key={v.id}>
                <TD className="font-medium text-slate-800">{v.name}</TD>
                <TD>{v.plate}</TD>
                <TD>{v.assignedDriver ? v.assignedDriver.name : '-'}</TD>
                <TD>
                  <span className={`rounded px-2 py-0.5 text-xs ${inUseSet.has(v.id) ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {inUseSet.has(v.id) ? 'In Use' : 'Available'}
                  </span>
                </TD>
                <TD>{odometers[v.id] ?? '-'}</TD>
                <TD>
                  <EditVehicleDialog vehicle={v} drivers={drivers} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  )
}

function EditVehicleDialog({ vehicle, drivers }: { vehicle: VehicleInfo; drivers: DriverOption[] }) {
  return (
    <VehicleEditDialog
      vehicle={vehicle}
      drivers={drivers}
      trigger={<Button variant="outline" size="sm">Edit</Button>}
    />
  )
}
