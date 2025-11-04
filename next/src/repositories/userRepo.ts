import { prisma } from '@/lib/db'

export const UserRepo = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },
  async listDrivers() {
    return prisma.user.findMany({ where: { role: 'driver' as any }, orderBy: { name: 'asc' } })
  },
  async listStaff() {
    return prisma.user.findMany({ where: { role: 'staff' as any }, orderBy: { name: 'asc' } })
  },
  async createDriver(name: string) {
    return prisma.user.create({ data: { id: `d${Date.now()}`, name, role: 'driver' as any } })
  },
  async deleteById(id: string) {
    return prisma.user.delete({ where: { id } })
  },
}

