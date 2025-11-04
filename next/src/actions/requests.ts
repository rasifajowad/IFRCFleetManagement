"use server"
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { BookingRepo } from '@/repositories/bookingRepo'
import { RequestRepo } from '@/repositories/requestRepo'
import { ApproveAssignSchema, CreateRequestSchema } from '@/validation/schemas'

export async function createRequest(formData: FormData) {
  const me = await getCurrentUser()
  if (!me) return
  const raw = Object.fromEntries(formData.entries())
  const parsed = CreateRequestSchema.safeParse(raw)
  if (!parsed.success) return
  const { requesterId, purpose, startLocation, destination, startTime, endTime, notes } = parsed.data as any
  await RequestRepo.create({
    id: `R${Date.now()}`,
    requesterId,
    purpose,
    startLocation,
    destination,
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

