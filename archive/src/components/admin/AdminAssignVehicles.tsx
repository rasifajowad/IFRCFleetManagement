import React from 'react';
import { Person, Vehicle } from '../../types';

export default function AdminAssignVehicles({ vehicles, drivers, setVehicles }: { vehicles: Vehicle[]; drivers: Person[]; setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>> }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <h3 className="text-lg font-semibold">Assign Vehicles to Drivers</h3>
      <div className="space-y-2">
        {vehicles.map((v) => (
          <div key={v.id} className="flex items-center gap-3">
            <div className="min-w-[12rem]">
              <div className="font-medium">{v.name}</div>
              <div className="text-xs text-slate-500">{v.plate}</div>
            </div>
            <select
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              value={v.assignedDriverId || ''}
              onChange={(e) => setVehicles((prev) => prev.map((x) => (x.id === v.id ? { ...x, assignedDriverId: e.target.value || undefined } : x)))}
            >
              <option value="">Unassigned</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

