import { BookingItem } from '../types';
import { fmtTimeRange } from '../lib/time';

export function vehicleStatus(bookings: BookingItem[], vehicleId: string) {
  const nowTs = Date.now();
  const active = bookings.find(
    (b) =>
      b.vehicleId === vehicleId &&
      b.status !== 'Completed' &&
      new Date(b.startTime).getTime() <= nowTs &&
      nowTs < new Date(b.endTime).getTime()
  );
  if (active && active.status === 'InUse') return { label: 'In Use', color: 'bg-red-100 text-red-700', until: active.endTime };
  if (active) return { label: 'Booked (Active Window)', color: 'bg-amber-100 text-amber-700', until: active.endTime };

  const next = bookings
    .filter((b) => b.vehicleId === vehicleId && new Date(b.startTime).getTime() > nowTs && b.status !== 'Completed')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
  if (next) return { label: `Booked ${fmtTimeRange(next.startTime, next.endTime)}`, color: 'bg-amber-100 text-amber-700', until: next.startTime };
  return { label: 'Available', color: 'bg-emerald-100 text-emerald-700', until: null as string | null };
}

