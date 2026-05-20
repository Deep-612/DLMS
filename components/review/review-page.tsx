"use client"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/inbox/status-badge"
import { DocumentPreview } from "./document-preview"
import { DeadlineForm } from "./deadline-form"
import type { Document } from "@/lib/types"

type Props = {
  document: Document
}

export function ReviewPage({ document }: Props) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">

      {/* Top header bar */}
      <header className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-slate-100 shrink-0">
        {/* Left: cancel + doc info */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => router.push("/inbox")}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-md px-3 h-9 hover:bg-slate-50 transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-sm font-semibold text-slate-900">{document.id}</span>
            <span className="text-xs text-slate-500 truncate">
              {document.assignedTo
                ? `Assigned to ${document.assignedTo.name} (${document.assignedTo.initials})`
                : "Unassigned"}
            </span>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            className="rounded-md border-slate-200 text-slate-700 h-9 text-sm font-medium"
            onClick={() => console.log("Save Draft", document.id)}
          >
            Save Draft
          </Button>
          <Button
            className="rounded-md bg-slate-900 text-white hover:bg-slate-800 h-9 text-sm font-medium px-4"
            onClick={() => console.log("Submit for validation", document.id)}
          >
            Submit for 4-Eyes Validation
          </Button>
        </div>
      </header>

      {/* Page title */}
      <div className="px-6 pt-6 pb-4 shrink-0">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-semibold text-slate-900">Deadline Entry</h1>
          <StatusBadge status={document.status} />
        </div>
        <p className="text-base text-slate-500">Add and submit deadline details for validation.</p>
      </div>

      {/* Two-column content */}
      <div className="flex-1 flex gap-5 px-6 pb-6 overflow-hidden min-h-0">
        {/* Left: Document Preview */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <DocumentPreview />
        </div>

        {/* Right: Form */}
        <div className="w-[420px] shrink-0 overflow-y-auto">
          <DeadlineForm />
        </div>
      </div>
    </div>
  )
}
