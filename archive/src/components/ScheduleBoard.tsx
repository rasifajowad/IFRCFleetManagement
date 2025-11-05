import React, { useMemo } from 'react';
import { BookingItem, Vehicle } from '../types';
import { fmtTimeRange } from '../lib/time';

interface Props {
  vehicles: Vehicle[];
  bookings: BookingItem[];
  date?: Date; // base date (default today)
  startHour?: number; // default 8
  endHour?: number; // default 20
}

export default function ScheduleBoard({ vehicles, bookings, date, startHour = 8, endHour = 20 }: Props) {
  const start = useMemo(() => {
    const d = new Date(date || new Date());
    d.setHours(startHour, 0, 0, 0);
    return d;
  }, [date, startHour]);
  const end = useMemo(() => {
    const d = new Date(date || new Date());
    d.setHours(endHour, 0, 0, 0);
    return d;
  }, [date, endHour]);
  const total = end.getTime() - start.getTime();
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => startHour + i);

  const rows = useMemo(() => {
    const map: Record<string, BookingItem[]> = Object.fromEntries(vehicles.map((v) => [v.id, [] as BookingItem[]]));
    bookings.forEach((b) => {
      const st = new Date(b.startTime);
      const et = new Date(b.endTime);
      if (et >= start && st <= end) {
        map[b.vehicleId]?.push(b);
      }
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()));
    return map;
  }, [vehicles, bookings, start.getTime(), end.getTime()]);

  const pct = (d: string) => {
    const ms = new Date(d).getTime();
    return Math.min(100, Math.max(0, ((ms - start.getTime()) / total) * 100));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative">
        {/* hour grid */}
        <div className="flex text-xs text-slate-500">
          {hours.map((h) => (
            <div key={h} className="flex-1 text-center">
              {h}:00
            </div>
          ))}
        </div>
        <div className="absolute left-0 right-0 top-4 bottom-0 grid" style={{ gridTemplateColumns: `repeat(${hours.length - 1}, 1fr)` }}>
          {hours.slice(0, -1).map((h) => (
            <div key={h} className="border-l border-dashed border-slate-200" />
          ))}
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {vehicles.map((v) => (
          <div key={v.id} className="">
            <div className="text-sm font-medium text-slate-700 mb-1">{v.name}</div>
            <div className="relative h-10 rounded-lg bg-slate-50 overflow-hidden border border-slate-200">
              {(rows[v.id] || []).map((b) => (
                <div
                  key={b.id}
                  className={`absolute top-1 h-8 rounded-md px-2 text-xs flex items-center gap-1 ${
                    b.status === 'InUse'
                      ? 'bg-red-100 text-red-700'
                      : b.status === 'Booked'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                  style={{ left: `${pct(b.startTime)}%`, width: `${Math.max(5, pct(b.endTime) - pct(b.startTime))}%` }}
                  title={`${fmtTimeRange(b.startTime, b.endTime)} — ${b.purpose}`}
                >
                  <span className="truncate">{fmtTimeRange(b.startTime, b.endTime)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
