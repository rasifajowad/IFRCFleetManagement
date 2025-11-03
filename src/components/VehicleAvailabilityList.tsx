import React from 'react';
import { BookingItem, Person, Vehicle } from '../types';
import { fmtTimeRange } from '../lib/time';

interface Props {
  vehicles: Vehicle[];
  bookings: BookingItem[];
  staff: Person[];
  drivers: Person[];
}

function getName(id: string, staff: Person[], drivers: Person[]) {
  return staff.find((s) => s.id === id)?.name || drivers.find((d) => d.id === id)?.name || id;
}

export default function VehicleAvailabilityList({ vehicles, bookings, staff, drivers }: Props) {
  const nowTs = Date.now();

  return (
    <div className="space-y-3">
      {vehicles.map((v) => {
        const current = bookings.find(
          (b) =>
            b.vehicleId === v.id &&
            b.status !== 'Completed' &&
            new Date(b.startTime).getTime() <= nowTs &&
            nowTs < new Date(b.endTime).getTime()
        );
        const next = bookings
          .filter(
            (b) => b.vehicleId === v.id && new Date(b.startTime).getTime() > nowTs && b.status !== 'Completed'
          )
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

        const badge = current
          ? 'bg-red-100 text-red-700'
          : next
          ? 'bg-amber-100 text-amber-700'
          : 'bg-emerald-100 text-emerald-700';

        const assigned = v.assignedDriverId ? (drivers.find((d) => d.id === v.assignedDriverId)?.name || v.assignedDriverId) : null;
        return (
          <div key={v.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm flex items-start gap-3">
            <div className="min-w-0">
              <div className="font-medium truncate">{v.name}</div>
              <div className="text-xs text-slate-500">{v.plate}</div>
              {assigned && <div className="text-xs text-slate-500">Assigned: {assigned}</div>}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${badge} ml-auto`}>
              {current ? 'In Use' : next ? 'Booked' : 'Available'}
            </span>
            <div className="w-full basis-full text-sm text-slate-600">
              {current ? (
                <div>
                  <div>
                    Now: {fmtTimeRange(current.startTime, current.endTime)} • {current.purpose}
                  </div>
                  <div className="text-xs text-slate-500">
                    Requester: {getName(current.requesterId, staff, drivers)}
                    {current.driverId ? ` • Driver: ${getName(current.driverId, staff, drivers)}` : ''}
                  </div>
                </div>
              ) : next ? (
                <div>
                  <div>
                    Next: {fmtTimeRange(next.startTime, next.endTime)} • {next.purpose}
                  </div>
                  <div className="text-xs text-slate-500">
                    Requester: {getName(next.requesterId, staff, drivers)}
                    {next.driverId ? ` • Driver: ${getName(next.driverId, staff, drivers)}` : ''}
                  </div>
                </div>
              ) : (
                <div className="text-slate-500">No bookings scheduled</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
