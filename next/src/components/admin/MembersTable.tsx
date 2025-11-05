"use client"
import * as React from 'react'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ConfirmButton from '@/components/ui/confirm-button'
import FormRefresh from '@/components/FormRefresh'
import MemberEditDialog from '@/components/admin/MemberEditDialog'
import { adminDeleteUser } from '@/app/actions'
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

type MemberRow = {
  id: string
  name: string
  email: string
  phone: string
  department: string
  title: string
  role: 'staff' | 'driver' | 'officer'
  active: boolean
  location: string
}

const columns: ColumnDef<MemberRow>[] = [
  { accessorKey: 'name', header: ({ column }) => (
      <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Name</button>
    )
  },
  { accessorKey: 'email', header: 'Email', cell: ({ getValue }) => (getValue() ? String(getValue()) : <span className="text-slate-400">—</span>) },
  { accessorKey: 'phone', header: 'Phone', cell: ({ getValue }) => (getValue() ? String(getValue()) : <span className="text-slate-400">—</span>) },
  { accessorKey: 'department', header: 'Dept', cell: ({ getValue }) => (getValue() ? String(getValue()) : <span className="text-slate-400">—</span>) },
  { accessorKey: 'title', header: 'Title', cell: ({ getValue }) => (getValue() ? String(getValue()) : <span className="text-slate-400">—</span>) },
  { accessorKey: 'role', header: ({ column }) => (
      <button className="inline-flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>Role</button>
    ), cell: ({ getValue }) => <span className="capitalize">{String(getValue())}</span> },
  { accessorKey: 'active', header: 'Active', cell: ({ getValue }) => (getValue() ? <span className="text-green-600">Active</span> : <span className="text-slate-500">Disabled</span>) },
  { id: 'actions', header: 'Actions', cell: ({ row, table }) => {
      const r = row.original
      const drivers = (table.options.meta as any)?.drivers as { id: string; name: string }[] | undefined
      return (
        <div className="flex items-center gap-3">
          <MemberEditDialog user={r} drivers={drivers || []} />
          <form action={adminDeleteUser}>
            <input type="hidden" name="id" value={r.id} />
            <ConfirmButton className="text-red-600 hover:underline" confirmTitle="Delete member" confirmMessage="Are you sure? Blocked if last officer or has bookings.">Delete</ConfirmButton>
            <FormRefresh />
          </form>
        </div>
      )
    }
  },
]

export default function MembersTable({ users, drivers }: { users: any[]; drivers: { id: string; name: string }[] }) {
  const rows: MemberRow[] = React.useMemo(() => users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email || '',
    phone: u.phone || '',
    department: u.department || '',
    title: u.title || '',
    role: u.role,
    active: !!u.active,
    location: u.location || '',
  })), [users])

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
        row.original.name.toLowerCase().includes(v) ||
        row.original.email.toLowerCase().includes(v) ||
        row.original.phone.toLowerCase().includes(v) ||
        row.original.department.toLowerCase().includes(v) ||
        row.original.title.toLowerCase().includes(v) ||
        row.original.role.toLowerCase().includes(v)
      )
    },
    meta: { drivers },
  })

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <h2 className="font-medium text-slate-800">Members</h2>
        <div className="ml-auto">
          <Input placeholder="Search members..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="w-56" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-[1100px]">
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
