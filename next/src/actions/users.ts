"use server"
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { UpdateProfileSchema } from '@/validation/schemas'

export async function updateProfile(formData: FormData) {
  const me = await getCurrentUser()
  if (!me) return
  const raw = Object.fromEntries(formData.entries())
  const parsed = UpdateProfileSchema.safeParse(raw)
  if (!parsed.success) return
  const { name, phone, department, title, location, driverLicenseNo, driverLicenseExpiry } = parsed.data
  if (me.role === 'driver') {
    const ln = (driverLicenseNo || '').trim()
    if (!ln || ln.length !== 16 || !/^[A-Za-z0-9]{16}$/.test(ln)) return
    if (!driverLicenseExpiry) return
    const today = new Date(); today.setHours(0,0,0,0)
    const exp = new Date(driverLicenseExpiry); exp.setHours(0,0,0,0)
    if (exp < today) return
  }
  await prisma.user.update({ where: { id: me.id }, data: { name, phone, department, title, location, driverLicenseNo, driverLicenseExpiry } })
  revalidatePath('/profile')
  revalidatePath('/my-requests')
  revalidatePath('/my-trips')
  revalidatePath('/admin')
}

