import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(_req: NextRequest) {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') {
    return new Response('Forbidden', { status: 403 })
  }
  const reports = await prisma.$queryRaw<{ name: string; designation: string; message: string; createdAt: Date }[]>`SELECT "name","designation","message","createdAt" FROM "BugReport" ORDER BY "createdAt" DESC`
  const header = 'Name,Designation,Message,Created At'
  const rows = reports.map((r: (typeof reports)[number]) => [sanitize(r.name), sanitize(r.designation), sanitize(r.message), r.createdAt.toISOString()])
  const csv = [header, ...rows.map((cols: string[]) => cols.map((c: string) => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n')
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="bug-reports.csv"',
    }
  })
}

function sanitize(value: string) {
  return value.replace(/\r|\n/g, ' ').trim()
}
