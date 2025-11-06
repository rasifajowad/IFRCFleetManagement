import { getCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { IconCalendar, IconUser, IconClipboardList, IconCar, IconShield, IconUsersGroup, IconPlus } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'
import SidebarShell from './SidebarShell'

export default async function AppSidebar({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUser()
  const links: Array<{ label: string; href: string; icon: React.ReactNode }> = [
    { label: 'Schedule', href: '/schedule', icon: <IconCalendar className="h-5 w-5 text-neutral-700" /> },
  ]
  if (me) {
    links.push({ label: 'My Requests', href: '/my-requests', icon: <IconClipboardList className="h-5 w-5 text-neutral-700" /> })
    links.push({ label: 'New Request', href: '/my-requests?new=1', icon: <IconPlus className="h-5 w-5 text-neutral-700" /> })
    if (me.role === 'driver') {
      links.push({ label: 'My Trips', href: '/my-trips', icon: <IconCar className="h-5 w-5 text-neutral-700" /> })
    }
    if (me.role === 'officer') {
      links.push({ label: 'Approvals', href: '/requests', icon: <IconShield className="h-5 w-5 text-neutral-700" /> })
      links.push({ label: 'Admin', href: '/admin', icon: <IconShield className="h-5 w-5 text-neutral-700" /> })
      links.push({ label: 'Members', href: '/admin/members', icon: <IconUsersGroup className="h-5 w-5 text-neutral-700" /> })
    }
    links.push({ label: 'Profile', href: '/profile', icon: <IconUser className="h-5 w-5 text-neutral-700" /> })
  } else {
    links.push({ label: 'Login', href: '/login', icon: <IconUser className="h-5 w-5 text-neutral-700" /> })
  }
  let resolvedUser: { name: string; title: string | null; avatarUrl: string | null } | undefined
  if (me) {
    const u = await prisma.user.findUnique({ where: { id: me.id }, select: { title: true } })
    let avatarUrl: string | null = null
    try {
      const rows = await prisma.$queryRaw<{ avatarUrl: string | null }[]>`SELECT "avatarUrl" FROM "User" WHERE "id" = ${me.id}`
      avatarUrl = rows?.[0]?.avatarUrl ?? null
    } catch {}
    resolvedUser = { name: me.name, title: u?.title ?? null, avatarUrl }
  }
  return <SidebarShell links={links} user={resolvedUser}>{children}</SidebarShell>
}
