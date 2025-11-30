"use client"
import * as React from 'react'
import { deleteBooking, updateBookingStatus } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import ConfirmButton from '@/components/ui/confirm-button'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import FormRefresh from '@/components/FormRefresh'
import { SubmitToast } from '@/components/ui/toast'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'

type BookingRow = {
  id: string
  vehicle: string
  driver: string
  requester: string
  startTime: Date
  endTime: Date
  status: string
}

function BookingEdit({ row }: { row: BookingRow }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">Edit</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit booking</DialogTitle>
        </DialogHeader>
        <form action={updateBookingStatus} className="space-y-3">
          <input type="hidden" name="bookingId" value={row.id} />
          <label className="block text-sm">Status</label>
          <Select name="status" defaultValue={row.status}>
            <option value="Booked">Booked</option>
            <option value="InUse">InUse</option>
            <option value="Completed">Completed</option>
          </Select>
          <div className="flex justify-end gap-2">
            <Button type="submit">Save</Button>
            <SubmitToast success="Booking updated" error="Update failed" />
            <FormRefresh />
          </div>
        </form>
        <div className="border-t pt-3 mt-2">
          <form action={deleteBooking} className="flex items-center justify-between">
            <input type="hidden" name="bookingId" value={row.id} />
            <div className="text-sm text-slate-600">Delete this booking</div>
            <ConfirmButton className="text-red-600" confirmTitle="Delete booking" confirmMessage="Are you sure? This cannot be undone.">Delete</ConfirmButton>
            <FormRefresh />
          </form>
        </div>
        {/* Close handled by top-right icon in DialogContent */}
      </DialogContent>
    </Dialog>
  )
}

const columns: ColumnDef<BookingRow>[] = [
  { accessorKey: 'id', header: 'Booking', cell: ({ getValue }) => <span className="font-mono text-xs">{String(getValue())}</span> },
  { accessorKey: 'vehicle', header: 'Vehicle' },
  { accessorKey: 'driver', header: 'Driver' },
  { accessorKey: 'requester', header: 'Requester' },
  { accessorKey: 'startTime', header: 'Start', cell: ({ getValue }) => new Date(getValue() as any).toLocaleString() },
  { accessorKey: 'endTime', header: 'End', cell: ({ getValue }) => new Date(getValue() as any).toLocaleString() },
  { accessorKey: 'status', header: ({ column }) => (
      <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Status
      </button>
    ),
  },
  { id: 'actions', header: 'Actions', cell: ({ row }) => <BookingEdit row={row.original} /> },
]

export default function BookingsTable({ bookings }: {
  bookings: { id: string, status: string, startTime: string | Date, endTime: string | Date, vehicle: { name: string }, driver: { name: string }, requester: { name: string } }[]
}) {
  const rows: BookingRow[] = React.useMemo(() => bookings.map(b => ({
    id: b.id,
    vehicle: b.vehicle.name,
    driver: b.driver.name,
    requester: b.requester.name,
    startTime: new Date(b.startTime),
    endTime: new Date(b.endTime),
    status: b.status,
  })), [bookings])

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const v = String(filterValue).toLowerCase()
      return (
        row.original.id.toLowerCase().includes(v) ||
        row.original.vehicle.toLowerCase().includes(v) ||
        row.original.driver.toLowerCase().includes(v) ||
        row.original.requester.toLowerCase().includes(v) ||
        row.original.status.toLowerCase().includes(v)
      )
    },
  })

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h2 className="font-medium text-slate-800">Bookings</h2>
        <div className="ml-auto flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <Input
            placeholder="Search bookings..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full min-w-[220px] sm:w-56"
          />
          <a href="/api/export/completed" className="whitespace-nowrap rounded-xl bg-slate-900 text-white px-3 py-2 text-sm">Export Completed Trips</a>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <THead>
            <TR>
              {table.getFlatHeaders().map(h => (
                <TH key={h.id} onClick={h.column.getCanSort() ? () => h.column.toggleSorting(h.column.getIsSorted() === 'asc') : undefined} className={h.column.getCanSort() ? 'cursor-pointer select-none' : ''}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </TH>
              ))}
            </TR>
          </THead>
          <TBody>
            {table.getRowModel().rows.map(r => (
              <TR key={r.id} className="odd:bg-muted/40 hover:bg-muted transition-colors">
                {r.getVisibleCells().map(c => (
                  <TD key={c.id}>{flexRender(c.column.columnDef.cell, c.getContext())}</TD>
                ))}
              </TR>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <TR><TD colSpan={columns.length} className="h-24 text-center">No results.</TD></TR>
            )}
          </TBody>
        </Table>
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <div className="text-slate-600">{table.getRowCount()} total</div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
        </div>
      </div>
    </div>
  )
}
