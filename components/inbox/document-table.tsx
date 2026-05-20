"use client"

import { useEffect, useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type RowSelectionState,
} from "@tanstack/react-table"
import { ArrowDownUp, FileText, Minus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "./status-badge"
import { AssigneePicker } from "./assignee-picker"
import type { Document, User } from "@/lib/types"
import { CURRENT_USER } from "@/lib/mock-data"

const columnHelper = createColumnHelper<Document>()

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

type Props = {
  documents: Document[]
  onDocumentsChange: (docs: Document[]) => void
  globalFilter: string
  statusFilter: string
  rowSelection: RowSelectionState
  onRowSelectionChange: (state: RowSelectionState) => void
}

export function DocumentTable({
  documents,
  onDocumentsChange,
  globalFilter,
  statusFilter,
  rowSelection,
  onRowSelectionChange,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  function updateAssignee(docId: string, user: User | null) {
    onDocumentsChange(
      documents.map((d) => (d.id === docId ? { ...d, assignedTo: user } : d))
    )
  }

  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => {
        const isAll = table.getIsAllPageRowsSelected()
        const isSome = table.getIsSomePageRowsSelected()
        return (
          <div
            role="checkbox"
            aria-checked={isAll ? true : isSome ? "mixed" : false}
            aria-label="Select all"
            tabIndex={0}
            onClick={() => table.toggleAllPageRowsSelected(!isAll)}
            onKeyDown={(e) => e.key === " " && table.toggleAllPageRowsSelected(!isAll)}
            className={`relative flex size-4 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-input transition-colors ${isAll || isSome ? "border-primary bg-primary text-primary-foreground" : ""}`}
          >
            {isAll && <ChevronDown className="hidden" />}
            {isSome && !isAll ? (
              <Minus className="h-3 w-3" />
            ) : isAll ? (
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </div>
        )
      },
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium text-slate-500 hover:text-slate-700"
          onClick={() => column.toggleSorting()}
        >
          ID <ArrowDownUp className="h-3 w-3" />
        </button>
      ),
      cell: (info) => (
        <span className="font-medium text-slate-900">{info.getValue()}</span>
      ),
    }),
    columnHelper.accessor("receivedDate", {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium text-slate-500 hover:text-slate-700"
          onClick={() => column.toggleSorting()}
        >
          Received Date <ArrowDownUp className="h-3 w-3" />
        </button>
      ),
      cell: (info) => (
        <span className="text-slate-600">{formatDate(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor("source", {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium text-slate-500 hover:text-slate-700"
          onClick={() => column.toggleSorting()}
        >
          Document Source <ArrowDownUp className="h-3 w-3" />
        </button>
      ),
      cell: (info) => <span className="text-slate-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor("fileName", {
      header: () => (
        <span className="font-medium text-slate-500">Mail</span>
      ),
      cell: (info) => (
        <span className="flex items-center gap-1.5 text-blue-500 underline cursor-pointer text-sm">
          <FileText className="h-4 w-4 shrink-0" />
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: () => <span className="font-medium text-slate-500">Status</span>,
      cell: (info) => <StatusBadge status={info.getValue()} />,
      filterFn: (row, _colId, filterValue) =>
        !filterValue || row.original.status === filterValue,
    }),
    columnHelper.accessor("assignedTo", {
      header: () => (
        <span className="font-medium text-slate-500">Assigned to</span>
      ),
      cell: (info) => (
        <AssigneePicker
          value={info.getValue()}
          onChange={(user) => updateAssignee(info.row.original.id, user)}
          currentUser={CURRENT_USER}
        />
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-3 rounded-md border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
            onClick={() => console.log("Review", row.original.id)}
          >
            Review
          </Button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: documents,
    columns,
    getRowId: (row) => row.id,
    state: { sorting, columnFilters, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _colId, filterValue) => {
      if (!filterValue) return true
      const q = (filterValue as string).toLowerCase()
      return (
        row.original.id.toLowerCase().includes(q) ||
        row.original.source.toLowerCase().includes(q)
      )
    },
  })

  // Sync status tab filter into TanStack column filter
  useEffect(() => {
    table.getColumn("status")?.setFilterValue(statusFilter || undefined)
  }, [statusFilter]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rounded-lg border border-slate-100 overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-slate-50 hover:bg-slate-50 border-slate-100">
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="text-xs h-10 py-2.5 px-4 font-medium text-slate-500"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-slate-400 py-10 text-sm"
              >
                No documents found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={`border-slate-100 transition-colors ${row.getIsSelected() ? "bg-slate-50" : "hover:bg-slate-50/50"}`}
                data-state={row.getIsSelected() ? "selected" : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-3 px-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
