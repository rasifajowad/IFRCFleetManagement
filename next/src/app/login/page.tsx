import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default async function Page({ searchParams }: { searchParams?: { role?: string } }) {
  const me = await getCurrentUser()
  if (me) {
    redirect(me.role === 'officer' ? '/admin' : me.role === 'driver' ? '/my-trips' : '/my-requests')
  }
  const role = (searchParams?.role || '').toLowerCase()
  const hint = role === 'driver' ? 'Driver Login' : role === 'officer' ? 'Fleet Officer Login' : 'Login'
  return (
    <main className="mx-auto max-w-md p-6 space-y-4">
      <SectionHeader title={hint} />
      <form method="post" action="/api/auth/login" className="space-y-3">
        <div className="block">
          <Label>Email</Label>
          <Input name="email" type="email" required />
        </div>
        <div className="block">
          <Label>Password</Label>
          <Input name="password" type="password" required />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit">Login</Button>
          <a className="text-sm text-slate-600 hover:underline" href="/signup">Create account</a>
        </div>
      </form>
    </main>
  )
}
