import { prisma } from '@/lib/db'

export const UserRepo = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  },
  async findById(id: string) {
    return prisma.user.findUnique({ where: { id } })
  },
  async countOfficers() {
    return prisma.user.count({ where: { role: 'officer' as any, active: true } })
  },
  async listDrivers() {
    return prisma.user.findMany({ where: { role: 'driver' as any }, orderBy: { name: 'asc' } })
  },
  async listAll() {
    return prisma.user.findMany({ orderBy: { name: 'asc' } })
  },
  async listStaff() {
    return prisma.user.findMany({ where: { role: 'staff' as any }, orderBy: { name: 'asc' } })
  },
  async createDriver(name: string) {
    return prisma.user.create({ data: { id: `d${Date.now()}`, name, role: 'driver' as any } })
  },
  async updateById(id: string, data: any) {
    return prisma.user.update({ where: { id }, data })
  },
  async deleteById(id: string) {
    return prisma.user.delete({ where: { id } })
  },
}
