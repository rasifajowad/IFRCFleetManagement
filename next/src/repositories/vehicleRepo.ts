import { prisma } from '@/lib/db'

export const VehicleRepo = {
  async listAll() {
    return prisma.vehicle.findMany({ orderBy: { name: 'asc' } })
  },
  async listWithAssignee() {
    return prisma.vehicle.findMany({ include: { assignedDriver: true }, orderBy: { name: 'asc' } })
  },
  async updateAssignedDriver(vehicleId: string, driverId: string | null) {
    return prisma.vehicle.update({ where: { id: vehicleId }, data: { assignedDriverId: driverId } })
  },
}

