import { prisma } from '@/lib/db'

export const RequestRepo = {
  async create(data: {
    id: string
    requesterId: string
    purpose: string
    startLocation: string
    destination: string
    startTime: Date
    endTime: Date
    notes: string
    status: string
    createdAt: Date
  }) {
    return prisma.request.create({ data })
  },
  async findById(id: string) {
    return prisma.request.findUnique({ where: { id } })
  },
  async updateStatus(id: string, status: string) {
    return prisma.request.update({ where: { id }, data: { status } })
  },
  async listPending() {
    return prisma.request.findMany({ where: { status: 'Pending' }, orderBy: { createdAt: 'desc' } })
  },
}
