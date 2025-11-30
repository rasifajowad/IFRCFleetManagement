import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { deleteDocument } from '@/app/actions'
import DocumentEditDialog from '@/components/docs/DocumentEditDialog'

export const revalidate = 300

type DocRow = { id: string; name: string; detail: string | null; fileName: string | null }

const fileUrlFor = (docId: string) => `/api/docs?id=${encodeURIComponent(docId)}`
const downloadName = (name: string, fileName: string | null) => {
  const sanitized = name.trim().replace(/[\\/:*?"<>|]+/g, '-')
  const ext = fileName && fileName.includes('.') ? fileName.slice(fileName.lastIndexOf('.')) : ''
  return `${sanitized}${ext}`
}

export default async function DocsPage() {
  const me = await getCurrentUser()
  const isOfficer = me?.role === 'officer'
  const documents = await prisma.$queryRaw<DocRow[]>`
    SELECT "id","name","detail","fileName"
    FROM "Document"
    ORDER BY "createdAt" DESC
  `

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-6">
      <SectionHeader title="General Documentation" subtitle="Download IFRC fleet guides and policies" />
      <Card>
        <CardContent className="p-4">
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {documents.map((doc: DocRow) => (
              <div key={doc.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{doc.name}</div>
                    <div className="text-xs text-slate-500">{doc.detail || '-'}</div>
                  </div>
                  {isOfficer && <DocumentEditDialog doc={{ id: doc.id, name: doc.name, detail: doc.detail }} />}
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <a href={fileUrlFor(doc.id)} className="text-red-600 underline" target="_blank" rel="noreferrer">View</a>
                  <a
                    href={fileUrlFor(doc.id)}
                    className="text-slate-700 underline"
                    download={downloadName(doc.name, doc.fileName)}
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
                </div>
              </div>
            ))}
            {documents.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-slate-500">
                No documents available.
              </div>
            )}
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <Table>
              <THead>
                <TR>
                  <TH>Name</TH>
                  <TH>Details</TH>
                  <TH>Actions</TH>
                </TR>
              </THead>
              <TBody>
                {documents.map((doc: DocRow) => (
                  <TR key={doc.id}>
                    <TD className="font-medium text-slate-900">{doc.name}</TD>
                    <TD className="text-slate-600">{doc.detail || '-'}</TD>
                    <TD className="flex flex-wrap items-center gap-3">
                      <a href={fileUrlFor(doc.id)} className="text-red-600 underline" target="_blank" rel="noreferrer">
                        View
                      </a>
                      <a
                        href={fileUrlFor(doc.id)}
                        className="text-slate-700 underline"
                        download={downloadName(doc.name, doc.fileName)}
                      >
                        Download
                      </a>
                      {isOfficer && (
                        <>
                          <DocumentEditDialog doc={{ id: doc.id, name: doc.name, detail: doc.detail }} />
                          <form action={deleteDocument}>
                            <input type="hidden" name="id" value={doc.id} />
                            <Button type="submit" variant="ghost" size="sm" className="text-red-600 px-0">
                              Delete
                            </Button>
                          </form>
                        </>
                      )}
                    </TD>
                  </TR>
                ))}
                {documents.length === 0 && (
                  <TR>
                    <TD colSpan={3} className="py-6 text-center text-slate-500">No documents available.</TD>
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
