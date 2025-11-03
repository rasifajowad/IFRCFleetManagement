import React, { useState } from 'react';
import { BookingItem, Person, RequestItem, Vehicle } from '../../types';
import Empty from '../Empty';
import { fmtDateTimeLocal } from '../../lib/time';
import { approveAndAssign as approveAndAssignSvc } from '../../services/approveAndAssign';

interface Props {
  requests: RequestItem[];
  setRequests: React.Dispatch<React.SetStateAction<RequestItem[]>>;
  vehicles: Vehicle[];
  drivers: Person[];
  bookings: BookingItem[];
  setBookings: React.Dispatch<React.SetStateAction<BookingItem[]>>;
}

export default function OfficerRequests({ requests, setRequests, vehicles, drivers, bookings, setBookings }: Props) {
  const [assignCtx, setAssignCtx] = useState<null | { reqId: string; vehicleId: string; driverId: string; override: boolean }>(null);

  const pending = requests.filter((r) => r.status === 'Pending');

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Pending Requests</h2>
        <p className="text-slate-500 text-sm">Approve and assign vehicles and drivers</p>
      </div>

      <div className="space-y-4">
        {pending.length === 0 && <Empty text="No pending requests" />}

        {pending.map((req) => (
          <div key={req.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm text-slate-700">
              <span className="font-medium">Purpose:</span> {req.purpose}
            </div>
            <div className="text-xs text-slate-500">
              Time: {fmtDateTimeLocal(req.startTime)} → {fmtDateTimeLocal(req.endTime)}
            </div>
            <div className="mt-3 grid sm:grid-cols-3 gap-3 items-end">
              <label className="block">
                <span className="block text-xs text-slate-600 mb-1">Vehicle</span>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                  value={assignCtx?.reqId === req.id ? assignCtx.vehicleId : req.preferredVehicleId !== 'any' ? req.preferredVehicleId : vehicles[0]?.id || ''}
                  onChange={(e) => setAssignCtx({ reqId: req.id, vehicleId: e.target.value, driverId: assignCtx?.driverId || drivers[0]?.id || '', override: !!assignCtx?.override })}
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — {v.plate}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-xs text-slate-600 mb-1">Driver</span>
                <select
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                  value={assignCtx?.reqId === req.id ? assignCtx.driverId : drivers[0]?.id || ''}
                  onChange={(e) => setAssignCtx({ reqId: req.id, vehicleId: assignCtx?.vehicleId || vehicles[0]?.id || '', driverId: e.target.value, override: !!assignCtx?.override })}
                >
                  {drivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="block text-xs text-slate-600 mb-1">Options</span>
                <div className="flex items-center gap-2">
                  <input
                    id={`ovr-${req.id}`}
                    type="checkbox"
                    className="rounded"
                    checked={assignCtx?.reqId === req.id ? !!assignCtx.override : false}
                    onChange={(e) => setAssignCtx({ reqId: req.id, vehicleId: assignCtx?.vehicleId || vehicles[0]?.id || '', driverId: assignCtx?.driverId || drivers[0]?.id || '', override: e.target.checked })}
                  />
                  <label htmlFor={`ovr-${req.id}`} className="text-sm text-slate-700">
                    Override conflicts
                  </label>
                </div>
              </label>
            </div>
            <div className="mt-3">
              <button
                className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90"
                onClick={() => {
                  const vehicleId = assignCtx?.reqId === req.id ? assignCtx.vehicleId : req.preferredVehicleId !== 'any' ? req.preferredVehicleId : vehicles[0]?.id || '';
                  const driverId = assignCtx?.reqId === req.id ? assignCtx.driverId : drivers[0]?.id || '';
                  const override = assignCtx?.reqId === req.id ? !!assignCtx.override : false;
                  const res = approveAndAssignSvc(req, vehicleId, driverId, override, bookings);
                  if (!res.ok) return alert(res.error);
                  setBookings((prev) => [res.booking, ...prev]);
                  setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: 'Approved' } : r)));
                  setAssignCtx(null);
                  alert('Approved & assigned.');
                }}
              >
                Approve & Assign
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

