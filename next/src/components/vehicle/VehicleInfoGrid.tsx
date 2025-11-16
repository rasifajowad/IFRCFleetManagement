"use client"
import Image from 'next/image'
import Link from 'next/link'
import { CardContainer, CardBody, CardItem } from '@/components/ui/three-d-card'
import { Badge } from '@/components/ui/badge'
import { VehicleInfo } from '@/components/vehicle/VehicleEditDialog'

const fallbackImage = '/LC70.png'

export default function VehicleInfoGrid({ vehicles }: { vehicles: VehicleInfo[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {vehicles.map(vehicle => (
        <Link key={vehicle.id} href={`/vehicle-info/${vehicle.id}`} className="text-left w-full">
          <CardContainer containerClassName="py-0" className="w-full h-full">
            <CardBody className="relative w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <CardItem className="absolute inset-0 rounded-3xl" translateZ={8}>{null}</CardItem>
              <div className="flex items-center justify-between">
                <CardItem translateZ={24} className="text-xl font-semibold text-slate-900">
                  {getModel(vehicle)}
                </CardItem>
                <CardItem translateZ={28}>
                  <Badge className={vehicle.assignedDriver ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                    {vehicle.assignedDriver ? 'Assigned' : 'Unassigned'}
                  </Badge>
                </CardItem>
              </div>
              <CardItem translateZ={16} className="mt-1 block text-slate-600">
                Reg: {getRegistration(vehicle)}
              </CardItem>
              <CardItem translateZ={36} className="mt-4 block w-full overflow-hidden rounded-2xl">
                <div className="relative h-40 w-full">
                  <Image
                    src={previewImage(vehicle)}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </CardItem>
              <div className="mt-4 flex items-center justify-between">
                <CardItem translateZ={16} className="text-sm text-slate-600">
                  Driver: {vehicle.assignedDriver?.name || 'Unassigned'}
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        </Link>
      ))}
    </div>
  )
}

const getModel = (v: VehicleInfo) => v.modelName || v.name || 'Vehicle'
const getRegistration = (v: VehicleInfo) => v.registrationNumber || v.plate || 'N/A'
const previewImage = (v: VehicleInfo) => v.primaryImageUrl || v.images?.[0]?.url || fallbackImage
