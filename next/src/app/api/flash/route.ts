import { cookies } from 'next/headers'

export const runtime = 'nodejs'

export async function GET() {
  const jar = await cookies()
  const raw = jar.get('flash')?.value
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      jar.set('flash', '', { path: '/', maxAge: 0 })
      return Response.json(parsed, { headers: { 'Cache-Control': 'no-store' } })
    } catch {}
  }
  return Response.json({}, { headers: { 'Cache-Control': 'no-store' } })
}

