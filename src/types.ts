export type Role = 'staff' | 'officer' | 'driver';


export interface Vehicle {
id: string;
name: string;
plate: string;
assignedDriverId?: string;
}


export interface Person {
id: string;
name: string;
}


export interface RequestItem {
id: string;
requesterId: string;
purpose: string;
preferredVehicleId: string; // 'any' or vehicle id
startTime: string; // ISO
endTime: string; // ISO
notes: string;
status: 'Pending' | 'Approved';
createdAt: string; // ISO
}


export interface BookingItem {
id: string;
requestId: string;
vehicleId: string;
driverId: string;
requesterId: string;
purpose: string;
startTime: string; // ISO
endTime: string; // ISO
status: 'Booked' | 'InUse' | 'Completed';
notes: string;
override: boolean;
createdAt: string; // ISO
actualStart?: string; // ISO
actualEnd?: string; // ISO
startLocation?: string;
endLocation?: string;
odometerStart?: number;
odometerEnd?: number;
}
