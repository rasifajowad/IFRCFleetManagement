"use client"
import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SubmitToast } from '@/components/ui/toast'
import FormRefresh from '@/components/FormRefresh'
import { updateDocument } from '@/app/actions'
import { useFormStatus } from 'react-dom'

type Doc = { id: string; name: string; detail: string | null }

export default function DocumentEditDialog({ doc }: { doc: Doc }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-700 px-0">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit document</DialogTitle>
        </DialogHeader>
        <form action={updateDocument} className="space-y-3">
          <input type="hidden" name="id" value={doc.id} />
          <div className="space-y-2">
            <label className="text-sm text-slate-700">
              Name
              <Input name="name" defaultValue={doc.name} required className="mt-1" />
            </label>
            <label className="text-sm text-slate-700">
              Details
              <Textarea name="detail" defaultValue={doc.detail || ''} rows={4} className="mt-1" />
            </label>
            <label className="text-sm text-slate-700">
              Replace file (optional)
              <Input type="file" name="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" className="mt-1" />
            </label>
          </div>
          <DialogFooter className="gap-2">
            <Button type="submit">Save changes</Button>
            <SubmitToast success="Document updated" />
            <FormRefresh />
            <CloseOnSuccess onDone={() => setOpen(false)} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function CloseOnSuccess({ onDone }: { onDone: () => void }) {
  const { pending } = useFormStatus()
  const prev = React.useRef(false)
  React.useEffect(() => {
    if (prev.current && !pending) onDone()
    prev.current = pending
  }, [pending, onDone])
  return null
}
