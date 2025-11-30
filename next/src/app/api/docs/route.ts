import { prisma } from '@/lib/db'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')?.trim() || ''
  if (!id) return new Response('Missing id', { status: 400 })
  try {
    const rows = await prisma.$queryRaw<{ fileData: Buffer | null; mimeType: string | null; fileName: string | null }[]>`
      SELECT "fileData","mimeType","fileName"
      FROM "Document"
      WHERE "id" = ${id}
      LIMIT 1
    `
    const row = rows[0]
    if (!row || !row.fileData) {
      return new Response('File not stored for this document (reupload required)', { status: 404 })
    }
    const mime = row.mimeType || 'application/octet-stream'
    const fileName = row.fileName || 'document'
    const body = row.fileData instanceof Uint8Array ? row.fileData : new Uint8Array(row.fileData as ArrayBuffer)
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Content-Disposition': `inline; filename="${encodeURIComponent(fileName)}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('Doc fetch failed', err)
    return new Response('Server error', { status: 500 })
  }
}
