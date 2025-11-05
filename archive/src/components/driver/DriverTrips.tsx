import React, { useMemo, useState } from 'react';
import { BookingItem, Person, Vehicle } from '../../types';
import Empty from '../Empty';
import { seed } from '../../seed';

interface Props {
  activeUser: string;
  bookings: BookingItem[];
  setBookings: React.Dispatch<React.SetStateAction<BookingItem[]>>;
  vehicles: Vehicle[];
  drivers: Person[];
  staff: Person[];
}

export default function DriverTrips({ activeUser, bookings, setBookings, vehicles, drivers, staff }: Props) {
  const driverBookings = useMemo(
    () => bookings.filter((b) => b.driverId === activeUser && b.status !== 'Completed').sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    [bookings, activeUser]
  );
  const [startSel, setStartSel] = useState<Record<string, string>>({});
  const [startOther, setStartOther] = useState<Record<string, string>>({});
  const [endSel, setEndSel] = useState<Record<string, string>>({});
  const [endOther, setEndOther] = useState<Record<string, string>>({});

  const startTrip = (id: string) => {
    const sel = startSel[id] || '';
    const loc = sel === 'Other' ? (startOther[id] || '').trim() : sel;
    if (!loc) return alert('Please select a start location.');
    const odoStr = prompt('Enter starting odometer reading');
    if (odoStr === null) return;
    const odo = Number(odoStr);
    if (!isFinite(odo)) return alert('Please enter a valid odometer reading.');
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'InUse', actualStart: new Date().toISOString(), startLocation: loc, odometerStart: odo } : b)));
  };
  const endTrip = (id: string) => {
    const current = bookings.find((b) => b.id === id);
    const sel = endSel[id] || '';
    const loc = sel === 'Other' ? (endOther[id] || '').trim() : sel;
    if (!loc) return alert('Please select an end location.');
    const odoStr = prompt('Enter ending odometer reading');
    if (odoStr === null) return;
    const odo = Number(odoStr);
    if (!isFinite(odo)) return alert('Please enter a valid odometer reading.');
    if (current && typeof current.odometerStart === 'number' && odo < current.odometerStart) {
      return alert('Ending odometer cannot be less than starting odometer.');
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'Completed', actualEnd: new Date().toISOString(), endLocation: loc, odometerEnd: odo } : b)));
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">My Trips</h2>
        <p className="text-slate-500 text-sm">Start and end assigned trips</p>
      </div>

      {driverBookings.length === 0 && <Empty text="No active or upcoming trips" />}

      <div className="space-y-3">
        {driverBookings.map((b) => (
          <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-slate-700">
              <span className="font-medium">{vehicles.find((v) => v.id === b.vehicleId)?.name || b.vehicleId}</span>
              <span className="text-slate-400"> • </span>
              {new Date(b.startTime).toLocaleString()} → {new Date(b.endTime).toLocaleString()}
            </div>
            <div className="text-xs text-slate-500">{b.purpose}</div>

            {b.status === 'Booked' && (
              <div className="mt-3 grid sm:grid-cols-3 gap-3 items-end">
                <label className="block">
                  <span className="block text-xs text-slate-600 mb-1">Start Location</span>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                    value={startSel[b.id] || ''}
                    onChange={(e) => setStartSel((prev) => ({ ...prev, [b.id]: e.target.value }))}
                  >
                    <option value="">Select…</option>
                    {seed.locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                    <option value="Other">Other…</option>
                  </select>
                </label>
                {startSel[b.id] === 'Other' && (
                  <label className="block sm:col-span-2">
                    <span className="block text-xs text-slate-600 mb-1">Other (Start)</span>
                    <input
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                      value={startOther[b.id] || ''}
                      onChange={(e) => setStartOther((prev) => ({ ...prev, [b.id]: e.target.value }))}
                    />
                  </label>
                )}
                <div className="sm:col-span-3">
                  <button className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90" onClick={() => startTrip(b.id)}>
                    Start Trip
                  </button>
                </div>
              </div>
            )}

            {b.status === 'InUse' && (
              <div className="mt-3 grid sm:grid-cols-3 gap-3 items-end">
                <label className="block">
                  <span className="block text-xs text-slate-600 mb-1">End Location</span>
                  <select
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                    value={endSel[b.id] || ''}
                    onChange={(e) => setEndSel((prev) => ({ ...prev, [b.id]: e.target.value }))}
                  >
                    <option value="">Select…</option>
                    {seed.locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                    <option value="Other">Other…</option>
                  </select>
                </label>
                {endSel[b.id] === 'Other' && (
                  <label className="block sm:col-span-2">
                    <span className="block text-xs text-slate-600 mb-1">Other (End)</span>
                    <input
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                      value={endOther[b.id] || ''}
                      onChange={(e) => setEndOther((prev) => ({ ...prev, [b.id]: e.target.value }))}
                    />
                  </label>
                )}
                <div className="sm:col-span-3">
                  <button className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90" onClick={() => endTrip(b.id)}>
                    End Trip
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
