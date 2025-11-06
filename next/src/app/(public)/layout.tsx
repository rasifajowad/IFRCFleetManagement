import React from 'react'
import Image from 'next/image'
import { ToastProvider, FlashListener } from '@/components/ui/toast'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <FlashListener />
      {/* Top-left logo link (replaces full public header) */}
      <a href="/" aria-label="Home" className="fixed left-12 top-3 z-50 flex items-center gap-2">
        <Image src="/logo.svg" alt="IFRC Fleet Management" width={120} height={42} />
      </a>
      {children}
    </ToastProvider>
  )
}
