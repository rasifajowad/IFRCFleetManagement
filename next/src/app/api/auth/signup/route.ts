import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { buildSessionCookie, createToken, hashPassword } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData()
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim().toLowerCase()
    const password = String(data.get('password') || '')
    const role = (String(data.get('role') || 'staff').trim() as 'staff' | 'driver' | 'officer')

    if (!name || !email || !password) return new Response('Missing fields', { status: 400 })
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return new Response('Email already registered', { status: 409 })

    const allowedRole = role === 'officer' ? 'staff' : role
    const passwordHash = await hashPassword(password)
    const user = await prisma.user.create({ data: { id: `u${Date.now()}`, name, email, passwordHash, role: allowedRole as any } })

    const token = createToken({ id: user.id, role: user.role as any, name: user.name, email: user.email })
    return new Response(null, {
      status: 302,
      headers: {
        'Set-Cookie': buildSessionCookie(token),
        'Location': user.role === 'driver' ? '/my-trips' : '/my-requests'
      }
    })
  } catch (e) {
    console.error('Signup error', e)
    return new Response('Internal Server Error', { status: 500 })
  }
}
