import { createRequest } from '@/app/actions'

export default function RequestForm({ staff, vehicles, meId, defaultStart, defaultEnd }: {
  staff: { id: string, name: string }[]
  vehicles: { id: string, name: string, plate: string }[]
  meId: string
  defaultStart: string
  defaultEnd: string
}) {
  return (
    <form action={createRequest} className="grid md:grid-cols-2 gap-4">
      <input type="hidden" name="requesterId" value={meId} />
      <div>
        <span className="block text-sm mb-1 text-slate-600">Requester</span>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          {staff.find(s => s.id === meId)?.name || 'Unknown'}
        </div>
      </div>

      <label className="block">
        <span className="block text-sm mb-1 text-slate-600">Preferred Vehicle</span>
        <select
          key={`pref-${vehicles.length}`}
          name="preferredVehicleId"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
        >
          <option value="">Any</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.name} - {v.plate}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="block text-sm mb-1 text-slate-600">Purpose</span>
        <input name="purpose" className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300" placeholder="e.g. Site visit, meeting" />
      </label>

      <div className="grid grid-cols-2 gap-4 md:col-span-2">
        <label className="block">
          <span className="block text-sm mb-1 text-slate-600">Pickup Time</span>
          <input type="datetime-local" name="startTime" defaultValue={defaultStart} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300" />
        </label>
        <label className="block">
          <span className="block text-sm mb-1 text-slate-600">Return Time</span>
          <input type="datetime-local" name="endTime" defaultValue={defaultEnd} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300" />
        </label>
      </div>

      <label className="md:col-span-2 block">
        <span className="block text-sm mb-1 text-slate-600">Notes</span>
        <textarea name="notes" rows={3} className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300" />
      </label>

      <div className="md:col-span-2">
        <button className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90" type="submit">Submit Request</button>
      </div>
    </form>
  )
}
