import { approveAndAssign } from '@/app/actions'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default function RequestApprovalCard({ req, vehicles, drivers }: {
  req: any
  vehicles: { id: string, name: string, plate: string }[]
  drivers: { id: string, name: string }[]
}) {
  const vehicleOptions = (req.preferredVehicleId ? vehicles.filter(v => v.id === req.preferredVehicleId) : vehicles)
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-sm text-slate-700"><span className="font-medium">Purpose:</span> {req.purpose}</div>
      <div className="text-xs text-slate-500">Time: {new Date(req.startTime).toLocaleString()} - {new Date(req.endTime).toLocaleString()}</div>
      <form action={approveAndAssign} className="mt-3 grid sm:grid-cols-3 gap-3 items-end">
        <input type="hidden" name="reqId" value={req.id} />
        <div className="block">
          <Label className="text-xs">Vehicle</Label>
          <Select key={`veh-${req.id}-${vehicleOptions.length}`} name="vehicleId">
            {vehicleOptions.map(v => (
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
