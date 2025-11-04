import { NextRequest } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(_req: NextRequest) {
  return new Response(null, {
    status: 302,
    headers: {
      'Set-Cookie': clearSessionCookie(),
      'Location': '/login'
    }
  })
}
