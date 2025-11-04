export default function Glow() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-sky-400/30 via-fuchsia-400/20 to-indigo-400/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] translate-x-1/3 translate-y-1/3 rounded-full bg-gradient-to-tr from-amber-300/20 via-rose-300/20 to-purple-300/20 blur-3xl" />
    </div>
  )
}

