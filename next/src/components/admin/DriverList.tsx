import { addDriver, removeDriver } from '@/app/actions'

export default function DriverList({ drivers }: { drivers: { id: string, name: string }[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-medium text-slate-800 mb-3">Drivers</h2>
      <form action={addDriver} className="flex gap-2 mb-3">
        <input name="name" placeholder="New driver name" className="flex-1 rounded-xl border border-slate-300 px-3 py-2" />
        <button type="submit" className="rounded-xl bg-slate-900 text-white px-3 py-2 text-sm">Add</button>
      </form>
      <ul className="space-y-2">
        {drivers.map(d => (
          <li key={d.id} className="flex items-center justify-between text-sm">
            <span>{d.name}</span>
            <form action={removeDriver}>
              <input type="hidden" name="driverId" value={d.id} />
              <button className="text-red-600 hover:underline" type="submit">Remove</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}

