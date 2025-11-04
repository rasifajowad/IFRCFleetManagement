"use client"
import Image from 'next/image'

export default function PublicHeader() {
  return (
    <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4 text-sm">
        <a href="/" className="flex items-center gap-2 mr-2" aria-label="Home">
          <Image src="/logo.svg" alt="IFRC Fleet Management" width={24} height={24} />
          <span className="font-semibold text-slate-900">IFRC Fleet</span>
        </a>
      </nav>
    </header>
  )
}

