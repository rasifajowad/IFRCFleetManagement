import { BookingItem, Person, Vehicle } from '../types';


export function buildCSVRows(
bookings: BookingItem[],
vehicles: Vehicle[],
drivers: Person[],
staff: Person[]
) {
return bookings.map((b) => [
b.id,
b.requestId,
vehicles.find((v) => v.id === b.vehicleId)?.name || b.vehicleId,
drivers.find((d) => d.id === b.driverId)?.name || b.driverId,
staff.find((s) => s.id === b.requesterId)?.name || b.requesterId,
b.purpose,
new Date(b.startTime).toLocaleString(),
new Date(b.endTime).toLocaleString(),
b.status,
b.actualStart ? new Date(b.actualStart).toLocaleString() : '',
b.actualEnd ? new Date(b.actualEnd).toLocaleString() : '',
b.startLocation || '',
b.endLocation || '',
b.odometerStart ?? '',
b.odometerEnd ?? '',
(b.notes || '').replaceAll('\n', ' '),
b.override ? 'YES' : 'NO',
]);
}


export function buildCSVString(rows: any[]) {
const headers = [
'Booking ID',
'Request ID',
'Vehicle',
'Driver',
'Requester',
'Purpose',
'Start Time',
'End Time',
'Status',
'Actual Start',
'Actual End',
'Start Location',
'End Location',
'Odometer Start',
'Odometer End',
'Notes',
'Override',
];
return [headers, ...rows]
.map((r) => r.map((x: unknown) => `"${String(x).replaceAll('"', '""')}"`).join(','))
.join('\n');
}


export function exportCSV(csv: string) {
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `fleet_bookings_${new Date().toISOString().slice(0, 10)}.csv`;
a.click();
URL.revokeObjectURL(url);
}
