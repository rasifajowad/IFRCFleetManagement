"use client"
import React from 'react'
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar'
import { IconLogout, IconMenu2, IconX } from '@tabler/icons-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

function LiveBadge({ kind, open }: { kind: 'requests' | 'myTrips'; open?: boolean }) {
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const res = await fetch('/api/meta/counters', { cache: 'no-store' })
        const json = await res.json()
        const c = kind === 'requests' ? json.pendingRequests : json.myTrips
        if (active) setCount(c)
      } catch {}
    }
    load()
    const onInvalidate = () => load()
    const onFocus = () => load()
    window.addEventListener('counters:invalidate', onInvalidate)
    window.addEventListener('focus', onFocus)
    return () => { active = false; window.removeEventListener('counters:invalidate', onInvalidate); window.removeEventListener('focus', onFocus) }
  }, [kind])
  if (!count) return null
  return (
    <>
      {!open && <span className="ml-[-10px] h-2 w-2 rounded-full bg-red-500" />}
      {open && <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white">{count}</span>}
    </>
  )
}

function Logo({ open }: { open: boolean }) {
  return (
    <a
      href="/"
      aria-label="Home"
      className={`${open ? 'flex flex-col items-start gap-1' : 'mt-5 mb-10 flex items-center'}`}
    >
      <Image
        src={open ? "/logo.svg" : "/Logo-Squaree-RGB.svg"}
        alt="IFRC Fleet Management"
        width={open ? 180 : 42}
        height={open ? 63 : 42}
        priority
      />
      {open && (
        <div className="text-2xl font-extrabold tracking-tight px-2 mb-5">
          <span className="text-red-600">Fleet</span>
          <span className="text-slate-900">Mate</span>
        </div>
      )}
    </a>
  )
}

function MobileNav({ links, user, open, onClose }: { links: Array<{ label: string; href: string; icon: React.ReactNode }>; user?: { name: string; title?: string | null; avatarUrl?: string | null }; open: boolean; onClose: () => void }) {
  return (
    <>
      <div className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[78vw] transform bg-white shadow-2xl transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <Logo open />
          <button aria-label="Close menu" onClick={onClose} className="rounded-full p-2 hover:bg-slate-100">
            <IconX className="h-5 w-5 text-slate-700" />
          </button>
        </div>
        <div className="overflow-y-auto px-3 py-4 space-y-2">
          {links.map((l, idx) => (
            <a key={idx} href={l.href} onClick={onClose} className="flex items-center gap-3 rounded-lg px-2 py-2 text-slate-800 hover:bg-slate-100">
              {l.icon}
              <span className="text-sm font-medium">{l.label}</span>
              {l.href === '/requests' && <LiveBadge kind="requests" open />}
              {l.href === '/my-trips' && <LiveBadge kind="myTrips" open />}
            </a>
          ))}
        </div>
        <div className="border-t px-3 py-3">
          {user && (
            <a href="/profile" onClick={onClose} className="mb-2 flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-100">
              {user.avatarUrl ? (
                <Image src={user.avatarUrl} alt={user.name} width={32} height={32} className="h-8 w-8 rounded-full object-cover" unoptimized />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700">
                  {user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="leading-tight">
                <div className="text-sm font-medium text-slate-800">{user.name}</div>
                <div className="text-xs text-slate-500">{user.title?.trim() ? user.title : '-'}</div>
              </div>
            </a>
          )}
          <form method="post" action="/api/auth/logout">
            <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-slate-100" type="submit">
              <IconLogout className="h-5 w-5 text-neutral-700" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </div>
      {open && <div className="fixed inset-0 z-30 bg-black/30 md:hidden" onClick={onClose} />}
    </>
  )
}

export default function SidebarShell({ children, links, user }: { children: React.ReactNode; links: Array<{ label: string; href: string; icon: React.ReactNode }>; user?: { name: string; title?: string | null; avatarUrl?: string | null } }) {
  const pathname = usePathname()
  const hideSidebar = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/admin/login'
  const [open, setOpen] = React.useState(true)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  if (hideSidebar) {
    return <div className="min-h-screen bg-zinc-50">{children}</div>
  }
  return (
    <div className="relative min-h-screen bg-zinc-50 md:flex">
      <button
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-slate-300 md:hidden"
      >
        <IconMenu2 className="h-5 w-5" />
      </button>

      <div className="hidden md:block flex-shrink-0 md:sticky md:top-0 md:h-screen">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="h-full justify-between overflow-hidden">
            <div className="flex-1 overflow-y-auto pr-1">
              <Logo open={open} />
              <div className="mt-2 flex flex-col gap-1">
                {links.map((l, idx) => (
                  <div key={idx} className="flex px-2 items-center gap-2">
                    <SidebarLink link={l} />
                    {l.href === '/requests' && <LiveBadge kind="requests" open={open} />}
                    {l.href === '/my-trips' && <LiveBadge kind="myTrips" open={open} />}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              {user && (
                <a href="/profile" className="mb-2 flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-slate-100">
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt={user.name} width={32} height={32} className="h-8 w-8 rounded-full object-cover" unoptimized />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-700">
                      {user.name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                  )}
                  {open && (
                    <div className="leading-tight">
                      <div className="text-sm font-medium text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.title?.trim() ? user.title : '-'}</div>
                    </div>
                  )}
                </a>
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

      <MobileNav links={links} user={user} open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 pb-10 pt-16 md:pt-0 md:pb-0 overflow-y-auto">{children}</div>
    </div>
  )
}
