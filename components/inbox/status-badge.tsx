import type { DocumentStatus } from "@/lib/types"

const STATUS_STYLES: Record<DocumentStatus, string> = {
  "In Progress":              "bg-blue-50 text-blue-500 border-blue-100",
  "Submitted for Validation": "bg-blue-50 text-blue-500 border-blue-100",
  "To Do":                    "bg-red-50 text-red-500 border-red-100",
  "Draft":                    "bg-amber-50 text-amber-600 border-amber-100",
  "Validated":                "bg-green-100 text-green-600 border-green-200",
}

export function StatusBadge({ status }: { status: DocumentStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}
