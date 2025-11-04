import { prisma } from '@/lib/db'

export const BookingRepo = {
  async findConflict(vehicleId: string, startTime: Date, endTime: Date) {
    return prisma.booking.findFirst({
      where: {
        vehicleId,
        status: { not: 'Completed' },
        AND: [
          { endTime: { gt: startTime } },
          { startTime: { lt: endTime } },
        ],
      },
      select: { id: true },
    })
  },
  async create(data: any) {
    return prisma.booking.create({ data })
  },
  async findById(id: string) {
    return prisma.booking.findUnique({ where: { id } })
  },
  async update(id: string, data: any) {
    return prisma.booking.update({ where: { id }, data })
  },
  async reassignOpenForDriver(fromDriverId: string, toDriverId: string) {
    return prisma.booking.updateMany({ where: { driverId: fromDriverId, status: { not: 'Completed' } }, data: { driverId: toDriverId } })
  },
  async hasAnyForDriver(driverId: string) {
    const c = await prisma.booking.count({ where: { driverId } })
    return c > 0
  },
  async hasAnyForRequester(requesterId: string) {
    const c = await prisma.booking.count({ where: { requesterId } })
    return c > 0
  },
  async completeOpenForDriver(driverId: string) {
    return prisma.booking.updateMany({ where: { driverId, status: { not: 'Completed' } }, data: { status: 'Completed' } })
  },
  async deleteById(id: string) {
    return prisma.booking.delete({ where: { id } })
  },
}
