"use server"
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { BookingRepo } from '@/repositories/bookingRepo'
import { EndTripSchema, StartTripSchema } from '@/validation/schemas'

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

