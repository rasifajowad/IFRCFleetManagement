"use server"
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { BookingRepo } from '@/repositories/bookingRepo'
import { VehicleRepo } from '@/repositories/vehicleRepo'
import { UserRepo } from '@/repositories/userRepo'
import {
  AddDriverSchema,
  RemoveDriverSchema,
  AssignVehicleDriverSchema,
  UpdateBookingStatusSchema,
  DeleteBookingSchema,
  AdminUpdateUserSchema,
  AdminChangeRoleSchema,
  AdminDeleteUserSchema,
} from '@/validation/schemas'

export async function addDriver(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = AddDriverSchema.safeParse(raw)
  if (!parsed.success) return
  await UserRepo.createDriver(parsed.data.name)
  revalidatePath('/admin')
}

export async function removeDriver(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = RemoveDriverSchema.safeParse(raw)
  if (!parsed.success) return
  const id = parsed.data.driverId
  await prisma.$transaction([
    prisma.vehicle.updateMany({ where: { assignedDriverId: id }, data: { assignedDriverId: null } }),
    prisma.booking.updateMany({ where: { driverId: id, status: { not: 'Completed' } }, data: { status: 'Completed' } }),
    prisma.user.delete({ where: { id } })
  ])
  revalidatePath('/admin')
  revalidatePath('/schedule')
}

export async function assignVehicleDriver(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = AssignVehicleDriverSchema.safeParse(raw)
  if (!parsed.success) return
  await VehicleRepo.updateAssignedDriver(parsed.data.vehicleId, parsed.data.driverId ?? null)
  revalidatePath('/admin')
}

export async function updateBookingStatus(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = UpdateBookingStatusSchema.safeParse(raw)
  if (!parsed.success) return
  await BookingRepo.update(parsed.data.bookingId, { status: parsed.data.status })
  revalidatePath('/admin')
  revalidatePath('/schedule')
}

export async function deleteBooking(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = DeleteBookingSchema.safeParse(raw)
  if (!parsed.success) return
  await BookingRepo.deleteById(parsed.data.bookingId)
  revalidatePath('/admin')
  revalidatePath('/schedule')
}

export async function adminUpdateUser(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = AdminUpdateUserSchema.safeParse(raw)
  if (!parsed.success) return
  const { id, ...data } = parsed.data
  await prisma.user.update({ where: { id }, data })
  revalidatePath('/admin/members')
}

export async function adminChangeRole(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = AdminChangeRoleSchema.safeParse(raw)
  if (!parsed.success) return
  const { id, role, reassignToDriverId } = parsed.data
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return
  if (user.role === 'officer' && role !== 'officer') {
    const count = await prisma.user.count({ where: { role: 'officer' as any, active: true } })
    if (count <= 1) return // prevent removing last officer
  }
  if (user.role === 'driver' && role !== 'driver') {
    if (!reassignToDriverId) return
    await prisma.$transaction([
      prisma.vehicle.updateMany({ where: { assignedDriverId: id }, data: { assignedDriverId: reassignToDriverId } }),
      prisma.booking.updateMany({ where: { driverId: id, status: { not: 'Completed' } }, data: { driverId: reassignToDriverId } }),
      prisma.user.update({ where: { id }, data: { role } })
    ])
  } else {
    await prisma.user.update({ where: { id }, data: { role } })
  }
  revalidatePath('/admin/members')
  revalidatePath('/admin')
}

export async function adminDeleteUser(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = AdminDeleteUserSchema.safeParse(raw)
  if (!parsed.success) return
  const { id } = parsed.data
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return
  if (user.role === 'officer') {
    const count = await prisma.user.count({ where: { role: 'officer' as any, active: true } })
    if (count <= 1) return // prevent deleting last officer
  }
  const blocks = await prisma.booking.count({ where: { OR: [{ driverId: id }, { requesterId: id }] } })
  if (blocks > 0) return
  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/members')
}

