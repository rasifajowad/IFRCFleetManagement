import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SignupForm from '@/components/auth/SignupForm'
import SectionHeader from '@/components/aceternity/SectionHeader'

export default async function Page() {
  const me = await getCurrentUser()
  if (me) {
    redirect(me.role === 'officer' ? '/admin' : me.role === 'driver' ? '/my-trips' : '/my-requests')
  }
  return (
    <main className="mx-auto max-w-md p-6 space-y-3">
      <SectionHeader title="Create Account" subtitle="Staff and drivers can sign up. Fleet officer accounts are managed separately." />
      <SignupForm />
    </main>
  )
}
