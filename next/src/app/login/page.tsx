import { getCurrentUser } from '@/lib/auth'
import { ROUTES } from '@/constants/routes'
import { redirect } from 'next/navigation'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet, Field, FieldLabel } from '@/components/ui/field'

export default async function Page({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const me = await getCurrentUser()
  if (me) {
    redirect(me.role === 'officer' ? ROUTES.admin : me.role === 'driver' ? ROUTES.myTrips : ROUTES.myRequests)
  }
  const sp = await searchParams
  const role = (sp?.role || '').toLowerCase()
  const hint = role === 'driver' ? 'Driver Login' : role === 'officer' ? 'Fleet Officer Login' : 'Login'
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <SectionHeader title={hint} />
      <form method="post" action="/api/auth/login">
        <FieldGroup>
          <FieldSet>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input name="email" type="email" required />
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input name="password" type="password" required />
            </Field>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Login</Button>
            <a className="text-sm text-slate-600 hover:underline" href="/signup">Create account</a>
          </Field>
        </FieldGroup>
      </form>
    </main>
  )
}
