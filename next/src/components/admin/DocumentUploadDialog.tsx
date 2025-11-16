"use client"
import React from 'react'
import { useFormStatus } from 'react-dom'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SubmitToast } from '@/components/ui/toast'
import FormRefresh from '@/components/FormRefresh'
import { addDocument } from '@/app/actions'

export default function DocumentUploadDialog() {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Add Document
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload document</DialogTitle>
        </DialogHeader>
        <form action={addDocument} className="space-y-4">
          <div className="space-y-3">
            <Input name="name" placeholder="Document name" required />
            <Textarea name="detail" rows={3} placeholder="Details (optional)" />
            <Input type="file" name="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt" required />
          </div>
          <DialogFooter className="gap-2">
            <Button type="submit">Save</Button>
            <SubmitToast success="Document uploaded" />
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
