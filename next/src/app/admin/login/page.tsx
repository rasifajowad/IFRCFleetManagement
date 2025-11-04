import { getCurrentUser } from '@/lib/auth'
import { ROUTES } from '@/constants/routes'
import { redirect } from 'next/navigation'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FieldGroup, FieldSet, Field, FieldLabel } from '@/components/ui/field'

export default async function Page() {
  const me = await getCurrentUser()
  if (me) {
    redirect(me.role === 'officer' ? ROUTES.admin : me.role === 'driver' ? ROUTES.myTrips : ROUTES.myRequests)
  }
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <SectionHeader title="Fleet Officer Login" />
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
          </Field>
        </FieldGroup>
      </form>
    </main>
  )
}
