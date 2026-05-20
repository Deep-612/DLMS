"use client"

import { useState } from "react"
import { ChevronDown, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { NavBar } from "@/components/layout/nav-bar"
import { DocumentTable } from "./document-table"
import type { Document, DocumentStatus } from "@/lib/types"
import type { RowSelectionState } from "@tanstack/react-table"
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
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const selectedCount = Object.values(rowSelection).filter(Boolean).length
  const selectedIds = Object.entries(rowSelection)
    .filter(([, v]) => v)
    .map(([id]) => id)

  const pendingCount = documents.filter(
    (d) => !["Submitted for Validation", "Validated"].includes(d.status)
  ).length

  const visibleDocs =
    assigneeFilter === null
      ? documents
      : assigneeFilter === "unassigned"
      ? documents.filter((d) => d.assignedTo === null)
      : documents.filter((d) => d.assignedTo?.id === assigneeFilter)

  const assigneeLabel =
    assigneeFilter === null
      ? "Assignee"
      : assigneeFilter === "unassigned"
      ? "Unassigned"
      : (MOCK_USERS.find((u) => u.id === assigneeFilter)?.name ?? "Assignee")

  function handleDocumentsChange(updatedVisible: Document[]) {
    // Merge updated visible docs back into the full documents array
    setDocuments((prev) =>
      prev.map((d) => updatedVisible.find((u) => u.id === d.id) ?? d)
    )
  }

  function handleBulkAssign() {
    setDocuments((prev) =>
      prev.map((d) =>
        selectedIds.includes(d.id) ? { ...d, assignedTo: CURRENT_USER } : d
      )
    )
    setRowSelection({})
  }

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
            <h1 className="text-2xl font-semibold text-slate-900 whitespace-nowrap">
              Document Inbox
            </h1>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
              {pendingCount} items pending
            </span>
          </div>
          <p className="text-lg text-slate-500">Review documents and identify deadlines.</p>
        </div>

        {/* Tab bar + filter */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg h-11 p-1 overflow-x-auto shrink-0">
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

          <div className="flex items-center gap-2 shrink-0">
            {/* Filter dropdown — always visible */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Filter:</span>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1.5 rounded-lg h-9 px-3 text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-slate-700">
                  {assigneeLabel}
                  <ChevronDown className="h-3.5 w-3.5" />
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

            {/* Bulk action — only when rows are selected */}
            {selectedCount > 0 && (
              <button
                onClick={handleBulkAssign}
                className="inline-flex items-center gap-2 rounded-lg h-9 px-4 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                <User className="h-4 w-4" />
                Assign to me ({selectedCount})
              </button>
            )}
          </div>
        </div>

        {/* Document table */}
        <DocumentTable
          documents={visibleDocs}
          onDocumentsChange={handleDocumentsChange}
          globalFilter={search}
          statusFilter={activeTab}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </div>
    </div>
  )
}
