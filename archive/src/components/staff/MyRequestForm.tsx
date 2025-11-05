import React from 'react';
import { Vehicle } from '../../types';

interface Props {
  vehicles: Vehicle[];
  draftReq: { purpose: string; preferredVehicleId: string; startTime: string; endTime: string; notes: string };
  setDraftReq: (updater: any) => void;
  onSubmit: () => void;
}

export default function MyRequestForm({ vehicles, draftReq, setDraftReq, onSubmit }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <label className="block">
        <span className="block text-sm mb-1 text-slate-600">Purpose</span>
        <input
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          value={draftReq.purpose}
          onChange={(e) => setDraftReq((d: any) => ({ ...d, purpose: e.target.value }))}
          placeholder="e.g. Site visit, meeting"
        />
      </label>

      <label className="block">
        <span className="block text-sm mb-1 text-slate-600">Preferred Vehicle</span>
        <select
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          value={draftReq.preferredVehicleId}
          onChange={(e) => setDraftReq((d: any) => ({ ...d, preferredVehicleId: e.target.value }))}
        >
          <option value="any">Any</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} — {v.plate}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="block text-sm mb-1 text-slate-600">Pickup Time</span>
        <input
          type="datetime-local"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          value={draftReq.startTime}
          onChange={(e) => setDraftReq((d: any) => ({ ...d, startTime: e.target.value }))}
        />
      </label>

      <label className="block">
        <span className="block text-sm mb-1 text-slate-600">Return Time</span>
        <input
          type="datetime-local"
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          value={draftReq.endTime}
          onChange={(e) => setDraftReq((d: any) => ({ ...d, endTime: e.target.value }))}
        />
      </label>

      <label className="md:col-span-2 block">
        <span className="block text-sm mb-1 text-slate-600">Notes</span>
        <textarea
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
          rows={3}
          value={draftReq.notes}
          onChange={(e) => setDraftReq((d: any) => ({ ...d, notes: e.target.value }))}
        />
      </label>

      <div className="md:col-span-2">
        <button onClick={onSubmit} className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90">
          Submit Request
        </button>
      </div>
    </div>
  );
}

