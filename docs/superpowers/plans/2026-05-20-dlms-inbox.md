# DLMS Document Inbox Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a Next.js 14 App Router project implementing the DLMS Document Inbox screen pixel-perfectly from Figma, with full interactivity (tab filtering, search, column sort, inline assignee picker, row expand).

**Architecture:** Next.js App Router with shadcn/ui components and TanStack Table for the document grid. All state lives in a single `useState` in `InboxPage`; the table receives the filtered/sorted data via TanStack. Mock data is a static typed TS module.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, @tanstack/react-table, lucide-react, Outfit font via next/font/google.

---

## File Map

| File | Purpose |
|---|---|
| `app/layout.tsx` | Root layout: Outfit font, CSS variables, html/body |
| `app/globals.css` | Tailwind base + design token CSS variables |
| `app/page.tsx` | Redirect to /inbox |
| `app/inbox/page.tsx` | Inbox route — renders `<InboxPage>` |
| `lib/types.ts` | DocumentStatus, User, Document types |
| `lib/mock-data.ts` | MOCK_DOCUMENTS, MOCK_USERS, CURRENT_USER |
| `components/inbox/status-badge.tsx` | Colored pill for document status |
| `components/inbox/assignee-picker.tsx` | Popover to reassign a document |
| `components/inbox/document-table.tsx` | TanStack Table: columns, sort, filter, row expand |
| `components/inbox/inbox-page.tsx` | Full page shell: header, tabs, table |
| `components/layout/nav-bar.tsx` | Top nav: logo, links, search, bell, profile |

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: all Next.js boilerplate in project root

- [ ] **Step 1: Bootstrap project**

```bash
cd /Users/macbookair/Documents/DLMS
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --yes
```

Expected: Next.js project created. `package.json`, `app/`, `tailwind.config.ts`, `tsconfig.json` all present.

- [ ] **Step 2: Install additional dependencies**

```bash
npm install @tanstack/react-table lucide-react
```

- [ ] **Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init -d
```

- [ ] **Step 4: Add required shadcn components**

```bash
npx shadcn@latest add button badge checkbox input tabs separator popover dropdown-menu table
```

- [ ] **Step 5: Commit scaffold**

```bash
git add -A && git commit -m "feat: scaffold Next.js project with shadcn/ui and TanStack Table"
```

---

## Task 2: Types and mock data

**Files:**
- Create: `lib/types.ts`
- Create: `lib/mock-data.ts`

- [ ] **Step 1: Create `lib/types.ts`**

```typescript
export type DocumentStatus =
  | "To Do"
  | "Draft"
  | "In Progress"
  | "Submitted for Validation"
  | "Validated"

export type User = {
  id: string
  name: string
  initials: string
  email: string
  avatarUrl?: string
}

export type Document = {
  id: string
  receivedDate: string // ISO date string
  source: string
  fileName: string
  status: DocumentStatus
  assignedTo: User | null
}
```

- [ ] **Step 2: Create `lib/mock-data.ts`**

```typescript
import type { Document, User } from "./types"

export const MOCK_USERS: User[] = [
  { id: "1", name: "Johny Depp",        initials: "JPP", email: "johny.depp@swlegal.ch" },
  { id: "2", name: "Ehsan Clario",      initials: "EIO", email: "ehsan.clario@swlegal.ch" },
  { id: "3", name: "Stephanie Sharkey", initials: "SEY", email: "stephanie.sharkey@swlegal.ch" },
  { id: "4", name: "Harry Morningstar", initials: "HAR", email: "harry.morningstar@swlegal.ch" },
  { id: "5", name: "Mary Depp",         initials: "MPP", email: "mary.depp@swlegal.ch" },
]

export const CURRENT_USER = MOCK_USERS[0]

export const MOCK_DOCUMENTS: Document[] = [
  { id: "DOC-001", receivedDate: "2026-04-21", source: "FINMA",        fileName: "document.pdf", status: "In Progress",             assignedTo: MOCK_USERS[0] },
  { id: "DOC-002", receivedDate: "2026-04-24", source: "Judicial Mail", fileName: "document.pdf", status: "Submitted for Validation", assignedTo: MOCK_USERS[1] },
  { id: "DOC-003", receivedDate: "2026-05-04", source: "Justitia",      fileName: "document.pdf", status: "To Do",                   assignedTo: MOCK_USERS[2] },
  { id: "DOC-004", receivedDate: "2026-05-03", source: "FINMA",         fileName: "document.pdf", status: "To Do",                   assignedTo: null },
  { id: "DOC-005", receivedDate: "2026-05-05", source: "Justitia",      fileName: "document.pdf", status: "Draft",                   assignedTo: null },
]
```

- [ ] **Step 3: Commit**

```bash
git add lib/ && git commit -m "feat: add Document/User types and mock data"
```

---

## Task 3: Global styles and fonts

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Update `app/globals.css`**

Replace the file content with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --base-primary: #0f172a;
  --base-primary-foreground: #f8fafc;
  --base-foreground: #0f172a;
  --base-background: #ffffff;
  --base-muted: #f1f5f9;
  --base-muted-foreground: #64748b;
  --base-input: #e2e8f0;
  --base-accent: #f8fafc;
  --base-secondary-foreground: #0f172a;
  --border-radius-full: 9999px;
  --border-radius-2xl: 20px;
  --border-radius-lg: 8px;
  --border-radius-md: 6px;
}

* {
  box-sizing: border-box;
}
```

- [ ] **Step 2: Update `tailwind.config.ts`** — add Outfit to fontFamily.sans

```typescript
import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3: Update `app/layout.tsx`** — load Outfit font

```typescript
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"

const outfit = Outfit({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DLMS — Document Inbox",
  description: "Deadline Management System",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 4: Update `app/page.tsx`** — redirect to /inbox

```typescript
import { redirect } from "next/navigation"

export default function Home() {
  redirect("/inbox")
}
```

- [ ] **Step 5: Commit**

```bash
git add app/ tailwind.config.ts && git commit -m "feat: configure Outfit font and design token CSS variables"
```

---

## Task 4: StatusBadge component

**Files:**
- Create: `components/inbox/status-badge.tsx`

- [ ] **Step 1: Create `components/inbox/status-badge.tsx`**

```typescript
import type { DocumentStatus } from "@/lib/types"

const STATUS_STYLES: Record<DocumentStatus, string> = {
  "In Progress":             "bg-blue-50 text-blue-500 border-blue-100",
  "Submitted for Validation":"bg-blue-50 text-blue-500 border-blue-100",
  "To Do":                   "bg-red-50 text-red-500 border-red-100",
  "Draft":                   "bg-amber-50 text-amber-600 border-amber-100",
  "Validated":               "bg-green-100 text-green-600 border-green-200",
}

export function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ && git commit -m "feat: add StatusBadge component"
```

---

## Task 5: AssigneePicker component

**Files:**
- Create: `components/inbox/assignee-picker.tsx`

- [ ] **Step 1: Create `components/inbox/assignee-picker.tsx`**

```typescript
"use client"

import { useState } from "react"
import { Check, Search, UserMinus } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import type { User } from "@/lib/types"
import { MOCK_USERS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

type Props = {
  value: User | null
  onChange: (user: User | null) => void
  currentUser: User
}

export function AssigneePicker({ value, onChange, currentUser }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = MOCK_USERS.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  )

  function select(user: User | null) {
    onChange(user)
    setOpen(false)
    setSearch("")
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-2 text-left w-full">
          {value ? (
            <>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                {value.initials[0]}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-slate-900">{value.name}</span>
                <span className="text-xs text-slate-500">{value.initials}</span>
              </span>
            </>
          ) : (
            <span className="flex flex-col leading-tight">
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <UserMinus className="h-4 w-4" />
                Unassigned
              </span>
              <button
                className="text-xs text-blue-500 underline text-left"
                onClick={(e) => { e.stopPropagation(); select(currentUser) }}
              >
                Assign to me
              </button>
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 rounded-full text-sm"
          />
        </div>
        <ul className="space-y-0.5">
          <li>
            <button
              onClick={() => select(null)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100",
                value === null && "bg-slate-100"
              )}
            >
              <UserMinus className="h-4 w-4" />
              Unassigned
              {value === null && <Check className="ml-auto h-4 w-4" />}
            </button>
          </li>
          {filtered.map((u) => (
            <li key={u.id}>
              <button
                onClick={() => select(u)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-100",
                  value?.id === u.id && "bg-slate-100"
                )}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                  {u.initials[0]}
                </span>
                <span className="flex flex-col leading-tight text-left">
                  <span className="font-medium text-slate-900">{u.name}</span>
                  <span className="text-xs text-slate-500">{u.initials}</span>
                </span>
                {value?.id === u.id && <Check className="ml-auto h-4 w-4 text-slate-500" />}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ && git commit -m "feat: add AssigneePicker popover component"
```

---

## Task 6: NavBar component

**Files:**
- Create: `components/layout/nav-bar.tsx`

- [ ] **Step 1: Create `components/layout/nav-bar.tsx`**

```typescript
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { User } from "@/lib/types"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/inbox",    label: "Inbox" },
  { href: "/calendar", label: "Calendar" },
  { href: "/reports",  label: "Reports" },
]

type Props = {
  currentUser: User
  searchValue: string
  onSearchChange: (value: string) => void
}

export function NavBar({ currentUser, searchValue, onSearchChange }: Props) {
  const pathname = usePathname()

  return (
    <div className="flex items-center justify-between px-6 py-6 shrink-0 w-full">
      {/* Left: logo + nav links */}
      <div className="flex items-center gap-1 bg-white rounded-full h-14 pl-4 pr-2.5 py-2 shadow-none">
        {/* Logo */}
        <div className="pr-10 flex items-center shrink-0">
          <svg width="134" height="36" viewBox="0 0 134 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="0" y="22" fontFamily="Outfit, sans-serif" fontSize="13" fontWeight="700" fill="#C8102E">Schellenberg</text>
            <text x="0" y="34" fontFamily="Outfit, sans-serif" fontSize="13" fontWeight="400" fill="#1A1A1A">Wittmer</text>
          </svg>
        </div>
        {/* Nav links */}
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-center h-9 px-4 rounded-full text-sm font-medium transition-colors",
                active
                  ? "bg-slate-900 text-slate-50 shadow-sm"
                  : "bg-transparent text-slate-900 hover:bg-slate-100"
              )}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* Right: search, bell, profile */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Search */}
        <div className="relative w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 rounded-full border-slate-200 bg-white text-sm"
          />
        </div>
        {/* Bell */}
        <button className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm hover:bg-slate-50 transition-colors">
          <Bell className="h-5 w-5 text-slate-700" />
        </button>
        {/* Profile */}
        <div className="flex h-14 items-center gap-3 bg-white rounded-[70px] pl-1.5 pr-3 py-1.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-11 w-11 rounded-full bg-slate-300 flex items-center justify-center text-sm font-semibold text-slate-700 shrink-0">
              {currentUser.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-900">{currentUser.name}</span>
              <span className="text-xs text-slate-500">{currentUser.email}</span>
            </div>
          </div>
          <ChevronDown className="h-5 w-5 text-slate-700 shrink-0" />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ && git commit -m "feat: add NavBar component"
```

---

## Task 7: DocumentTable component

**Files:**
- Create: `components/inbox/document-table.tsx`

- [ ] **Step 1: Create `components/inbox/document-table.tsx`**

```typescript
"use client"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
  type ExpandedState,
} from "@tanstack/react-table"
import { ArrowDownUp, ChevronDown, ChevronRight, FileText } from "lucide-react"
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
}

export function DocumentTable({ documents, onDocumentsChange, globalFilter, statusFilter }: Props) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [rowSelection, setRowSelection] = useState({})

  function updateAssignee(docId: string, user: User | null) {
    onDocumentsChange(
      documents.map((d) => (d.id === docId ? { ...d, assignedTo: user } : d))
    )
  }

  const columns = [
    columnHelper.display({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
    }),
    columnHelper.accessor("id", {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium"
          onClick={() => column.toggleSorting()}
        >
          ID <ArrowDownUp className="h-3 w-3 text-slate-400" />
        </button>
      ),
      cell: (info) => <span className="font-medium text-slate-900">{info.getValue()}</span>,
    }),
    columnHelper.accessor("receivedDate", {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium"
          onClick={() => column.toggleSorting()}
        >
          Received Date <ArrowDownUp className="h-3 w-3 text-slate-400" />
        </button>
      ),
      cell: (info) => formatDate(info.getValue()),
    }),
    columnHelper.accessor("source", {
      header: ({ column }) => (
        <button
          className="flex items-center gap-1 font-medium"
          onClick={() => column.toggleSorting()}
        >
          Document Source <ArrowDownUp className="h-3 w-3 text-slate-400" />
        </button>
      ),
    }),
    columnHelper.accessor("fileName", {
      header: "Mail",
      cell: (info) => (
        <span className="flex items-center gap-1.5 text-blue-500 underline cursor-pointer">
          <FileText className="h-4 w-4 shrink-0" />
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => <StatusBadge status={info.getValue()} />,
      filterFn: (row, _colId, filterValue) =>
        filterValue === "" || row.original.status === filterValue,
    }),
    columnHelper.accessor("assignedTo", {
      header: "Assigned to",
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
          {row.original.status === "In Progress" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => console.log("Review", row.original.id)}
            >
              Review
            </Button>
          )}
          <button
            onClick={() => row.toggleExpanded()}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            {row.getIsExpanded()
              ? <ChevronDown className="h-4 w-4" />
              : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: documents,
    columns,
    state: { sorting, columnFilters, expanded, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onExpandedChange: setExpanded,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    globalFilterFn: (row, _colId, filterValue) => {
      const q = filterValue.toLowerCase()
      return (
        row.original.id.toLowerCase().includes(q) ||
        row.original.source.toLowerCase().includes(q)
      )
    },
  })

  // Apply status tab filter
  const statusCol = table.getColumn("status")
  const currentFilter = statusCol?.getFilterValue() as string | undefined
  if ((statusFilter || "") !== (currentFilter || "")) {
    statusCol?.setFilterValue(statusFilter || "")
  }

  return (
    <div className="rounded-lg border border-slate-100 overflow-hidden">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-slate-50 hover:bg-slate-50">
              {hg.headers.map((header) => (
                <TableHead key={header.id} className="text-xs font-medium text-slate-500 h-10">
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
              <TableCell colSpan={columns.length} className="text-center text-slate-400 py-8">
                No documents found.
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <>
                <TableRow key={row.id} className="hover:bg-slate-50 border-slate-100">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow key={`${row.id}-expanded`} className="bg-slate-50">
                    <TableCell colSpan={columns.length} className="py-3 pl-8 text-sm text-slate-400">
                      No details yet.
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ && git commit -m "feat: add DocumentTable with TanStack Table"
```

---

## Task 8: InboxPage component

**Files:**
- Create: `components/inbox/inbox-page.tsx`
- Create: `app/inbox/page.tsx`

- [ ] **Step 1: Create `components/inbox/inbox-page.tsx`**

```typescript
"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { NavBar } from "@/components/layout/nav-bar"
import { DocumentTable } from "./document-table"
import type { Document, DocumentStatus } from "@/lib/types"
import { MOCK_DOCUMENTS, MOCK_USERS, CURRENT_USER } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const TABS: Array<{ label: string; value: DocumentStatus | "" }> = [
  { label: "All Documents",            value: "" },
  { label: "To Do",                    value: "To Do" },
  { label: "Draft",                    value: "Draft" },
  { label: "In Progress",              value: "In Progress" },
  { label: "Submitted for Validation", value: "Submitted for Validation" },
  { label: "Validated",                value: "Validated" },
]

export function InboxPage() {
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS)
  const [activeTab, setActiveTab] = useState<DocumentStatus | "">("")
  const [search, setSearch] = useState("")
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null)

  const pendingCount = documents.filter(
    (d) => !["Submitted for Validation", "Validated"].includes(d.status)
  ).length

  const filteredDocs = assigneeFilter
    ? documents.filter((d) =>
        assigneeFilter === "unassigned"
          ? d.assignedTo === null
          : d.assignedTo?.id === assigneeFilter
      )
    : documents

  const assigneeLabel =
    assigneeFilter === null
      ? "Assignee"
      : assigneeFilter === "unassigned"
      ? "Unassigned"
      : MOCK_USERS.find((u) => u.id === assigneeFilter)?.name ?? "Assignee"

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <NavBar
        currentUser={CURRENT_USER}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* White content card */}
      <div className="mx-6 mb-6 flex-1 bg-white rounded-[20px] p-6 flex flex-col gap-8">
        {/* Page header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">Document Inbox</h1>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-900">
              {pendingCount} items pending
            </span>
          </div>
          <p className="text-lg text-slate-500">Review documents and identify deadlines.</p>
        </div>

        {/* Tab bar + filter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg h-11 p-1">
            {TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={cn(
                  "h-full px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Filter:</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 rounded-full h-8 px-3 text-sm">
                  {assigneeLabel}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setAssigneeFilter(null)}>
                  All Assignees
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setAssigneeFilter("unassigned")}>
                  Unassigned
                </DropdownMenuItem>
                {MOCK_USERS.map((u) => (
                  <DropdownMenuItem key={u.id} onClick={() => setAssigneeFilter(u.id)}>
                    {u.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table */}
        <DocumentTable
          documents={filteredDocs}
          onDocumentsChange={setDocuments}
          globalFilter={search}
          statusFilter={activeTab}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/inbox/page.tsx`**

```typescript
import { InboxPage } from "@/components/inbox/inbox-page"

export default function Page() {
  return <InboxPage />
}
```

- [ ] **Step 3: Commit**

```bash
git add app/ components/ && git commit -m "feat: add InboxPage and wire up all interactions"
```

---

## Task 9: Start dev server and verify

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

Expected: Server starts on http://localhost:3000. Opening the URL should show the Document Inbox screen matching the Figma.

- [ ] **Step 2: Manual smoke-check**
  - Page loads, Outfit font renders, Schellenberg Wittmer logo visible
  - Table shows 5 documents with correct statuses and colored badges
  - "4 items pending" badge visible
  - Click a tab (e.g. "To Do") — table filters to 2 rows
  - Type in search — table filters by ID/source
  - Click a column header — rows sort
  - Click an assignee cell — popover opens with search + user list
  - Click "Assign to me" on an unassigned row — assignee updates
  - Click row expand chevron — sub-row appears
  - "Review" button visible on DOC-001 (In Progress) only

- [ ] **Step 3: Final commit**

```bash
git add -A && git commit -m "feat: DLMS Document Inbox — initial implementation complete"
```
