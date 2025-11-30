import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import ProfileEditDialog from '@/components/profile/ProfileEditDialog'
import { removeAvatar } from '@/app/actions'


export default async function Page() {
  const me = await getCurrentUser()
  if (!me) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Please login</h1>
        <a className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm" href="/login">Go to Login</a>
      </main>
    )
  }

  const user = await prisma.user.findUnique({ where: { id: me.id } }) as any
  // Fetch avatarUrl via raw SQL to avoid Prisma client drift on environments
  // where client wasn't regenerated yet.
  let userAvatarUrl: string | null = null
  try {
    const rows = await prisma.$queryRaw<{ avatarUrl: string | null }[]>`SELECT "avatarUrl" FROM "User" WHERE "id" = ${me.id}`
    userAvatarUrl = rows?.[0]?.avatarUrl ?? null
  } catch {}
  const isDriver = me.role === 'driver'
  const bookings = await prisma.booking.findMany({
    where: isDriver ? { driverId: me.id } : { requesterId: me.id },
    include: { vehicle: true },
    orderBy: { startTime: 'desc' },
    take: 50,
  })

  return (
    <main className="mx-auto max-w-6xl p-6 space-y-6">
      {/* Profile header */}
      <Card>
        <CardHeader className="pb-0">
          <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500">View and update your profile details.</p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Avatar */}
            <div className="flex items-center justify-center md:justify-start">
              {userAvatarUrl ? (
                <div className="relative h-40 w-40 overflow-hidden rounded-full ring-8 ring-white shadow">
                  <Image src={userAvatarUrl} alt={user.name} fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-full bg-slate-200 text-4xl font-bold text-slate-700 ring-8 ring-white shadow">
                  {user?.name?.split(' ').map((p: string) => p[0]).join('').slice(0,2).toUpperCase()}
                </div>
              )}
            </div>
            {/* Details */}
            <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <div className="text-xs text-slate-500">Name</div>
                <div className="text-slate-900 font-medium">{user?.name}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Role</div>
                <div className="capitalize">{me.role}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Department</div>
                <div>{user?.department || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Title</div>
                <div>{user?.title || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Location</div>
                <div>{user?.location || '-'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Phone</div>
                <div>{user?.phone || '-'}</div>
              </div>
              {isDriver && (
                <>
                  <div>
                    <div className="text-xs text-slate-500">License No</div>
                    <div className="font-mono">{user?.driverLicenseNo || '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">License Expiry</div>
                    <div>{user?.driverLicenseExpiry ? new Date(user.driverLicenseExpiry).toLocaleDateString() : '-'}</div>
                  </div>
                </>
              )}
              <div className="sm:col-span-2 flex items-center gap-3">
                <ProfileEditDialog user={{
                  name: user?.name || '',
                  email: user?.email ?? null,
                  phone: user?.phone ?? null,
                  department: user?.department ?? null,
                  title: user?.title ?? null,
                  location: user?.location ?? null,
                  avatarUrl: userAvatarUrl,
                  driverLicenseNo: user?.driverLicenseNo ?? null,
                  driverLicenseExpiry: user?.driverLicenseExpiry ?? null,
                }} isDriver={isDriver} />
                {userAvatarUrl && (
                  <form action={removeAvatar}>
                    <Button type="submit" variant="outline">Remove Profile Picture</Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trip history */}
      <Card>
        <CardHeader className="pb-0">
          <h2 className="text-lg font-semibold text-slate-900">Trip History</h2>
        </CardHeader>
        <CardContent className="pt-4">
          {bookings.length === 0 ? (
            <div className="text-sm text-slate-500">No trips yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Vehicle</TH>
                    <TH>Purpose</TH>
                    <TH>Start</TH>
                    <TH>End</TH>
                    <TH>Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {bookings.map(b => (
                    <TR key={b.id}>
                      <TD className="font-medium text-slate-800">{b.vehicle.name}</TD>
                      <TD>{b.purpose}</TD>
                      <TD>{new Date(b.startTime).toLocaleString()}</TD>
                      <TD>{new Date(b.endTime).toLocaleString()}</TD>
                      <TD>
                        <span className={`rounded px-2 py-0.5 text-xs ${b.status === 'Completed' ? 'bg-green-100 text-green-700' : b.status === 'InUse' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{b.status}</span>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger zone: delete account */}
      <Card>
        <CardHeader className="pb-2">
          <h3 className="text-base font-semibold text-slate-900">Danger Zone</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-slate-900 font-medium">Delete my account</div>
              <div className="text-sm text-slate-500">This action is irreversible. You may be blocked if you have associated trips or requests.</div>
            </div>
            <form method="post" action="/api/account/delete">
              <Button type="submit" variant="outline">Delete Account</Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
