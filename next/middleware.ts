import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenEdge } from './src/lib/edge-auth'

const SESSION_COOKIE = 'app_session'
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-me'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  // Paths and their required roles
  const roleRequirements: Array<{ test: (p: string) => boolean; role: 'officer' | 'driver' | 'staff'; login?: string }> = [
    { test: (p) => p.startsWith('/admin') || p.startsWith('/requests') || p.startsWith('/api/export/completed'), role: 'officer', login: '/admin/login' },
    { test: (p) => p === '/my-trips' || p.startsWith('/my-trips/'), role: 'driver', login: '/login?role=driver' },
    { test: (p) => p === '/my-requests' || p.startsWith('/my-requests/'), role: 'staff', login: '/login' },
  ]

  const rule = roleRequirements.find(r => r.test(pathname))
  if (!rule) return NextResponse.next()

  const token = req.cookies.get(SESSION_COOKIE)?.value
  const me = await verifyTokenEdge(token, AUTH_SECRET)
  if (!me) {
    const url = new URL(rule.login || '/login', req.url)
    return NextResponse.redirect(url)
  }
  if (me.role !== rule.role) {
    // Wrong role: send to their home
    const url = new URL(me.role === 'officer' ? '/admin' : me.role === 'driver' ? '/my-trips' : '/my-requests', req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/requests/:path*',
    '/my-trips',
    '/my-requests',
    '/api/export/completed',
  ],
}

