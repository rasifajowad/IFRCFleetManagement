"use server"
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getCurrentUser, hashPassword } from '@/lib/auth'
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
  AdminAddVehicleSchema,
  AdminUpdateVehicleSchema,
} from '@/validation/schemas'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { cookies } from 'next/headers'

export async function addDriver(formData: FormData) {
  const me = await getCurrentUser()
  const jar = await cookies()
  if (!me || me.role !== 'officer') {
    jar.set('flash', JSON.stringify({ type: 'error', message: 'Officer access required' }), { path: '/' })
    return
  }
  const raw = Object.fromEntries(formData.entries())
  const parsed = AddDriverSchema.safeParse(raw)
  if (!parsed.success) {
    jar.set('flash', JSON.stringify({ type: 'error', message: 'Invalid driver data' }), { path: '/' })
    return
  }
  const { confirmPassword: _confirmPassword, password, vehicleId, ...profile } = parsed.data
  const email = profile.email
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    jar.set('flash', JSON.stringify({ type: 'error', message: 'Email already registered' }), { path: '/' })
    return
  }
  const passwordHash = await hashPassword(password)
  const normalize = (value?: string | null) => {
    if (value === undefined || value === null) return null
    const trimmed = value.trim()
    return trimmed.length ? trimmed : null
  }
  const driver = await prisma.user.create({
    data: {
      id: `d${Date.now()}`,
      name: profile.name,
      role: 'driver' as any,
      email,
      passwordHash,
      phone: normalize(profile.phone),
      department: normalize(profile.department),
      title: normalize(profile.title),
      location: normalize(profile.location),
      driverLicenseNo: profile.driverLicenseNo,
      driverLicenseExpiry: profile.driverLicenseExpiry,
      active: true,
    }
  })
  if (vehicleId) {
    await prisma.vehicle.update({ where: { id: vehicleId }, data: { assignedDriverId: driver.id } })
  }
  revalidatePath('/admin')
  revalidatePath('/vehicle-info')
  if (vehicleId) {
    revalidatePath(`/vehicle-info/${vehicleId}`)
  }
  revalidatePath('/schedule')
  jar.set('flash', JSON.stringify({ type: 'success', message: 'Driver added' }), { path: '/' })
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
  revalidatePath('/vehicle-info')
  revalidatePath('/schedule')
}

export async function addVehicle(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = AdminAddVehicleSchema.safeParse(raw)
  if (!parsed.success) return
  const {
    modelName,
    registrationNumber,
    organizationName,
    engineNumber,
    engineCapacity,
    chassisNumber,
    yearManufacture,
    deployedArea,
    contractExpiry,
    registrationExpiry,
    ifrcCode,
    driverId,
  } = parsed.data

  const data: any = {
    id: `veh${Date.now()}`,
    name: modelName,
    plate: registrationNumber,
    modelName,
    registrationNumber,
    organizationName: organizationName || null,
    engineNumber: engineNumber || null,
    engineCapacity: engineCapacity || null,
    chassisNumber: chassisNumber || null,
    yearManufacture: yearManufacture ?? null,
    deployedArea: deployedArea || null,
    contractExpiry: contractExpiry ?? null,
    registrationExpiry: registrationExpiry ?? null,
    ifrcCode: ifrcCode || null,
    assignedDriverId: driverId ?? null,
  }

  const imageFiles = formData.getAll('images').filter((file): file is File => file instanceof File && file.size > 0)
  const imageUrls: string[] = []
  if (imageFiles.length > 0) {
    try {
      const dir = path.resolve(process.cwd(), 'public', 'vehicles')
      await fs.mkdir(dir, { recursive: true })
      for (const file of imageFiles) {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const ext = (file.type && file.type.split('/')[1]) || 'jpg'
        const fname = `${data.id}-${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`
        await fs.writeFile(path.join(dir, fname), buffer)
        imageUrls.push(`/vehicles/${fname}`)
      }
    } catch (err) {
      console.error('Failed uploading vehicle images', err)
    }
  }

  if (imageUrls.length > 0) data.primaryImageUrl = imageUrls[0]

  await prisma.vehicle.create({ data })
  if (imageUrls.length > 0) {
    await prisma.vehicleImage.createMany({ data: imageUrls.map((url) => ({ vehicleId: data.id, url })) })
  }
  revalidatePath('/admin')
  revalidatePath('/vehicle-info')
}

export async function addDocument(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return
  const detail = String(formData.get('detail') ?? '').trim()
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) return
  try {
    const id = randomUUID()
    const buffer = Buffer.from(await file.arrayBuffer())
    const mimeType = file.type || 'application/octet-stream'
    const fileName = file.name || `${id}.bin`
    // ensure columns exist (safe if already added)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "fileData" bytea`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "mimeType" text`)
    await prisma.$executeRaw`INSERT INTO "Document" ("id","name","detail","fileUrl","fileName","fileData","mimeType") VALUES (${id}, ${name}, ${detail || null}, ${`/api/docs?id=${id}`}, ${fileName}, ${buffer}, ${mimeType})`
    revalidatePath('/docs')
    revalidatePath('/admin')
  } catch (err) {
    console.error('Failed saving document', err)
  }
}

export async function deleteDocument(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const id = String(formData.get('id') ?? '').trim()
  if (!id) return
  try {
    await prisma.$executeRaw`DELETE FROM "Document" WHERE "id" = ${id}`
    revalidatePath('/docs')
    revalidatePath('/admin')
  } catch (err) {
    console.error('Failed deleting document', err)
  }
}

export async function updateDocument(formData: FormData) {
  const me = await getCurrentUser()
  const jar = await cookies()
  if (!me || me.role !== 'officer') {
    jar.set('flash', JSON.stringify({ type: 'error', message: 'Officer access required' }), { path: '/' })
    return
  }
  const id = String(formData.get('id') ?? '').trim()
  const name = String(formData.get('name') ?? '').trim()
  if (!id || !name) {
    jar.set('flash', JSON.stringify({ type: 'error', message: 'Name is required' }), { path: '/' })
    return
  }
  const detailRaw = String(formData.get('detail') ?? '').trim()
  const file = formData.get('file')
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "fileData" bytea`)
    await prisma.$executeRawUnsafe(`ALTER TABLE "Document" ADD COLUMN IF NOT EXISTS "mimeType" text`)
    if (file instanceof File && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const mimeType = file.type || 'application/octet-stream'
      const fileName = file.name || `${id}.bin`
      const updated = await prisma.$executeRaw`
        UPDATE "Document"
        SET "name"=${name}, "detail"=${detailRaw || null}, "fileData"=${buffer}, "mimeType"=${mimeType}, "fileName"=${fileName}, "fileUrl"=${`/api/docs?id=${id}`}
        WHERE "id"=${id}
      `
      if (!updated) {
        jar.set('flash', JSON.stringify({ type: 'error', message: 'Document not found' }), { path: '/' })
        return
      }
    } else {
      const updated = await prisma.$executeRaw`
        UPDATE "Document"
        SET "name"=${name}, "detail"=${detailRaw || null}
        WHERE "id"=${id}
      `
      if (!updated) {
        jar.set('flash', JSON.stringify({ type: 'error', message: 'Document not found' }), { path: '/' })
        return
      }
    }
    revalidatePath('/docs')
    revalidatePath('/admin')
    jar.set('flash', JSON.stringify({ type: 'success', message: 'Document updated' }), { path: '/' })
  } catch (err) {
    console.error('Failed updating document', err)
    jar.set('flash', JSON.stringify({ type: 'error', message: 'Failed to update document' }), { path: '/' })
  }
}

export async function updateVehicleDetails(formData: FormData) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') return
  const raw = Object.fromEntries(formData.entries())
  const parsed = AdminUpdateVehicleSchema.safeParse(raw)
  if (!parsed.success) return
  const {
    vehicleId,
    modelName,
    registrationNumber,
    driverId,
    ifrcCode,
    organizationName,
    engineNumber,
    engineCapacity,
    chassisNumber,
    yearManufacture,
    deployedArea,
    contractExpiry,
    registrationExpiry,
  } = parsed.data

  const imageFiles = formData.getAll('images').filter((file): file is File => file instanceof File && file.size > 0)
  const imageUrls: string[] = []
  if (imageFiles.length > 0) {
    try {
      const dir = path.resolve(process.cwd(), 'public', 'vehicles')
      await fs.mkdir(dir, { recursive: true })
      for (const file of imageFiles) {
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const ext = (file.type && file.type.split('/')[1]) || 'jpg'
        const fname = `${vehicleId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        await fs.writeFile(path.join(dir, fname), buffer)
        imageUrls.push(`/vehicles/${fname}`)
      }
    } catch (err) {
      console.error('Failed uploading vehicle images', err)
    }
  }

  const optionalText = (v?: string | null) => (v && v.trim().length > 0 ? v : null)
  const updateData: any = {
    name: modelName,
    plate: registrationNumber,
    modelName,
    registrationNumber,
    assignedDriverId: driverId ?? null,
    ifrcCode: optionalText(ifrcCode),
    organizationName: optionalText(organizationName),
    engineNumber: optionalText(engineNumber),
    engineCapacity: optionalText(engineCapacity),
    chassisNumber: optionalText(chassisNumber),
    deployedArea: optionalText(deployedArea),
  }
  if (yearManufacture !== undefined) updateData.yearManufacture = yearManufacture ?? null
  if (contractExpiry !== undefined) updateData.contractExpiry = contractExpiry ?? null
  if (registrationExpiry !== undefined) updateData.registrationExpiry = registrationExpiry ?? null
  if (imageUrls.length > 0) {
    updateData.primaryImageUrl = imageUrls[0]
  }

  await prisma.vehicle.update({ where: { id: vehicleId }, data: updateData })
  if (imageUrls.length > 0) {
    await prisma.vehicleImage.createMany({ data: imageUrls.map(url => ({ vehicleId, url })) })
  }
  revalidatePath('/admin')
  revalidatePath('/vehicle-info')
  revalidatePath(`/vehicle-info/${vehicleId}`)
  revalidatePath('/schedule')
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

