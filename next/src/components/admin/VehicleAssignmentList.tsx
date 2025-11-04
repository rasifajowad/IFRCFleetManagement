import { assignVehicleDriver } from '@/app/actions'
import FormRefresh from '@/components/FormRefresh'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

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
            <Select
              key={`${v.id}:${v.assignedDriver?.id ?? 'none'}`}
              name="driverId"
              defaultValue={v.assignedDriver?.id || ''}
            >
              <option value="">Unassigned</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </Select>
            <Button type="submit">Save</Button>
            <FormRefresh />
          </form>
        ))}
      </div>
    </div>
  )
}
