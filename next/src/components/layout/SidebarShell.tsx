"use client"
import React from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { IconLogout } from '@tabler/icons-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

function Logo({ open }: { open: boolean }) {
  return (
    <a href="/" className="flex items-center gap-2 px-2 py-2">
      <Image src="/logo.svg" alt="IFRC Fleet Management" width={24} height={24} />
      {open && <span className="font-semibold text-slate-900">IFRC Fleet</span>}
    </a>
  )
}

export default function SidebarShell({ children, links, user }: { children: React.ReactNode; links: Array<{ label: string; href: string; icon: React.ReactNode }>; user?: { name: string; role: string } }) {
  const pathname = usePathname()
  const hideSidebar = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/admin/login'
  const [open, setOpen] = React.useState(false)
  if (hideSidebar) {
    return <div className="min-h-screen bg-zinc-50">{children}</div>
  }
  return (
    <div className="flex h-screen w-full">
      <div className="flex-shrink-0">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between">
            <div className="flex-1 overflow-y-auto">
              <Logo open={open} />
              <div className="mt-4 flex flex-col gap-1">
                {links.map((l, idx) => (
                  <SidebarLink key={idx} link={l} />
                ))}
              </div>
            </div>
            <div className="mt-4">
              {user && (
                <div className="mb-2 flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-100">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700">
                    {user.name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  {open && (
                    <div className="leading-tight">
                      <div className="text-sm text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500 capitalize">{user.role}</div>
                    </div>
                  )}
                </div>
              )}
              <form method="post" action="/api/auth/logout">
                <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-100" type="submit">
                  <IconLogout className="h-5 w-5 text-neutral-700" />
                  {open && <span>Logout</span>}
                </button>
              </form>
            </div>
          </SidebarBody>
        </Sidebar>
      </div>
      <div className="flex-1 overflow-y-auto bg-zinc-50">{children}</div>
    </div>
  )
}
