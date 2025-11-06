"use server"
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { UpdateProfileSchema } from '@/validation/schemas'
import { cookies } from 'next/headers'

export async function updateProfile(formData: FormData) {
  const me = await getCurrentUser()
  if (!me) return
  // Extract potential file before coercing entries
  const avatarFile = formData.get('avatarFile') as File | null
  const raw = Object.fromEntries(formData.entries())
  const parsed = UpdateProfileSchema.safeParse(raw)
  if (!parsed.success) return
  let { name, avatarUrl, phone, department, title, location, driverLicenseNo, driverLicenseExpiry } = parsed.data
  // If a file was uploaded, store it under public/avatars and override avatarUrl
  if (avatarFile && typeof avatarFile === 'object' && 'arrayBuffer' in avatarFile && (avatarFile as File).size > 0) {
    try {
      const arrayBuffer = await (avatarFile as File).arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const ext = (avatarFile as File).type?.includes('png') ? 'png' : (avatarFile as File).type?.includes('webp') ? 'webp' : (avatarFile as File).type?.includes('gif') ? 'gif' : 'jpg'
      const fileName = `${me.id}-${Date.now()}.${ext}`
      const path = await import('node:path')
      const fs = await import('node:fs/promises')
      // Try writing under current app root/public, fallback to next/public if monorepo root
      let dir = path.resolve(process.cwd(), 'public', 'avatars')
      try {
        await fs.mkdir(dir, { recursive: true })
      } catch {
        // ignore
      }
      try {
        const fullPath = path.join(dir, fileName)
        await fs.writeFile(fullPath, buffer)
      } catch {
        dir = path.resolve(process.cwd(), 'next', 'public', 'avatars')
        await fs.mkdir(dir, { recursive: true })
        const fullPath2 = path.join(dir, fileName)
        await fs.writeFile(fullPath2, buffer)
      }
      avatarUrl = `/avatars/${fileName}`
    } catch {
      // ignore file errors; fallback to provided avatarUrl if any
    }
  }
  if (me.role === 'driver') {
    const ln = (driverLicenseNo || '').trim()
    if (ln && (ln.length !== 16 || !/^[A-Za-z0-9]{16}$/.test(ln))) return
    if (driverLicenseExpiry) {
      const today = new Date(); today.setHours(0,0,0,0)
      const exp = new Date(driverLicenseExpiry); exp.setHours(0,0,0,0)
      if (exp < today) return
    }
  }
  // Update all safe-known columns via Prisma Client
  await prisma.user.update({ where: { id: me.id }, data: { name, phone, department, title, location, driverLicenseNo, driverLicenseExpiry } })
  // Update avatarUrl via raw SQL to avoid client/generator drift
  if (avatarUrl) {
    try {
      await prisma.$executeRaw`UPDATE "User" SET "avatarUrl" = ${avatarUrl} WHERE "id" = ${me.id}`
    } catch {}
  }
  revalidatePath('/profile')
  revalidatePath('/my-requests')
  revalidatePath('/my-trips')
  revalidatePath('/admin')
}

export async function removeAvatar() {
  const me = await getCurrentUser()
  if (!me) return
  // Read current avatar URL
  let avatar: string | null = null
  try {
    const rows = await prisma.$queryRaw<{ avatarUrl: string | null }[]>`SELECT "avatarUrl" FROM "User" WHERE "id" = ${me.id}`
    avatar = rows?.[0]?.avatarUrl ?? null
  } catch {}
  // Clear DB field
  try {
    await prisma.$executeRaw`UPDATE "User" SET "avatarUrl" = NULL WHERE "id" = ${me.id}`
  } catch {}
  // Best-effort remove file if it lives under /avatars
  if (avatar && avatar.startsWith('/avatars/')) {
    try {
      const pathMod = await import('node:path')
      const fs = await import('node:fs/promises')
      const candidates = [
        pathMod.resolve(process.cwd(), 'public', avatar.slice(1)),
        pathMod.resolve(process.cwd(), 'next', 'public', avatar.slice(1)),
      ]
      for (const p of candidates) {
        try { await fs.unlink(p) } catch {}
      }
    } catch {}
  }
  // Optional flash
  try {
    const jar = await cookies()
    jar.set('flash', JSON.stringify({ message: 'Profile picture removed' }), { path: '/', httpOnly: true })
  } catch {}
  revalidatePath('/profile')
}
