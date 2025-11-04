import { deleteBooking, updateBookingStatus } from '@/app/actions'

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
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="py-2 pr-4">Booking</th>
              <th className="py-2 pr-4">Vehicle</th>
              <th className="py-2 pr-4">Driver</th>
              <th className="py-2 pr-4">Requester</th>
              <th className="py-2 pr-4">Time</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id} className="border-t">
                <td className="py-2 pr-4">{b.id}</td>
                <td className="py-2 pr-4">{b.vehicle.name}</td>
                <td className="py-2 pr-4">{b.driver.name}</td>
                <td className="py-2 pr-4">{b.requester.name}</td>
                <td className="py-2 pr-4 whitespace-nowrap">{new Date(b.startTime).toLocaleString()} - {new Date(b.endTime).toLocaleString()}</td>
                <td className="py-2 pr-4">
                  <form action={updateBookingStatus} className="flex items-center gap-2">
                    <input type="hidden" name="bookingId" value={b.id} />
                    <select name="status" defaultValue={b.status} className="rounded-lg border border-slate-300 bg-white px-2 py-1">
                      <option value="Booked">Booked</option>
                      <option value="InUse">InUse</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button className="rounded-lg bg-slate-900 text-white px-2 py-1 text-xs" type="submit">Update</button>
                  </form>
                </td>
                <td className="py-2 pr-4">
                  <form action={deleteBooking}>
                    <input type="hidden" name="bookingId" value={b.id} />
                    <button className="text-red-600 hover:underline" type="submit">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

