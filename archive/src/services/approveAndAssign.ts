import { BookingItem, RequestItem } from '../types';
import { overlaps } from '../lib/time';

export function approveAndAssign(
  req: RequestItem,
  vehicleId: string,
  driverId: string,
  override: boolean,
  bookings: BookingItem[]
): { ok: true; booking: BookingItem } | { ok: false; error: string } {
  const conflict = bookings.some(
    (b) =>
      b.vehicleId === vehicleId &&
      b.status !== 'Completed' &&
      overlaps(new Date(b.startTime), new Date(b.endTime), new Date(req.startTime), new Date(req.endTime))
  );
  if (conflict && !override) {
    return { ok: false, error: "Time conflict detected. Tick 'Override conflicts' to force-assign." } as const;
  }

  const booking: BookingItem = {
    id: `B${Date.now()}`,
    requestId: req.id,
    vehicleId,
    driverId,
    requesterId: req.requesterId,
    purpose: req.purpose,
    startTime: req.startTime,
    endTime: req.endTime,
    status: 'Booked',
    notes: req.notes,
    override: !!override,
    createdAt: new Date().toISOString(),
  };

  return { ok: true, booking } as const;
}

