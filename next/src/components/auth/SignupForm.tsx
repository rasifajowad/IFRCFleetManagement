"use client"
import { useEffect, useMemo, useState } from 'react'

export default function SignupForm() {
  const [role, setRole] = useState<'staff'|'driver'|'officer'>('staff')
  const today = useMemo(() => new Date().toISOString().slice(0,10), [])
  const isDriver = role === 'driver'

  useEffect(() => {
    // If role changes away from driver, clear driver-only fields so they don't submit stale values
    if (!isDriver) {
      const ln = document.querySelector<HTMLInputElement>('input[name="driverLicenseNo"]')
      const le = document.querySelector<HTMLInputElement>('input[name="driverLicenseExpiry"]')
      if (ln) ln.value = ''
      if (le) le.value = ''
    }
  }, [isDriver])

  return (
    <form method="post" action="/api/auth/signup" className="space-y-3">
      <label className="block">
        <span className="block text-sm text-slate-600 mb-1">Name</span>
        <input name="name" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </label>
      <label className="block">
        <span className="block text-sm text-slate-600 mb-1">Email</span>
        <input name="email" type="email" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </label>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Password</span>
          <input name="password" type="password" required minLength={8} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Confirm Password</span>
          <input name="confirmPassword" type="password" required minLength={8} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Phone (optional)</span>
          <input name="phone" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Department (optional)</span>
          <input name="department" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Title (optional)</span>
          <input name="title" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
        <label className="block">
          <span className="block text-sm text-slate-600 mb-1">Location (optional)</span>
          <input name="location" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
      </div>
      <label className="block">
        <span className="block text-sm text-slate-600 mb-1">Role</span>
        <select name="role" value={role} onChange={e => setRole(e.target.value as any)} className="w-full rounded-xl border border-slate-300 px-3 py-2">
          <option value="staff">Staff</option>
          <option value="driver">Driver</option>
          <option value="officer" disabled>Fleet Officer (not allowed)</option>
        </select>
      </label>
      {isDriver && (
        <div className="grid sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-sm text-slate-600 mb-1">License No (16 chars)</span>
            <input
              name="driverLicenseNo"
              required
              minLength={16}
              maxLength={16}
              pattern={"[A-Za-z0-9]{16}"}
              title="Exactly 16 alphanumeric characters"
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-slate-600 mb-1">License Expiry</span>
            <input
              type="date"
              name="driverLicenseExpiry"
              required
              min={today}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            />
          </label>
        </div>
      )}
      <div>
        <button type="submit" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm">Sign Up</button>
      </div>
    </form>
  )
}

