import React, { useState } from 'react';
import { Person } from '../../types';

export default function AdminCreateDriver({
  drivers,
  setDrivers,
  setActiveUser,
  activeUser,
}: {
  drivers: Person[];
  setDrivers: React.Dispatch<React.SetStateAction<Person[]>>;
  setActiveUser?: (id: string) => void;
  activeUser?: string;
}) {
  const [name, setName] = useState('');
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <h3 className="text-lg font-semibold">Drivers</h3>
      <div className="flex gap-2">
        <input
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300 flex-1"
          placeholder="Driver name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90"
          onClick={() => {
            const n = name.trim();
            if (!n) return;
            const d: Person = { id: `d${Date.now()}`, name: n };
            setDrivers((prev) => [...prev, d]);
            setName('');
          }}
        >
          Add Driver
        </button>
      </div>

      <div className="divide-y divide-slate-200">
        {drivers.map((d) => (
          <div key={d.id} className="py-2 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{d.name}</div>
              <div className="text-xs text-slate-500">{d.id}</div>
            </div>
            <button
              className="rounded-xl bg-red-600 text-white px-3 py-1.5 text-sm hover:opacity-90"
              onClick={() => {
                setDrivers((prev) => prev.filter((x) => x.id !== d.id));
                if (setActiveUser && activeUser === d.id) {
                  const next = drivers.find((x) => x.id !== d.id)?.id || '';
                  setActiveUser(next || '');
                }
              }}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="text-xs text-slate-500">Total drivers: {drivers.length}</div>
    </div>
  );
}
