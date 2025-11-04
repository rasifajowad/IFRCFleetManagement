import React from 'react'
import AppSidebar from '@/components/layout/AppSidebar'
import { ToastProvider, FlashListener } from '@/components/ui/toast'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <FlashListener />
      <AppSidebar>{children}</AppSidebar>
    </ToastProvider>
  )
}
