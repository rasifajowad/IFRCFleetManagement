import { deleteBooking, updateBookingStatus } from '@/app/actions'
import FormRefresh from '@/components/FormRefresh'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import ConfirmButton from '@/components/ui/confirm-button'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'

export default function BookingsTable({ bookings }: {
  bookings: { id: string, status: string, startTime: string | Date, endTime: string | Date, vehicle: { name: string }, driver: { name: string }, requester: { name: string } }[]
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-slate-800 mb-3">Bookings</h2>
        <a href="/api/export/completed" className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm">Export Completed Trips</a>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <THead>
            <TR>
              <TH>Booking</TH>
              <TH>Vehicle</TH>
              <TH>Driver</TH>
              <TH>Requester</TH>
              <TH>Time</TH>
              <TH>Status</TH>
              <TH>Actions</TH>
            </TR>
          </THead>
          <TBody>
            {bookings.map(b => (
              <TR key={b.id}>
                <TD>{b.id}</TD>
                <TD>{b.vehicle.name}</TD>
                <TD>{b.driver.name}</TD>
                <TD>{b.requester.name}</TD>
                <TD className="whitespace-nowrap">{new Date(b.startTime).toLocaleString()} - {new Date(b.endTime).toLocaleString()}</TD>
                <TD>
                  <form action={updateBookingStatus} className="flex items-center gap-2">
                    <input type="hidden" name="bookingId" value={b.id} />
                    <Select
                      key={`${b.id}:${b.status}`}
                      name="status"
                      defaultValue={b.status}
                    >
                      <option value="Booked">Booked</option>
                      <option value="InUse">InUse</option>
                      <option value="Completed">Completed</option>
                    </Select>
                    <Button className="px-2 py-1 text-xs" type="submit">Update</Button>
                    <FormRefresh />
                  </form>
                </TD>
                <TD>
                  <form action={deleteBooking}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <ConfirmButton
                      className="text-red-600 hover:underline"
                      confirmTitle="Delete booking"
                      confirmMessage="Are you sure you want to delete this booking? This cannot be undone."
                    >
                      Delete
                    </ConfirmButton>
                    <FormRefresh />
                  </form>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  )
}
