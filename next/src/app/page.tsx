import Glow from '@/components/aceternity/Glow'
import SectionHeader from '@/components/aceternity/SectionHeader'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main className="relative mx-auto max-w-5xl px-6 py-16 text-center">
      <Glow />
      <div className="space-y-3">
        <SectionHeader title="IFRC Fleet Management" subtitle="Book, manage, and track IFRC fleet usage across staff, drivers, and officers." />
      </div>
      <div className="mt-8 flex items-center justify-center gap-3">
        <Button asChild>
          <a href="/login">Login</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/schedule">View Schedule</a>
        </Button>
      </div>
    </main>
  )
}
