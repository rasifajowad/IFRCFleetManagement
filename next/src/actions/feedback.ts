"use server"
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function reportBug(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  const name = String(raw.name ?? '').trim()
  const designation = String(raw.designation ?? '').trim()
  const message = String(raw.message ?? '').trim()
  if (!name || !designation || !message) return
  await prisma.$executeRaw`INSERT INTO "BugReport" ("id","name","designation","message") VALUES (${crypto.randomUUID()}, ${name}, ${designation}, ${message})`
  revalidatePath('/admin')
}
