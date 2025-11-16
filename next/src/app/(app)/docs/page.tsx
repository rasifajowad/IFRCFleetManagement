import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { deleteDocument } from '@/app/actions'

export const dynamic = 'force-dynamic'

export default async function DocsPage() {
  const me = await getCurrentUser()
  const isOfficer = me?.role === 'officer'
  const documents = await prisma.$queryRaw<{ id: string; name: string; detail: string | null; fileUrl: string; fileName: string | null }[]>`
    SELECT "id","name","detail","fileUrl","fileName"
    FROM "Document"
    ORDER BY "createdAt" DESC
  `
  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <SectionHeader title="General Documentation" subtitle="Download IFRC fleet guides and policies" />
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Name</TH>
                  <TH>Details</TH>
                  <TH>Actions</TH>
                </TR>
              </THead>
              <TBody>
                {documents.map(doc => (
                  <TR key={doc.id}>
                    <TD className="font-medium text-slate-900">{doc.name}</TD>
                    <TD className="text-slate-600">{doc.detail || '-'}</TD>
                    <TD className="flex flex-wrap items-center gap-3">
                      <a href={doc.fileUrl} className="text-red-600 underline" target="_blank" rel="noreferrer">
                        View
                      </a>
                      <a
                        href={doc.fileUrl}
                        className="text-slate-700 underline"
                        download={buildDownloadName(doc.name, doc.fileName)}
                      >
                        Download
                      </a>
                      {isOfficer && (
                        <form action={deleteDocument}>
                          <input type="hidden" name="id" value={doc.id} />
                          <Button type="submit" variant="ghost" size="sm" className="text-red-600 px-0">
                            Delete
                          </Button>
                        </form>
                      )}
                    </TD>
                  </TR>
                ))}
                {documents.length === 0 && (
                  <TR>
                    <TD colSpan={3} className="text-center text-slate-500 py-6">No documents available.</TD>
                  </TR>
                )}
              </TBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

function buildDownloadName(name: string, fileName: string | null) {
  const sanitized = name.trim().replace(/[\\/:*?"<>|]+/g, '-')
  const ext = fileName && fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : ''
  return `${sanitized}${ext}`
}
