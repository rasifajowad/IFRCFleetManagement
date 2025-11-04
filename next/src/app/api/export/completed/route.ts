import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { toCSV } from '@/lib/csv'

export const runtime = 'nodejs'

function toCSVValue(val: any) {
  if (val == null) return ''
  const s = String(val)
  if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
  return s
}

export async function GET() {
  const me = await getCurrentUser()
  if (!me || me.role !== 'officer') {
    return new Response('Forbidden', { status: 403 })
  }
  const rows = await prisma.booking.findMany({
    where: { status: 'Completed' },
    include: { vehicle: true, driver: true, requester: true, request: true },
    orderBy: { actualEnd: 'desc' }
  })

  const header = [
    'Booking ID','Request ID','Vehicle','Driver','Requester','Purpose','Start Time','End Time','Status','Actual Start','Actual End','Start Location','End Location','Odometer Start','Odometer End','Notes','Override'
  ]

  const lines = [header, ...rows.map(b => [
    b.id,
    b.requestId,
    `${b.vehicle.name} (${b.vehicle.plate})`,
    b.driver.name,
    b.requester.name,
    b.purpose,
    b.startTime.toISOString(),
    b.endTime.toISOString(),
    b.status,
    b.actualStart ? b.actualStart.toISOString() : '',
    b.actualEnd ? b.actualEnd.toISOString() : '',
    b.startLocation ?? '',
    b.endLocation ?? '',
    b.odometerStart ?? '',
    b.odometerEnd ?? '',
    b.notes,
    b.override ? 'yes' : 'no'
  ])]
  const csv = toCSV(lines)
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="completed_trips.csv"`
    }
  })
}
