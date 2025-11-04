import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest) {
  const me = await getCurrentUser()
  const [pendingRequests, myTrips] = await Promise.all([
    prisma.request.count({ where: { status: 'Pending' } }),
    me && me.role === 'driver'
      ? prisma.booking.count({ where: { driverId: me.id, status: { in: ['Booked', 'InUse'] } } })
      : Promise.resolve(0),
  ])
  return Response.json({ pendingRequests, myTrips }, { headers: { 'Cache-Control': 'no-store' } })
}

