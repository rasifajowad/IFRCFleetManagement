import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import SectionHeader from '@/components/aceternity/SectionHeader'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import VehicleDetailActions from '@/components/vehicle/VehicleDetailActions'
import { VehicleInfo } from '@/components/vehicle/VehicleEditDialog'

export const dynamic = 'force-dynamic'

export default async function VehicleDetailPage({ params }: { params: Promise<{ vehicleId: string }> }) {
  const { vehicleId } = await params
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-slate-600">Only fleet officers can view vehicle information.</p>
      </main>
    )
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
    include: {
      assignedDriver: true,
      images: { select: { id: true, url: true }, orderBy: { createdAt: 'asc' } },
    },
  })
  if (!vehicle) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Vehicle not found</h1>
        <Link href="/vehicle-info" className="text-slate-600 underline">Back to Vehicle Info</Link>
      </main>
    )
  }

  const drivers = await prisma.user.findMany({ where: { role: 'driver' }, select: { id: true, name: true }, orderBy: { name: 'asc' } })
  const odometerAgg = await prisma.booking.aggregate({ _max: { odometerEnd: true }, where: { vehicleId } as any })
  const currentOdometer = odometerAgg?._max?.odometerEnd ?? null
  const infoRows: Array<{ label: string; value: string }> = [
    { label: 'Registration Number', value: vehicle.registrationNumber || vehicle.plate || 'N/A' },
    { label: 'IFRC Vehicle Code', value: vehicle.ifrcCode || '-' },
    { label: 'Organization', value: vehicle.organizationName || '-' },
    { label: 'Model', value: vehicle.modelName || vehicle.name },
    { label: 'Engine Number', value: vehicle.engineNumber || '-' },
    { label: 'Engine Capacity', value: vehicle.engineCapacity || '-' },
    { label: 'Chassis Number', value: vehicle.chassisNumber || '-' },
    { label: 'Year of Manufacture', value: vehicle.yearManufacture ? String(vehicle.yearManufacture) : '-' },
    { label: 'Deployed Area', value: vehicle.deployedArea || '-' },
    { label: 'Contract Expiry', value: formatDate(vehicle.contractExpiry) },
    { label: 'Registration Expiry', value: formatDate(vehicle.registrationExpiry) },
    { label: 'Driver Assigned', value: vehicle.assignedDriver?.name || 'Unassigned' },
  ]

  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <Link href="/vehicle-info" className="inline-flex w-fit items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100">Back to Vehicle Info</Link>
      <SectionHeader title={vehicle.modelName || vehicle.name} subtitle={vehicle.registrationNumber || vehicle.plate || 'Vehicle detail'} />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="lg:w-1/3 space-y-3">
              <div className="overflow-hidden rounded-2xl border">
                <div className="relative h-64 w-full">
                  <Image src={vehicle.primaryImageUrl || vehicle.images?.[0]?.url || '/LC70.png'} alt={vehicle.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 480px" />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 text-center">
                <div className="text-xs uppercase tracking-wide text-slate-500">Current Odometer</div>
                <div className="mt-1 text-2xl font-semibold text-slate-900">{currentOdometer ?? '-'}</div>
              </div>
              {vehicle.images && vehicle.images.length > 1 && (
                <div className="grid grid-cols-3 gap-2">
                  {vehicle.images.slice(1).map((img: (typeof vehicle.images)[number]) => (
                    <div key={img.id} className="relative h-20 w-full overflow-hidden rounded-xl border">
                      <Image src={img.url} alt="Vehicle" fill className="object-cover" sizes="120px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {infoRows.map(row => (
                  <div key={row.label} className="rounded-2xl border border-slate-200 p-4">
                    <dt className="text-xs uppercase tracking-wide text-slate-500">{row.label}</dt>
                    <dd className="text-base font-semibold text-slate-900 mt-1">{row.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex justify-end">
                <VehicleDetailActions vehicle={vehicle as VehicleInfo} drivers={drivers} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

function formatDate(value?: Date | string | null) {
  return value ? new Date(value).toLocaleDateString() : '-'
}
