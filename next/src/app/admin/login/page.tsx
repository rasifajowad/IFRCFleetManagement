export default function Page() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Fleet Officer Login</h1>
      <form method="post" action="/api/auth/login" className="space-y-3">
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Email</span>
          <input name="email" type="email" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Password</span>
          <input name="password" type="password" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <div>
          <button type="submit" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm">Login</button>
        </div>
      </form>
    </main>
  )
}

