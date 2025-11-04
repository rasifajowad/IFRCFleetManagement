"use client"
import React from 'react'
import { useFormStatus } from 'react-dom'

type Toast = { id: number; message: string; type?: 'success' | 'error' };

const ToastCtx = React.createContext<{
  toasts: Toast[]
  show: (message: string, type?: Toast['type']) => void
  remove: (id: number) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const remove = React.useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), [])
  const show = React.useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => remove(id), 3000)
  }, [remove])
  return (
    <ToastCtx.Provider value={{ toasts, show, remove }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto rounded-lg border px-3 py-2 text-sm shadow-md backdrop-blur ${t.type === 'error' ? 'border-red-300 bg-red-50/90 text-red-700' : 'border-green-300 bg-green-50/90 text-green-700'}`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function FlashListener() {
  const { show } = useToast()
  const check = React.useCallback(async () => {
    try {
      const res = await fetch('/api/flash', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      if (data && data.message) {
        show(data.message, data.type === 'error' ? 'error' : 'success')
        if (data.type !== 'error') {
          window.dispatchEvent(new CustomEvent('counters:invalidate'))
        }
      }
    } catch {}
  }, [show])
  React.useEffect(() => {
    check()
    const onFocus = () => check()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [check])
  return null
}

export function SubmitToast({ success, error }: { success: string; error?: string }) {
  const { pending } = useFormStatus()
  const { show } = useToast()
  const prev = React.useRef(false)
  React.useEffect(() => {
    const fetchFlash = async () => {
      try {
        const res = await fetch('/api/flash', { cache: 'no-store' })
        if (!res.ok) return show(success, 'success')
        const data = await res.json()
        if (data && data.message) {
          show(data.message, data.type === 'error' ? 'error' : 'success')
          // notify counters listeners to refresh immediately
          window.dispatchEvent(new CustomEvent('counters:invalidate'))
        } else {
          show(success, 'success')
        }
      } catch {
        show(error || 'Operation completed', 'success')
      }
    }
    if (prev.current && !pending) {
      fetchFlash()
    }
    prev.current = pending
  }, [pending, show, success, error])
  return null
}
