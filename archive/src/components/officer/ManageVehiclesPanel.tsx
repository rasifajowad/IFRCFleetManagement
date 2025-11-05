import React from 'react';
import { Vehicle } from '../../types';

export default function ManageVehiclesPanel({ vehicles, setVehicles }: { vehicles: Vehicle[]; setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>> }) {
  const [newVeh, setNewVeh] = React.useState({ name: '', plate: '' });
  const [editing, setEditing] = React.useState<string | null>(null);
  const [editVals, setEditVals] = React.useState<{ name: string; plate: string }>({ name: '', plate: '' });
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <h3 className="text-lg font-semibold">Manage Vehicles</h3>
      <div className="flex flex-wrap gap-2 items-end">
        <label className="block">
          <span className="block text-xs text-slate-600 mb-1">Name</span>
          <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300" value={newVeh.name} onChange={(e) => setNewVeh((p) => ({ ...p, name: e.target.value }))} />
        </label>
        <label className="block">
          <span className="block text-xs text-slate-600 mb-1">Plate</span>
          <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300" value={newVeh.plate} onChange={(e) => setNewVeh((p) => ({ ...p, plate: e.target.value }))} />
        </label>
        <button
          className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm hover:opacity-90"
          onClick={() => {
            const name = newVeh.name.trim();
            const plate = newVeh.plate.trim();
            if (!name || !plate) return;
            const v: Vehicle = { id: `v${Date.now()}`, name, plate };
            setVehicles((prev) => [...prev, v]);
            setNewVeh({ name: '', plate: '' });
          }}
        >
          Add Vehicle
        </button>
      </div>
      <div className="divide-y divide-slate-200">
        {vehicles.map((v) => (
          <div key={v.id} className="py-2 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              {editing === v.id ? (
                <div className="flex gap-2">
                  <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300" value={editVals.name} onChange={(e) => setEditVals((p) => ({ ...p, name: e.target.value }))} />
                  <input className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300" value={editVals.plate} onChange={(e) => setEditVals((p) => ({ ...p, plate: e.target.value }))} />
                </div>
              ) : (
                <>
                  <div className="font-medium truncate">{v.name}</div>
                  <div className="text-xs text-slate-500">{v.plate}</div>
                </>
              )}
            </div>
            {editing === v.id ? (
              <>
                <button
                  className="rounded-xl bg-slate-900 text-white px-3 py-1.5 text-sm hover:opacity-90"
                  onClick={() => {
                    const name = editVals.name.trim();
                    const plate = editVals.plate.trim();
                    if (!name || !plate) return;
                    setVehicles((prev) => prev.map((x) => (x.id === v.id ? { ...x, name, plate } : x)));
                    setEditing(null);
                  }}
                >
                  Save
                </button>
                <button className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
                  onClick={() => {
                    setEditing(v.id);
                    setEditVals({ name: v.name, plate: v.plate });
                  }}
                >
                  Edit
                </button>
                <button className="rounded-xl bg-red-600 text-white px-3 py-1.5 text-sm hover:opacity-90" onClick={() => setVehicles((prev) => prev.filter((x) => x.id !== v.id))}>
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
