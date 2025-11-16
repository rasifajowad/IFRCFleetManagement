"use client"
import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { reportBug } from '@/app/actions'
import { SubmitToast } from '@/components/ui/toast'
import { useFormStatus } from 'react-dom'

export default function BugReportButton() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-red-600 px-5 py-3 text-white shadow-lg hover:bg-red-700">Report a Bug</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Bug Report</DialogTitle>
              <DialogDescription>Please report any feature that isn't working. It will help us improve the app.</DialogDescription>
            </DialogHeader>
            <form action={reportBug} className="space-y-3">
              <Input name="name" placeholder="Your name" required />
              <Input name="designation" placeholder="Designation" required />
              <Textarea name="message" placeholder="Describe the issue" rows={4} required />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Submit</Button>
                <SubmitToast success="Bug reported" />
                <CloseOnSuccess onDone={() => setOpen(false)} />
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
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
