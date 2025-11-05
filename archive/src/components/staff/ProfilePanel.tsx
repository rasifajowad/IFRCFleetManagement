import React, { useMemo, useState } from 'react';
import { BookingItem, Person } from '../../types';

export default function ProfilePanel({
  role,
  activeUser,
  staff,
  setStaff,
  bookings,
}: {
  role: 'staff' | 'officer' | 'driver';
  activeUser: string;
  staff: Person[];
  setStaff: React.Dispatch<React.SetStateAction<Person[]>>;
  bookings: BookingItem[];
}) {
  const me = staff.find((s) => s.id === activeUser);
  const [name, setName] = useState(me?.name || '');

  const myHistory = useMemo(
    () => bookings.filter((b) => b.requesterId === activeUser).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()),
    [bookings, activeUser]
  );

  if (role !== 'staff') return <div className="text-slate-500 text-sm">Only staff can edit profile.</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">Edit Profile</h3>
        <div className="flex gap-2 items-end">
          <label className="flex-1 block">
            <span className="block text-sm mb-1 text-slate-600">Name</span>
            <input
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-slate-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <button
            className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90"
            onClick={() => {
              const n = name.trim();
              if (!n) return;
              setStaff((prev) => prev.map((s) => (s.id === activeUser ? { ...s, name: n } : s)));
              alert('Profile updated');
            }}
          >
            Save
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-3">History</h3>
        {myHistory.length === 0 && <div className="text-slate-500 text-sm">No past bookings</div>}
        <div className="space-y-2">
          {myHistory.map((b) => (
            <div key={b.id} className="text-sm text-slate-700">
              <span className="font-medium">{new Date(b.startTime).toLocaleString()}</span>
              <span className="text-slate-400"> → </span>
              <span className="font-medium">{new Date(b.endTime).toLocaleString()}</span>
              <span className="text-slate-400"> • </span>
              {b.purpose}
              {b.status === 'Completed' ? ' (Completed)' : b.status === 'InUse' ? ' (In Use)' : ' (Booked)'}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

