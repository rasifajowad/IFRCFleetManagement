"use server"
import { revalidatePath } from 'next/cache'
import { getCurrentUser } from '@/lib/auth'
import { cookies } from 'next/headers'
import { BookingRepo } from '@/repositories/bookingRepo'
import { EndTripSchema, StartTripSchema } from '@/validation/schemas'

export async function startTrip(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'driver') { const jar = await cookies(); jar.set('flash', JSON.stringify({ type: 'error', message: 'Driver access required' }), { path: '/' }); return }
  const raw = Object.fromEntries(formData.entries())
  const parsed = StartTripSchema.safeParse(raw)
  if (!parsed.success) { const jar = await cookies(); jar.set('flash', JSON.stringify({ type: 'error', message: 'Invalid input' }), { path: '/' }); return }
  const { bookingId, startLocation, odometerStart } = parsed.data as any
  await BookingRepo.update(bookingId, { status: 'InUse', actualStart: new Date(), startLocation, odometerStart })
  revalidatePath('/schedule')
  revalidatePath('/my-trips')
  { const jar = await cookies(); jar.set('flash', JSON.stringify({ type: 'success', message: 'Trip started' }), { path: '/' }) }
}

export async function endTrip(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'driver') { const jar = await cookies(); jar.set('flash', JSON.stringify({ type: 'error', message: 'Driver access required' }), { path: '/' }); return }
  const raw = Object.fromEntries(formData.entries())
  const parsed = EndTripSchema.safeParse(raw)
  if (!parsed.success) { const jar = await cookies(); jar.set('flash', JSON.stringify({ type: 'error', message: 'Invalid input' }), { path: '/' }); return }
  const { bookingId, endLocation, odometerEnd } = parsed.data as any
  const b = await BookingRepo.findById(bookingId)
  if (!b) { const jar = await cookies(); jar.set('flash', JSON.stringify({ type: 'error', message: 'Booking not found' }), { path: '/' }); return }
  if (typeof b.odometerStart === 'number' && odometerEnd < b.odometerStart) { const jar = await cookies(); jar.set('flash', JSON.stringify({ type: 'error', message: 'End odometer must be >= start' }), { path: '/' }); return }
  await BookingRepo.update(bookingId, { status: 'Completed', actualEnd: new Date(), endLocation, odometerEnd })
  revalidatePath('/schedule')
  revalidatePath('/my-trips')
  { const jar = await cookies(); jar.set('flash', JSON.stringify({ type: 'success', message: 'Trip ended' }), { path: '/' }) }
}
