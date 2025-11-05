"use client"
import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { CardContainer, CardBody, CardItem } from '@/components/ui/three-d-card'
import Image from 'next/image'

type Vehicle = {
  id: string
  name: string
  plate?: string
  assignedDriver?: { id: string; name: string } | null
}

type Booking = {
  id: string
  vehicleId: string
  startTime: string | Date
  endTime: string | Date
  status: string
  requester: { name: string }
  purpose: string
  startLocation?: string | null
  endLocation?: string | null
}

export default function VehicleDashboard({ vehicles, bookings }: { vehicles: Vehicle[]; bookings: Booking[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const now = new Date()

  const byVehicle = useMemo(() => {
    const map = new Map<string, Booking[]>()
    for (const b of bookings) {
      const arr = map.get(b.vehicleId) || []
      arr.push(b)
      map.set(b.vehicleId, arr)
    }
    // sort by start time
    for (const [k, arr] of map) {
      arr.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      map.set(k, arr)
    }
    return map
  }, [bookings])

  function isAvailable(vId: string) {
    const list = byVehicle.get(vId) || []
    return !list.some(b => {
      const s = new Date(b.startTime).getTime()
      const e = new Date(b.endTime).getTime()
      const t = now.getTime()
      return b.status !== 'Completed' && s <= t && t < e
    })
  }

  const selectedBookings = useMemo(() => {
    if (!selected) return [] as Booking[]
    const list = (byVehicle.get(selected) || [])
      .filter(b => new Date(b.endTime).getTime() >= now.getTime())
    return list
  }, [selected, byVehicle, now])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((v) => {
          const avail = isAvailable(v.id)
          return (
            <button key={v.id} onClick={() => setSelected(v.id)} className="text-left">
              <CardContainer containerClassName="py-0" className="w-full h-full">
                <CardBody className="h-44 w-full bg-red-100 rounded-lg">
                  <CardItem className="absolute inset-0 rounded-2xl border overflow-hidden" translateZ={10}>{null}</CardItem>
                  {/* Placeholder image slot */}
                  <CardItem translateZ={12} className="absolute right-2 bottom-2 opacity-80 pointer-events-none">
                    <Image src="/car.svg" alt="Vehicle" width={110} height={60} />
                  </CardItem>
                  <div className="relative h-full w-full p-4">
                    <div className="flex items-center justify-between">
                      <CardItem translateZ={20} className="font-medium text-slate-900">
                        {v.name}
                      </CardItem>
                      <CardItem translateZ={30}>
                        <Badge className={avail ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                          {avail ? 'Available' : 'In Use / Booked'}
                        </Badge>
                      </CardItem>
                    </div>
                    {v.plate && (
                      <CardItem translateZ={12} className="text-xs text-slate-500 mt-1 inline-block">
                        {v.plate}
                      </CardItem>
                    )}
                    <CardItem translateZ={16} className="text-sm text-slate-600 mt-2 inline-block">
                      Driver: {v.assignedDriver?.name || 'Unassigned'}
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            </button>
          )
        })}
      </div>

      {selected && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="text-sm text-slate-700">Trips for selected vehicle</div>
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Time</TH>
                    <TH>Requester</TH>
                    <TH>Status</TH>
                    <TH>Destination</TH>
                  </TR>
                </THead>
                <TBody>
                  {selectedBookings.length === 0 && (
                    <TR><TD colSpan={4} className="text-slate-500">No upcoming or current trips.</TD></TR>
                  )}
                  {selectedBookings.map((b) => (
                    <TR key={b.id}>
                      <TD className="whitespace-nowrap">{new Date(b.startTime).toLocaleString()} - {new Date(b.endTime).toLocaleString()}</TD>
                      <TD>{b.requester?.name}</TD>
                      <TD>{b.status}</TD>
                      <TD>{b.endLocation || b.purpose}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
