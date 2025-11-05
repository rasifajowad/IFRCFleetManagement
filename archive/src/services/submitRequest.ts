import { BookingItem, RequestItem, Vehicle } from '../types';
import { overlaps, parseDT } from '../lib/time';

export type DraftRequest = {
  purpose: string;
  preferredVehicleId: string; // 'any' or id
  startTime: string; // datetime-local
  endTime: string; // datetime-local
  notes: string;
};

export function validateRequest(draft: DraftRequest, vehicles: Vehicle[], bookings: BookingItem[]) {
  if (!draft.purpose.trim()) return { ok: false, error: 'Please add a purpose.' } as const;
  const st = parseDT(draft.startTime);
  const et = parseDT(draft.endTime);
  if (!(st < et)) return { ok: false, error: 'Return time must be after pickup time.' } as const;

  const conflictsForVehicle = (vehicleId: string) =>
    bookings.some((b) => b.vehicleId === vehicleId && b.status !== 'Completed' && overlaps(new Date(b.startTime), new Date(b.endTime), st, et));

  if (draft.preferredVehicleId !== 'any') {
    if (conflictsForVehicle(draft.preferredVehicleId)) {
      return {
        ok: false,
        error:
          'That vehicle is already booked or in use during the selected time. Please choose another time or vehicle (or select Any). Only the Fleet Officer can override conflicts during assignment.',
      } as const;
    }
  } else {
    const anyFree = vehicles.some((v) => !conflictsForVehicle(v.id));
    if (!anyFree) return { ok: false, error: 'No vehicles are free for that time window. Please adjust the time.' } as const;
  }

  return { ok: true } as const;
}

export function makeRequest(draft: DraftRequest, requesterId: string): RequestItem {
  const st = parseDT(draft.startTime);
  const et = parseDT(draft.endTime);
  return {
    id: `R${Date.now()}`,
    requesterId,
    purpose: draft.purpose.trim(),
    preferredVehicleId: draft.preferredVehicleId,
    startTime: st.toISOString(),
    endTime: et.toISOString(),
    notes: draft.notes.trim(),
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
}

