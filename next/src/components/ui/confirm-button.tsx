"use client"
import React, { useRef, useState } from 'react'
import { Button } from './button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from './dialog'

type ConfirmButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  confirmTitle?: string
  confirmMessage?: string
  confirmText?: string
  cancelText?: string
}

export default function ConfirmButton({
  confirmTitle = 'Please confirm',
  confirmMessage = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  children,
  className,
  ...rest
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setOpen(true)
  }

  const onConfirm = () => {
    setOpen(false)
    const btn = btnRef.current
    if (btn?.form) {
      // submit owning form
      btn.form.requestSubmit(btn)
    }
  }

  return (
    <>
      <button ref={btnRef} className={className} {...rest} onClick={handleClick}>
        {children}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>{confirmTitle}</DialogTitle>
          <DialogDescription>{confirmMessage}</DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} type="button">{cancelText}</Button>
            <Button onClick={onConfirm} type="button">{confirmText}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
