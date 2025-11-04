import { createRequest } from '@/app/actions'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

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
        <Label>Requester</Label>
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          {staff.find(s => s.id === meId)?.name || 'Unknown'}
        </div>
      </div>

      <div className="block">
        <Label>Preferred Vehicle</Label>
        <Select key={`pref-${vehicles.length}`} name="preferredVehicleId">
          <option value="">Any</option>
          {vehicles.map(v => (
            <option key={v.id} value={v.id}>{v.name} - {v.plate}</option>
          ))}
        </Select>
      </div>

      <div className="block">
        <Label>Purpose</Label>
        <Input name="purpose" placeholder="e.g. Site visit, meeting" />
      </div>

      <div className="grid grid-cols-2 gap-4 md:col-span-2">
        <div className="block">
          <Label>Pickup Time</Label>
          <Input type="datetime-local" name="startTime" defaultValue={defaultStart} />
        </div>
        <div className="block">
          <Label>Return Time</Label>
          <Input type="datetime-local" name="endTime" defaultValue={defaultEnd} />
        </div>
      </div>

      <div className="md:col-span-2 block">
        <Label>Notes</Label>
        <Textarea name="notes" rows={3} />
      </div>

      <div className="md:col-span-2">
        <Button type="submit">Submit Request</Button>
      </div>
    </form>
  )
}
