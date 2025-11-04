import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { buildSessionCookie, createToken, verifyPassword } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const email = String(data.get('email') || '').trim().toLowerCase()
    const password = String(data.get('password') || '')

    if (!email || !password) {
      return new Response('Missing credentials', { status: 400 })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return new Response('Invalid credentials', { status: 401 })
    }

    const token = createToken({ id: user.id, role: user.role as any, name: user.name, email: user.email })
    return new Response(null, {
      status: 302,
      headers: {
        'Set-Cookie': buildSessionCookie(token),
        'Location': user.role === 'officer' ? '/admin' : user.role === 'driver' ? '/my-trips' : '/my-requests'
      }
    })
  } catch (e) {
    console.error('Login error', e)
    return new Response('Internal Server Error', { status: 500 })
  }
}
