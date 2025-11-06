import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ContainerTextFlip } from '@/components/ui/container-text-flip'

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* soft backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-10%,rgba(239,68,68,0.08),transparent),radial-gradient(1000px_500px_at_110%_10%,rgba(239,68,68,0.06),transparent)]" />

      <div className="mx-auto max-w-7xl px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-10">
          {/* Left copy */}
          <div className="md:col-span-12">
            <h1 className="text-slate-900 tracking-wide font-semibold text-4xl mt-8">IFRC</h1>
            <h1 className="text-5xl md:text-7xl font-bold tracking-normal">
              <span className="text-red-600">Fleet</span>
              <span className="text-slate-900">Mate</span>
            </h1>
            <h2 className="mt-10 text-3xl font-medium text-slate-900/90 tracking-tight">
              <ContainerTextFlip words={["Book", "Track", "Manage"]}/> IFRC Fleet usage across employees
            </h2>
            {/* <h2 className="mt-3 text-3xl font-medium text-slate-900/90 tracking-tight">
              across employees
            </h2> */}
            
            <div className="mt-10 flex items-center gap-4">
              <Button asChild size="lg" className="rounded-full">
                <a href="/login">Login</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href="/signup">Sign Up</a>
              </Button>
            </div>
          </div>

          {/* Right media cluster removed for now */}
        </div>
      </div>
    </main>
  )
}
