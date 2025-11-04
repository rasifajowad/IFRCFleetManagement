export default function Page() {
  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Account</h1>
      <p className="text-sm text-slate-600 mb-4">Staff and drivers can sign up. Fleet officer accounts are managed separately.</p>
      <form method="post" action="/api/auth/signup" className="space-y-3">
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Name</span>
          <input name="name" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Email</span>
          <input name="email" type="email" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Password</span>
          <input name="password" type="password" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Role</span>
          <select name="role" defaultValue="staff" className="w-full rounded-xl border border-slate-300 px-3 py-2">
            <option value="staff">Staff</option>
            <option value="driver">Driver</option>
            <option value="officer" disabled>Fleet Officer (not allowed)</option>
          </select>
        </label>
        <div>
          <button type="submit" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm">Sign Up</button>
        </div>
      </form>
    </main>
  )
}

