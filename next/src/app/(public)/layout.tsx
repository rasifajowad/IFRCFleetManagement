import React from 'react'
import { ToastProvider, FlashListener } from '@/components/ui/toast'
import PublicHeader from '@/components/layout/PublicHeader'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <FlashListener />
      <PublicHeader />
      {children}
    </ToastProvider>
  )
}
