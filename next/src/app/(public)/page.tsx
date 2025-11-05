import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ContainerTextFlip } from '@/components/ui/container-text-flip'

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* soft backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1200px_600px_at_-10%_-10%,rgba(239,68,68,0.08),transparent),radial-gradient(1000px_500px_at_110%_10%,rgba(239,68,68,0.06),transparent)]" />

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-10">
          {/* Left copy */}
          <div className="md:col-span-7">
            <h1 className="mt-8 text-5xl md:text-7xl font-extrabold tracking-tight">
              <span className="text-red-600">IFRC Fleet</span>
              <span className="text-slate-900">Mate</span>
            </h1>
            <h2 className="mt-3 text-3xl font-medium text-slate-900/90 tracking-tight">
              <ContainerTextFlip words={["Book", "Track", "Manage"]}/> IFRC Fleet usage
            </h2>
            <h2 className="mt-3 text-3xl font-medium text-slate-900/90 tracking-tight">
              across employees
            </h2>
            
            <div className="mt-10 flex items-center gap-4">
              <Button asChild size="lg" className="rounded-full">
                <a href="/login">Login</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <a href="/signup">Sign Up</a>
              </Button>
            </div>
          </div>

          {/* Right media cluster */}
          <div className="md:col-span-5 relative min-h-[320px] md:min-h-[420px]">
            {/* main circle */}
            <div className="absolute right-6 top-0 h-60 w-60 md:h-72 md:w-72 rounded-full bg-white shadow-xl ring-8 ring-white relative">
              <div className="absolute inset-2 rounded-full overflow-hidden">
                <Image src="/car.svg" alt="Vehicle" fill className="object-contain p-8" />
              </div>
            </div>
            {/* lower-left circle */}
            <div className="absolute left-0 bottom-2 h-40 w-40 md:h-52 md:w-52 rounded-full bg-white shadow-xl ring-8 ring-white relative">
              <div className="absolute inset-2 rounded-full overflow-hidden">
                <Image src="/car.svg" alt="Emergency" fill className="object-contain p-6" />
              </div>
            </div>
            {/* right circle */}
            <div className="absolute right-0 bottom-6 h-44 w-44 md:h-56 md:w-56 rounded-full bg-white shadow-xl ring-8 ring-white relative">
              <div className="absolute inset-2 rounded-full overflow-hidden">
                <Image src="/car.svg" alt="Rescue" fill className="object-contain p-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
