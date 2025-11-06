import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function POST(_req: NextRequest) {
  const me = await getCurrentUser()
  const jar = await cookies()
  if (!me) {
    return new Response(null, { status: 302, headers: { Location: '/login' } })
  }
  // Prevent deleting last active officer
  if (me.role === 'officer') {
    const count = await prisma.user.count({ where: { role: 'officer' as any, active: true, id: { not: me.id } } })
    if (count <= 0) {
      jar.set('flash', JSON.stringify({ message: 'Cannot delete the last active officer', type: 'error' }), { path: '/', httpOnly: true })
      return new Response(null, { status: 302, headers: { Location: '/profile' } })
    }
  }
  // Block if referenced by bookings
  const blocks = await prisma.booking.count({ where: { OR: [{ driverId: me.id }, { requesterId: me.id }] } })
  if (blocks > 0) {
    jar.set('flash', JSON.stringify({ message: 'Cannot delete account with existing trips/requests', type: 'error' }), { path: '/', httpOnly: true })
    return new Response(null, { status: 302, headers: { Location: '/profile' } })
  }
  // Delete user
  await prisma.user.delete({ where: { id: me.id } })
  // Clear session cookie
  jar.set('app_session', '', { path: '/', httpOnly: true, maxAge: 0, sameSite: 'lax' })
  jar.set('flash', JSON.stringify({ message: 'Account deleted' }), { path: '/', httpOnly: true })
  return new Response(null, { status: 302, headers: { Location: '/' } })
}

