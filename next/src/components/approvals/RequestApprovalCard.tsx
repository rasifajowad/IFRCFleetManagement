import { approveAndAssign } from '@/app/actions'

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
        <label className="block">
          <span className="block text-xs text-slate-600 mb-1">Vehicle</span>
          <select
            key={`veh-${req.id}-${vehicleOptions.length}`}
            name="vehicleId"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          >
            {vehicleOptions.map(v => (
              <option key={v.id} value={v.id}>{v.name} - {v.plate}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-xs text-slate-600 mb-1">Driver</span>
          <select
            key={`drv-${req.id}-${drivers.length}`}
            name="driverId"
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          >
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="block text-xs text-slate-600 mb-1">Options</span>
          <div className="flex items-center gap-2">
            <input id={`ovr-${req.id}`} type="checkbox" name="override" className="rounded" />
            <label htmlFor={`ovr-${req.id}`} className="text-sm text-slate-700">Override conflicts</label>
          </div>
        </label>
        <div className="sm:col-span-3">
          <button className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90" type="submit">Approve & Assign</button>
        </div>
      </form>
    </div>
  )
}
