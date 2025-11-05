import React, { useEffect, useMemo, useState } from 'react';
// Shadcn UI styles live in index.css (imported in main.tsx)
import { BookingItem, Person, RequestItem, Role, Vehicle } from './types';
import { fmtDateTimeLocal } from './lib/time';
import RoleSwitcher from './components/RoleSwitcher';
import Empty from './components/Empty';
import { readStore, writeStore } from './hooks/useLocalStore';
import { seed } from './seed';
import VehicleCards from './components/VehicleCards';
import { validateRequest, makeRequest, DraftRequest } from './services/submitRequest';
import VehicleAvailabilityList from './components/VehicleAvailabilityList';
import ScheduleBoard from './components/ScheduleBoard';
import { buildCSVRows, buildCSVString, exportCSV } from './lib/csv';
import AdminCreateDriver from './components/admin/AdminCreateDriver';
import AdminAssignVehicles from './components/admin/AdminAssignVehicles';
import AdminOverrideBookings from './components/admin/AdminOverrideBookings';
import MyRequestForm from './components/staff/MyRequestForm';
import OfficerRequests from './components/requests/OfficerRequests';
import ManageVehiclesPanel from './components/officer/ManageVehiclesPanel';
import DriverTrips from './components/driver/DriverTrips';
import ProfilePanel from './components/staff/ProfilePanel';

export default function App() {
  const now = new Date();

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => readStore('cf_vehicles', seed.vehicles));
  const [drivers, setDrivers] = useState<Person[]>(() => readStore('cf_drivers', seed.drivers));
  const [staff, setStaff] = useState<Person[]>(() => readStore('cf_staff', seed.staff));
  const [requests, setRequests] = useState<RequestItem[]>(() => readStore('cf_requests', []));
  const [bookings, setBookings] = useState<BookingItem[]>(() => readStore('cf_bookings', []));

  useEffect(() => writeStore('cf_vehicles', vehicles), [vehicles]);
  useEffect(() => writeStore('cf_drivers', drivers), [drivers]);
  useEffect(() => writeStore('cf_staff', staff), [staff]);
  useEffect(() => writeStore('cf_requests', requests), [requests]);
  useEffect(() => writeStore('cf_bookings', bookings), [bookings]);

  const initialRole = readStore('cf_role', 'staff' as Role);
  const [role, setRole] = useState<Role>(initialRole);
  const [activeUser, setActiveUser] = useState<string>(() => {
    const saved = readStore<string | null>('cf_activeUser', null as any);
    if (saved) return saved;
    if (initialRole === 'staff') return seed.staff[0]?.id || 'u1';
    if (initialRole === 'driver') return seed.drivers[0]?.id || 'd1';
    return 'officer';
  });
  useEffect(() => writeStore('cf_role', role), [role]);
  useEffect(() => writeStore('cf_activeUser', activeUser), [activeUser]);

  const TABS = useMemo(() => {
    if (role === 'officer') return ['Dashboard', 'Schedule', 'Requests', 'Admin'] as const;
    if (role === 'driver') return ['My Trips', 'Schedule', 'Profile'] as const;
    return ['Dashboard', 'Schedule', 'My Requests', 'Profile'] as const;
  }, [role]);
  const [tab, setTab] = useState<string>(TABS[0] as string);
  useEffect(() => setTab(TABS[0] as string), [TABS]);

  // Schedule date navigation
  const [scheduleDate, setScheduleDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const shiftScheduleDate = (days: number) => {
    setScheduleDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + days);
      return d;
    });
  };

  const [draftReq, setDraftReq] = useState<DraftRequest>(() => ({
    purpose: '',
    preferredVehicleId: 'any',
    startTime: fmtDateTimeLocal(new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0)),
    endTime: fmtDateTimeLocal(new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 2, 0)),
    notes: '',
  }));
  const submitRequestHandler = () => {
    const res = validateRequest(draftReq, vehicles, bookings);
    if (!res.ok) return alert(res.error);
    const req: RequestItem = makeRequest(draftReq, activeUser);
    setRequests((prev) => [req, ...prev]);
    setDraftReq((d) => ({ ...d, purpose: '', notes: '' }));
    alert('Request submitted for approval.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-red-100 text-slate-800">
      <header className="sticky top-0 z-20 bg-gradient-to-r from-red-900 to-red-700 text-black shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <span className="text-xl font-semibold tracking-tight text-white">IFRC Fleet Management</span>
          <span className="ml-auto" />
          <RoleSwitcher role={role} setRole={setRole} staff={staff} drivers={drivers} activeUser={activeUser} setActiveUser={setActiveUser} />
        </div>
        <nav className="max-w-5xl mx-auto px-2 pb-3 flex gap-2 overflow-auto">
          {(TABS as readonly string[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-full text-sm border transition shadow-sm ${
                tab === t ? 'bg-white/15 border-white/20 text-white' : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {tab === 'Dashboard' && (
          <section className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Vehicle Availability</h2>
                <p className="text-slate-500 text-sm">Live view of vehicles and time windows</p>
              </div>
            </div>
            <VehicleCards vehicles={vehicles} bookings={bookings} role={role} setTab={setTab} setDraftReq={setDraftReq} />
            {role === 'officer' && <ManageVehiclesPanel vehicles={vehicles} setVehicles={setVehicles} />}
          </section>
        )}

        {tab === 'My Requests' && role === 'staff' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">New Request</h2>
              <p className="text-slate-500 text-sm">Request a vehicle and pickup/return time</p>
            </div>
            <MyRequestForm vehicles={vehicles} draftReq={draftReq} setDraftReq={setDraftReq} onSubmit={submitRequestHandler} />
          </section>
        )}

        {tab === 'Schedule' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Availability & Details</h2>
              <p className="text-slate-500 text-sm">Current/next bookings by vehicle</p>
            </div>
            <VehicleAvailabilityList vehicles={vehicles} bookings={bookings} staff={staff} drivers={drivers} />
            <div>
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">Schedule</h2>
                  <p className="text-slate-500 text-sm">Daily timeline across all vehicles</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" onClick={() => shiftScheduleDate(-1)}>Yesterday</button>
                  <button className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" onClick={() => setScheduleDate(() => { const d=new Date(); d.setHours(0,0,0,0); return d; })}>Today</button>
                  <button className="rounded-xl border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50" onClick={() => shiftScheduleDate(1)}>Tomorrow</button>
                </div>
              </div>
            </div>
            <ScheduleBoard vehicles={vehicles} bookings={bookings} date={scheduleDate} />
          </section>
        )}

        {tab === 'Requests' && role === 'officer' && (
          <OfficerRequests requests={requests} setRequests={setRequests} vehicles={vehicles} drivers={drivers} bookings={bookings} setBookings={setBookings} />
        )}

        {tab === 'Admin' && role === 'officer' && (
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Admin Tools</h2>
              <p className="text-slate-500 text-sm">Manage drivers, assignments, and schedules</p>
            </div>
            <AdminCreateDriver drivers={drivers} setDrivers={setDrivers} setActiveUser={setActiveUser} activeUser={activeUser} />
            <AdminAssignVehicles vehicles={vehicles} drivers={drivers} setVehicles={setVehicles} />
            <AdminOverrideBookings bookings={bookings} setBookings={setBookings} />

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Export Data</h3>
              <button
                className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:opacity-90"
                onClick={() => {
                  const completed = bookings.filter((b) => b.status === 'Completed');
                  const rows = buildCSVRows(completed, vehicles, drivers, staff);
                  const csv = buildCSVString(rows);
                  exportCSV(csv);
                }}
              >
                Export Completed Trips
              </button>
            </div>
          </section>
        )}

        {tab === 'My Trips' && role === 'driver' && (
          <DriverTrips activeUser={activeUser} bookings={bookings} setBookings={setBookings} vehicles={vehicles} drivers={drivers} staff={staff} />
        )}

        {tab === 'Profile' && (
          role === 'staff' ? (
            <ProfilePanel role={role} activeUser={activeUser} staff={staff} setStaff={setStaff} bookings={bookings} />
          ) : (
            <Empty text="Nothing to edit here." />
          )
        )}
      </main>
    </div>
  );
}
