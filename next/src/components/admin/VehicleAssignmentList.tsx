import { assignVehicleDriver } from '@/app/actions'

export default function VehicleAssignmentList({ vehicles, drivers }: {
  vehicles: { id: string, name: string, plate: string, assignedDriver?: { id: string, name: string } | null }[]
  drivers: { id: string, name: string }[]
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-medium text-slate-800 mb-3">Assign Vehicles</h2>
      <div className="space-y-3">
        {vehicles.map(v => (
          <form key={v.id} action={assignVehicleDriver} className="flex items-center gap-3">
            <div className="w-64 text-sm">
              <div className="font-medium text-slate-800">{v.name}</div>
              <div className="text-slate-500">{v.plate}</div>
            </div>
            <input type="hidden" name="vehicleId" value={v.id} />
            <select name="driverId" defaultValue={v.assignedDriver?.id || ''} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="">Unassigned</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <button className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm" type="submit">Save</button>
          </form>
        ))}
      </div>
    </div>
  )
}

