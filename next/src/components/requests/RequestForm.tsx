import { createRequest } from '@/app/actions'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet, Field, FieldLabel, FieldDescription, FieldLegend } from '@/components/ui/field'
import DateTimeRange from '@/components/requests/DateTimeRange'

export default function RequestForm({ staff, vehicles, meId, defaultStart, defaultEnd }: {
  staff: { id: string, name: string }[]
  vehicles: { id: string, name: string, plate: string }[]
  meId: string
  defaultStart: string
  defaultEnd: string
}) {
  return (
    <form action={createRequest}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Requester</FieldLegend>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <input readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm" value={staff.find(s => s.id === meId)?.name || 'Unknown'} />
            <input type="hidden" name="requesterId" value={meId} />
          </Field>
        </FieldSet>

        <FieldSet>
          <FieldLegend>Request Details</FieldLegend>
          <Field>
            <FieldLabel>Preferred Vehicle</FieldLabel>
            <Select key={`pref-${vehicles.length}`} name="preferredVehicleId">
              <option value="">Any</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.name} - {v.plate}</option>
              ))}
            </Select>
          </Field>
          <Field>
            <FieldLabel>Purpose</FieldLabel>
            <Input name="purpose" placeholder="e.g. Site visit, meeting" />
            <FieldDescription>Brief reason for the trip.</FieldDescription>
          </Field>
          <DateTimeRange defaultStart={defaultStart} defaultEnd={defaultEnd} />
          <Field>
            <FieldLabel>Notes</FieldLabel>
            <Textarea name="notes" rows={3} />
            <FieldDescription>Optional. Any extra context (destinations, stops, etc.).</FieldDescription>
          </Field>
        </FieldSet>
        <Field>
          <Button type="submit">Submit Request</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
