import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SignupForm from '@/components/auth/SignupForm'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'

export default async function Page() {
  const me = await getCurrentUser()
  if (me) {
    redirect(me.role === 'officer' ? '/admin' : me.role === 'driver' ? '/my-trips' : '/my-requests')
  }
  return (
    <main className="min-h-[90vh] grid place-items-center p-6">
      <Card className="w-full max-w-md mt-16 mb-16">
        <CardHeader>
          <SectionHeader
            title="Create Account"
            subtitle="Staff and drivers can sign up. Fleet officer accounts are managed separately."
          />
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
        <CardFooter className="pb-8">
          <div className="text-sm text-slate-600">
            Already have an account? <a className="underline" href="/login">Go to Login</a>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
