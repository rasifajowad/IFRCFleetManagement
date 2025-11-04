export default function Home() {
  return (
    <main className="mx-auto max-w-4xl p-8 text-center">
      <h1 className="text-3xl font-semibold mb-3">IFRC Fleet Management</h1>
      <p className="text-slate-600">Book, manage, and track IFRC fleet usage across staff, drivers, and fleet officers.</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <a className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm" href="/login">Login</a>
        <a className="rounded-xl border border-slate-300 px-4 py-2 text-sm" href="/schedule">View Schedule</a>
      </div>
    </main>
  )
}
