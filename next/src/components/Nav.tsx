import { getCurrentUser } from '@/lib/auth'

export default async function Nav() {
  const me = await getCurrentUser()
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4 text-sm">
        <a className="font-medium" href="/schedule">Schedule</a>
        {me?.role === 'staff' && <a href="/my-requests">My Requests</a>}
        {me?.role === 'officer' && <a href="/requests">Approvals</a>}
        {me?.role === 'driver' && <a href="/my-trips">My Trips</a>}
        {me?.role === 'officer' && <a href="/admin">Admin</a>}
        <div className="ml-auto flex items-center gap-3">
          {me ? (
            <>
              <span className="text-slate-600">{me.name} <span className="text-slate-400">({me.role})</span></span>
              <form method="post" action="/api/auth/logout">
                <button className="rounded-lg border px-3 py-1.5 hover:bg-slate-50" type="submit">Logout</button>
              </form>
            </>
          ) : (
            <>
              <a href="/login" className="rounded-lg border px-3 py-1.5 hover:bg-slate-50">Login</a>
              <a href="/signup" className="rounded-lg border px-3 py-1.5 hover:bg-slate-50">Sign Up</a>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

