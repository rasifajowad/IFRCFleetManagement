"use client"
import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { reportBug } from '@/app/actions'
import { SubmitToast } from '@/components/ui/toast'
import { useFormStatus } from 'react-dom'
import { Bug as BugIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BugReportButton() {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="Report a bug"
              className="group flex h-12 w-12 items-center justify-center gap-0 overflow-hidden rounded-full border-[3px] border-red-500 bg-white px-0 text-red-600 shadow-sm transition-all duration-300 hover:w-auto hover:justify-start hover:bg-red-600 hover:px-4 hover:text-white hover:shadow-lg data-[state=open]:w-auto data-[state=open]:justify-start data-[state=open]:bg-red-600 data-[state=open]:px-4 data-[state=open]:text-white"
            >
              <BugIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 data-[state=open]:scale-110" />
              <span className="ml-0 max-w-0 overflow-hidden text-sm font-medium opacity-0 transition-all duration-300 group-hover:ml-2 group-hover:max-w-[140px] group-hover:opacity-100 data-[state=open]:ml-2 data-[state=open]:max-w-[140px] data-[state=open]:opacity-100">
                Report a Bug
              </span>
            </button>
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
