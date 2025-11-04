import { addDriver, removeDriver } from '@/app/actions'
import FormRefresh from '@/components/FormRefresh'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function DriverList({ drivers }: { drivers: { id: string, name: string }[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="font-medium text-slate-800 mb-3">Drivers</h2>
      <form action={addDriver} className="flex gap-2 mb-3">
        <Input name="name" placeholder="New driver name" className="flex-1" />
        <Button type="submit">Add</Button>
        <FormRefresh />
      </form>
      <ul className="space-y-2">
        {drivers.map(d => (
          <li key={d.id} className="flex items-center justify-between text-sm">
            <span>{d.name}</span>
            <form action={removeDriver}>
              <input type="hidden" name="driverId" value={d.id} />
              <Button variant="ghost" className="text-red-600 hover:underline" type="submit">Remove</Button>
              <FormRefresh />
            </form>
          </li>
        ))}
      </ul>
    </div>
  )
}
