"use client"
import React from 'react'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { removeDriver } from '@/app/actions'
import FormRefresh from '@/components/FormRefresh'

export default function DriversTable({ drivers }: {
  drivers: { id: string; name: string; email?: string | null; phone?: string | null; department?: string | null; title?: string | null; assignedVehicles?: { id: string; name: string; plate: string }[] }[]
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-medium text-slate-800 mb-3">Drivers</h2>
      <div className="overflow-x-auto">
        <Table>
          <THead>
            <TR>
              <TH>Name</TH>
              <TH>Email</TH>
              <TH>Phone</TH>
              <TH>Department</TH>
              <TH>Title</TH>
              <TH>Assigned Vehicle</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {drivers.map(d => (
              <TR key={d.id}>
                <TD className="font-medium text-slate-800">{d.name}</TD>
                <TD>{d.email || '-'}</TD>
                <TD>{d.phone || '-'}</TD>
                <TD>{d.department || '-'}</TD>
                <TD>{d.title || '-'}</TD>
                <TD>{d.assignedVehicles && d.assignedVehicles.length > 0 ? `${d.assignedVehicles[0].name} • ${d.assignedVehicles[0].plate}` : '-'}</TD>
                <TD>
                  <form action={removeDriver}>
                    <input type="hidden" name="driverId" value={d.id} />
                    <Button variant="ghost" size="sm" className="text-red-600">Remove</Button>
                    <FormRefresh />
                  </form>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  )
}
