import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import SectionHeader from '@/components/aceternity/SectionHeader'
import VehicleInfoGrid from '@/components/vehicle/VehicleInfoGrid'
import { VehicleAddButton } from '@/components/vehicle/VehicleEditDialog'

export const dynamic = 'force-dynamic'

export default async function VehicleInfoPage() {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-slate-600">Only fleet officers can view vehicle information.</p>
      </main>
    )
  }

  const vehicles = await prisma.vehicle.findMany({
    include: {
      assignedDriver: true,
      images: { select: { id: true, url: true }, orderBy: { createdAt: 'asc' } },
    },
    orderBy: { name: 'asc' },
  })
  const drivers = await prisma.user.findMany({ where: { role: 'driver' }, select: { id: true, name: true }, orderBy: { name: 'asc' } })

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="Vehicle Info" subtitle="Browse detailed information for each vehicle" />
        <VehicleAddButton drivers={drivers} />
      </div>
      <VehicleInfoGrid vehicles={vehicles as any} />
    </main>
  )
}
