"use client"
import React, { useRef, useState } from 'react'
import Modal from './modal'
import { Button } from './button'

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
      <Modal open={open} onClose={() => setOpen(false)} title={confirmTitle}>
        <p className="text-sm text-slate-600">{confirmMessage}</p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)} type="button">{cancelText}</Button>
          <Button onClick={onConfirm} type="button">{confirmText}</Button>
        </div>
      </Modal>
    </>
  )
}
