"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { VehicleEditDialog, VehicleInfo, DriverOption } from '@/components/vehicle/VehicleEditDialog'

export default function VehicleDetailActions({ vehicle, drivers }: { vehicle: VehicleInfo; drivers: DriverOption[] }) {
  return (
    <VehicleEditDialog
      vehicle={vehicle}
      drivers={drivers}
      trigger={<Button className="bg-red-600 hover:bg-red-700 text-white">Edit Vehicle</Button>}
    />
  )
}
