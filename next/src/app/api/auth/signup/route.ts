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
    const phone = String(data.get('phone') || '').trim() || undefined
    const department = String(data.get('department') || '').trim() || undefined
    const title = String(data.get('title') || '').trim() || undefined
    const location = String(data.get('location') || '').trim() || undefined
    const driverLicenseNo = String(data.get('driverLicenseNo') || '').trim() || undefined
    const driverLicenseExpiryStr = String(data.get('driverLicenseExpiry') || '').trim()
    const driverLicenseExpiry = driverLicenseExpiryStr ? new Date(driverLicenseExpiryStr) : undefined

    const confirmPassword = String(data.get('confirmPassword') || '')
    if (!name || !email || !password) return new Response('Missing fields', { status: 400 })
    if (password !== confirmPassword) return new Response('Passwords do not match', { status: 400 })
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return new Response('Email already registered', { status: 409 })

    const allowedRole = role === 'officer' ? 'staff' : role
    const passwordHash = await hashPassword(password)
    if (allowedRole === 'driver') {
      if (!driverLicenseNo || !driverLicenseExpiry) return new Response('Driver license info required', { status: 400 })
      if (driverLicenseNo.length !== 16) return new Response('License number must be 16 characters', { status: 400 })
      const today = new Date(); today.setHours(0,0,0,0)
      if (driverLicenseExpiry < today) return new Response('License expiry cannot be in the past', { status: 400 })
    }
    const user = await prisma.user.create({
      data: {
        id: `u${Date.now()}`,
        name,
        email,
        passwordHash,
        role: allowedRole as any,
        phone,
        department,
        title,
        location,
        driverLicenseNo,
        driverLicenseExpiry,
      }
    })

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
