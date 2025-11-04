import { approveAndAssign } from '@/app/actions'
import { Label, Select, Button } from '@/components/ui'

type VehicleLite = { id: string; name: string; plate: string }
type DriverLite = { id: string; name: string }
type RequestLite = {
  id: string
  purpose: string
  startTime: string | Date
  endTime: string | Date
  startLocation?: string | null
  destination?: string | null
}

export default function RequestApprovalCard({ req, vehicles, drivers }: {
  req: RequestLite
  vehicles: VehicleLite[]
  drivers: DriverLite[]
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-700"><span className="font-medium">Purpose:</span> {req.purpose}</div>
      <div className="text-xs text-slate-500">From: {req.startLocation} → {req.destination}</div>
      <div className="text-xs text-slate-500">Time: {new Date(req.startTime).toLocaleString()} - {new Date(req.endTime).toLocaleString()}</div>
      <form action={approveAndAssign} className="mt-3 grid sm:grid-cols-3 gap-3 items-end">
        <input type="hidden" name="reqId" value={req.id} />
        <div className="block">
          <Label className="text-xs">Vehicle</Label>
          <Select key={`veh-${req.id}-${vehicles.length}`} name="vehicleId">
            {vehicles.map(v => (
              <option key={v.id} value={v.id}>{v.name} - {v.plate}</option>
            ))}
          </Select>
        </div>
        <div className="block">
          <Label className="text-xs">Driver</Label>
          <Select key={`drv-${req.id}-${drivers.length}`} name="driverId">
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </Select>
        </div>
        <label className="block">
          <span className="block text-xs text-slate-600 mb-1">Options</span>
          <div className="flex items-center gap-2">
            <input id={`ovr-${req.id}`} type="checkbox" name="override" className="rounded" />
            <label htmlFor={`ovr-${req.id}`} className="text-sm text-slate-700">Override conflicts</label>
          </div>
        </label>
        <div className="sm:col-span-3">
          <Button type="submit">Approve & Assign</Button>
        </div>
      </form>
    </div>
  )
}
