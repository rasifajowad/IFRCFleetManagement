import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function Page() {
  const me = await getCurrentUser()
  if (me) {
    redirect(me.role === 'officer' ? '/admin' : me.role === 'driver' ? '/my-trips' : '/my-requests')
  }
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <SectionHeader title="Fleet Officer Login" />
      <form method="post" action="/api/auth/login" className="space-y-3">
        <div className="block">
          <Label>Email</Label>
          <Input name="email" type="email" required />
        </div>
        <div className="block">
          <Label>Password</Label>
          <Input name="password" type="password" required />
        </div>
        <div>
          <Button type="submit">Login</Button>
        </div>
      </form>
    </main>
  )
}
