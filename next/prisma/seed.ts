import 'dotenv/config'
import crypto from 'node:crypto'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

async function main() {
  await prisma.user.createMany({
    data: [
      { id: 'officer', name: 'Officer', role: 'officer' as Role },
      { id: 'u1', name: 'Ahmed', role: 'staff' as Role },
      { id: 'u2', name: 'Rahim', role: 'staff' as Role },
      { id: 'u3', name: 'Nadia', role: 'staff' as Role },
      { id: 'd1', name: 'Selim', role: 'driver' as Role },
      { id: 'd2', name: 'Akbar', role: 'driver' as Role },
      { id: 'd3', name: 'Rafi', role: 'driver' as Role },
    ],
    skipDuplicates: true,
  })

  await prisma.vehicle.createMany({
    data: [
      { id: 'v1', name: 'Hilux D-2', plate: 'DHA-11-2345' },
      { id: 'v2', name: 'Land Cruiser LC70', plate: 'DHA-22-7788' },
      { id: 'v3', name: 'Noah Microbus', plate: 'DHA-09-5521' },
    ],
    skipDuplicates: true,
  })

  // Demo credentials for quick login
  await prisma.user.upsert({
    where: { id: 'officer' },
    update: { email: 'officer@example.com', passwordHash: hashPassword('secret123') },
    create: { id: 'officer', name: 'Officer', role: 'officer' as Role, email: 'officer@example.com', passwordHash: hashPassword('secret123') }
  })
  await prisma.user.upsert({
    where: { id: 'd1' },
    update: { email: 'driver1@example.com', passwordHash: hashPassword('secret123') },
    create: { id: 'd1', name: 'Selim', role: 'driver' as Role, email: 'driver1@example.com', passwordHash: hashPassword('secret123') }
  })
  await prisma.user.upsert({
    where: { id: 'u1' },
    update: { email: 'staff1@example.com', passwordHash: hashPassword('secret123') },
    create: { id: 'u1', name: 'Ahmed', role: 'staff' as Role, email: 'staff1@example.com', passwordHash: hashPassword('secret123') }
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
