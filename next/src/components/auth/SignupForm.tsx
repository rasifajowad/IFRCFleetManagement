"use client"
import { useEffect, useMemo, useState } from 'react'
import { FieldGroup, FieldSet, Field, FieldLabel, FieldSeparator, FieldLegend } from '@/components/ui/field'

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
    <form method="post" action="/api/auth/signup">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Account</FieldLegend>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <input name="name" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <input name="email" type="email" required className="w-full rounded-xl border border-slate-300 px-3 py-2" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Password</FieldLabel>
              <input name="password" type="password" required minLength={8} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </Field>
            <Field>
              <FieldLabel>Confirm Password</FieldLabel>
              <input name="confirmPassword" type="password" required minLength={8} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </Field>
          </div>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Details</FieldLegend>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Phone (optional)</FieldLabel>
              <input name="phone" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </Field>
            <Field>
              <FieldLabel>Department (optional)</FieldLabel>
              <input name="department" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field>
              <FieldLabel>Title (optional)</FieldLabel>
              <input name="title" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </Field>
            <Field>
              <FieldLabel>Location (optional)</FieldLabel>
              <input name="location" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
            </Field>
          </div>
        </FieldSet>
        <FieldSet>
          <FieldLegend>Role</FieldLegend>
          <Field>
            <FieldLabel>Role</FieldLabel>
            <select name="role" value={role} onChange={e => setRole(e.target.value as any)} className="w-full rounded-xl border border-slate-300 px-3 py-2">
              <option value="staff">Staff</option>
              <option value="driver">Driver</option>
              <option value="officer" disabled>Fleet Officer (not allowed)</option>
            </select>
          </Field>
          {isDriver && (
            <div className="grid sm:grid-cols-2 gap-3">
              <Field>
                <FieldLabel>License No (16 chars)</FieldLabel>
                <input
                  name="driverLicenseNo"
                  required
                  minLength={16}
                  maxLength={16}
                  pattern={"[A-Za-z0-9]{16}"}
                  title="Exactly 16 alphanumeric characters"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </Field>
              <Field>
                <FieldLabel>License Expiry</FieldLabel>
                <input
                  type="date"
                  name="driverLicenseExpiry"
                  required
                  min={today}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2"
                />
              </Field>
            </div>
          )}
        </FieldSet>
        <Field orientation="horizontal">
          <button type="submit" className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm">Sign Up</button>
        </Field>
      </FieldGroup>
    </form>
  )
}
