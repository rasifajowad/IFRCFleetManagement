import React from 'react';
import { BookingItem } from '../../types';
import { fmtTimeRange } from '../../lib/time';

export default function AdminOverrideBookings({ bookings, setBookings }: { bookings: BookingItem[]; setBookings: React.Dispatch<React.SetStateAction<BookingItem[]>> }) {
  const updateStatus = (id: string, status: BookingItem['status']) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));

  const removeBooking = (id: string) =>
    setBookings((prev) => prev.filter((b) => b.id !== id));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <h3 className="text-lg font-semibold">Override Booking Schedules</h3>
      <div className="space-y-2">
        {bookings.length === 0 && <div className="text-slate-500 text-sm">No bookings yet</div>}
        {bookings.map((b) => (
          <div key={b.id} className="flex items-center gap-3">
            <div className="min-w-[16rem] text-sm text-slate-700">
              <div className="font-medium">{fmtTimeRange(b.startTime, b.endTime)}</div>
              <div className="text-xs text-slate-500">{b.purpose}</div>
            </div>
            <select
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              value={b.status}
              onChange={(e) => updateStatus(b.id, e.target.value as BookingItem['status'])}
            >
              <option value="Booked">Booked</option>
              <option value="InUse">InUse</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="ml-auto rounded-xl bg-red-600 text-white px-3 py-1.5 text-sm hover:opacity-90" onClick={() => removeBooking(b.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

