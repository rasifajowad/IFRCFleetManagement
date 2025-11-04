import { createRequest } from '@/app/actions'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet, Field, FieldLabel, FieldDescription, FieldLegend } from '@/components/ui/field'
import { SubmitToast } from '@/components/ui/toast'
import DateTimeRange from '@/components/requests/DateTimeRange'

export default function RequestForm({ staff, meId, defaultStart, defaultEnd }: {
  staff: { id: string, name: string }[]
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
            <FieldLabel>Start Location</FieldLabel>
            <Input name="startLocation" placeholder="e.g. Office, Warehouse, or address" required />
            <FieldDescription>Where the trip starts.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Destination</FieldLabel>
            <Input name="destination" placeholder="e.g. Site A, Airport, or address" required />
            <FieldDescription>Where you need to go.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Purpose</FieldLabel>
            <Input name="purpose" placeholder="e.g. Site visit, meeting" required />
            <FieldDescription>Brief reason for the trip.</FieldDescription>
          </Field>
          <DateTimeRange defaultStart={defaultStart} defaultEnd={defaultEnd} />
          <Field>
            <FieldLabel>Notes</FieldLabel>
            <Textarea name="notes" rows={3} />
            <FieldDescription>Optional. Any extra context.</FieldDescription>
          </Field>
        </FieldSet>
        <Field>
          <Button type="submit">Submit Request</Button>
          <SubmitToast success="Request submitted" />
        </Field>
      </FieldGroup>
    </form>
  )
}
