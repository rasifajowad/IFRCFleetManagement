import React from 'react';
import { BookingItem, Role, Vehicle } from '../types';
import { vehicleStatus } from '../utils/vehicleStatus';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button';

interface Props {
  vehicles: Vehicle[];
  bookings: BookingItem[];
  role: Role;
  setTab: (t: string) => void;
  setDraftReq: (updater: any) => void;
}

export default function VehicleCards({ vehicles, bookings, role, setTab, setDraftReq }: Props) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicles.map((v) => {
        const st = vehicleStatus(bookings, v.id);
        return (
          <Card key={v.id} className={
            st.label === "Available"
              ? "bg-lime-200"
              : st.label === "Booked (Active Window)"
              ? "bg-amber-200"
              : "bg-red-200"
          }>
            <CardHeader>
              <CardTitle>{v.name}</CardTitle>
                <CardDescription>{v.plate}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className={`text-sm px-2 py-1 rounded-full ${st.color}`}>{st.label}</span>
            </CardContent>
            <CardFooter>
              {role === 'staff' && (
              <Button onClick={() => {
                    setTab('My Requests');
                    setDraftReq((d: any) => ({ ...d, preferredVehicleId: v.id }));
                  }} variant={'destructive'} className='text-white bg-red-700'>
                    Request This Vehicle
                  </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
    
    // <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    //   {vehicles.map((v) => {
    //     const st = vehicleStatus(bookings, v.id);
    //     return (
    //       <div key={v.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition hover:-translate-y-px">
    //         <div className="flex items-center justify-between">
    //           <div>
    //             <div className="font-semibold">{v.name}</div>
    //             <div className="text-xs text-slate-500">{v.plate}</div>
    //           </div>
    //           <span className={`text-xs px-2 py-1 rounded-full ${st.color}`}>{st.label}</span>
    //         </div>
    //         <div className="mt-3 flex gap-2">
    //           {role === 'staff' && (
    //             <button
    //               onClick={() => {
    //                 setTab('My Requests');
    //                 setDraftReq((d: any) => ({ ...d, preferredVehicleId: v.id }));
    //               }}
    //               className="w-full rounded-xl bg-slate-900 text-white py-2 text-sm hover:opacity-90"
    //             >
    //               Request This Vehicle
    //             </button>
    //           )}
    //         </div>
    //       </div>
    //     );
    //   })}
    // </div>
  );
}

