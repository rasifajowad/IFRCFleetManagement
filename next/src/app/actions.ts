"use server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { BookingRepo } from "@/repositories/bookingRepo"
import { RequestRepo } from "@/repositories/requestRepo"
import { VehicleRepo } from "@/repositories/vehicleRepo"
import { UserRepo } from "@/repositories/userRepo"
import {
  CreateRequestSchema,
  ApproveAssignSchema,
  StartTripSchema,
  EndTripSchema,
  AddDriverSchema,
  RemoveDriverSchema,
  AssignVehicleDriverSchema,
  UpdateBookingStatusSchema,
  DeleteBookingSchema,
} from "@/validation/schemas"

export async function createRequest(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'staff') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = CreateRequestSchema.safeParse(raw)
  if (!parsed.success) return
  const { requesterId, purpose, preferredVehicleId, startTime, endTime, notes } = parsed.data
  if (preferredVehicleId) {
    await BookingRepo.findConflict(preferredVehicleId, startTime, endTime)
  }
  await RequestRepo.create({
    id: `R${Date.now()}`,
    requesterId,
    purpose,
    preferredVehicleId: preferredVehicleId ?? undefined,
    startTime,
    endTime,
    notes,
    status: 'Pending',
    createdAt: new Date(),
  })
  revalidatePath('/schedule')
  revalidatePath('/my-requests')
  revalidatePath('/requests')
}

export async function approveAndAssign(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = ApproveAssignSchema.safeParse(raw)
  if (!parsed.success) return
  const { reqId, vehicleId, driverId, override } = parsed.data
  const req = await RequestRepo.findById(reqId)
  if (!req) return
  const conflict = await BookingRepo.findConflict(vehicleId, req.startTime, req.endTime)
  if (conflict && !override) return
  await prisma.$transaction([
    prisma.booking.create({
      data: {
        id: `B${Date.now()}`,
        requestId: req.id,
        vehicleId,
        driverId,
        requesterId: req.requesterId,
        purpose: req.purpose,
        startTime: req.startTime,
        endTime: req.endTime,
        status: 'Booked',
        notes: req.notes,
        override,
        createdAt: new Date(),
      },
    }),
    prisma.request.update({ where: { id: req.id }, data: { status: 'Approved' } }),
  ])
  revalidatePath('/schedule')
  revalidatePath('/requests')
}

export async function startTrip(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'driver') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = StartTripSchema.safeParse(raw)
  if (!parsed.success) return
  const { bookingId, startLocation, odometerStart } = parsed.data as any
  await BookingRepo.update(bookingId, { status: 'InUse', actualStart: new Date(), startLocation, odometerStart })
  revalidatePath('/schedule')
  revalidatePath('/my-trips')
}

export async function endTrip(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'driver') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = EndTripSchema.safeParse(raw)
  if (!parsed.success) return
  const { bookingId, endLocation, odometerEnd } = parsed.data as any
  const b = await BookingRepo.findById(bookingId)
  if (!b) return
  if (typeof b.odometerStart === 'number' && odometerEnd < b.odometerStart) return
  await BookingRepo.update(bookingId, { status: 'Completed', actualEnd: new Date(), endLocation, odometerEnd })
  revalidatePath('/schedule')
  revalidatePath('/my-trips')
}

// Admin actions
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

