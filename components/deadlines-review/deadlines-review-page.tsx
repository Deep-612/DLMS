"use client"

import { useState } from "react"
import { ArrowDownUp, CalendarDays, ChevronDown, ChevronRight, ArrowUpRight, FilterX } from "lucide-react"
import { NavBar } from "@/components/layout/nav-bar"
import { CURRENT_USER } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────
type ReviewStatus = "Validated" | "To Review" | "Unregistered"

type SubDeadline = {
  id: string
  status: "validated" | "to-review"
  date: string
  type: string
  description: string
  reminders: [string, string, string]
}

type ReviewEntry = {
  id: string
  caseId: string
  partner: string
  documentSource: string
  dueDate: string
  dueDateOverdue?: boolean
  submittedBy: string
  submittedByInitials: string
  team: string[]
  teamExtra?: number
  deadlineCount: number
  status: ReviewStatus
  subDeadlines?: SubDeadline[]
}

// ── Mock data ──────────────────────────────────────────────────
const ENTRIES: ReviewEntry[] = [
  {
    id: "1",
    caseId: "ZH-2025-0101",
    partner: "Sarah Chen",
    documentSource: "Judicial Mail",
    dueDate: "18 Apr 2026",
    dueDateOverdue: true,
    submittedBy: "Stephanie Sharkey",
    submittedByInitials: "SEY",
    team: ["SEY", "EIO"],
    deadlineCount: 3,
    status: "Validated",
  },
  {
    id: "2",
    caseId: "GEV-2025-0412",
    partner: "Sarah Chen",
    documentSource: "FINMA",
    dueDate: "21 Apr 2026",
    submittedBy: "Johny Depp",
    submittedByInitials: "JPP",
    team: ["SEY", "EIO"],
    deadlineCount: 2,
    status: "To Review",
    subDeadlines: [
      {
        id: "2a",
        status: "validated",
        date: "22 Apr 2026",
        type: "Hearing",
        description: "Response deadline for court notice received via judicial mail.",
        reminders: ["15 Apr 2025", "19 Apr 2025", "21 Apr 2025"],
      },
      {
        id: "2b",
        status: "to-review",
        date: "24 Apr 2026",
        type: "External Deadline",
        description: "Filing deadline for regulatory submission as per authority request.",
        reminders: ["17 Apr 2025", "21 Apr 2025", "23 Apr 2025"],
      },
    ],
  },
  {
    id: "3",
    caseId: "GEV-2025-0018",
    partner: "Lucifer Morningstar",
    documentSource: "Justitia",
    dueDate: "24 Apr 2026",
    submittedBy: "Stephanie Sharkey",
    submittedByInitials: "SEY",
    team: ["SEY", "EIO", "MPP"],
    deadlineCount: 3,
    status: "Validated",
  },
  {
    id: "4",
    caseId: "ZH-2025-0101",
    partner: "Sarah Chen",
    documentSource: "FINMA",
    dueDate: "12 May 2026",
    submittedBy: "Ehsan Clario",
    submittedByInitials: "EIO",
    team: ["SEY", "EIO"],
    teamExtra: 2,
    deadlineCount: 2,
    status: "Unregistered",
  },
  {
    id: "5",
    caseId: "GEV-2025-0416",
    partner: "Lucifer Morningstar",
    documentSource: "Justitia",
    dueDate: "13 May 2026",
    submittedBy: "Stephanie Sharkey",
    submittedByInitials: "SEY",
    team: ["SEY", "EIO"],
    deadlineCount: 3,
    status: "To Review",
  },
]

const PRIMARY_FILTERS = ["Office", "Matter / Case", "Partner", "Deadline type", "Deadline Date"]
const EXTRA_FILTERS = ["Team", "Classification", "Submitted by", "Status"]

// ── Helpers ────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReviewStatus }) {
  if (status === "Validated")
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 border border-green-200 text-green-700 whitespace-nowrap">
        Validated
      </span>
    )
  if (status === "To Review")
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 border border-amber-100 text-amber-600 whitespace-nowrap">
        To Review
      </span>
    )
  return (
    <span className="text-sm font-medium text-red-500 whitespace-nowrap">Unregistered</span>
  )
}

function TeamBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 whitespace-nowrap">
      {label}
    </span>
  )
}

function UserInitialsAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
  return (
    <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">
      {initials}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────
export function DeadlinesReviewPage() {
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["2"]))
  const [showExtraFilters, setShowExtraFilters] = useState(false)

  const pendingCount = ENTRIES.filter((e) => e.status === "To Review").length

  function toggleRow(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <NavBar currentUser={CURRENT_USER} searchValue={search} onSearchChange={setSearch} />

      <div className="flex-1 px-6 pb-8">
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-slate-900">
              Deadlines Review{" "}
              <span className="font-normal text-slate-500">(4-eyes Validation)</span>
            </h1>
            <span className="text-sm text-slate-500">{pendingCount} items pending</span>
          </div>
          <p className="text-base text-slate-500">
            Review submitted deadlines, verify details, and approve or request changes.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="text-sm font-medium text-slate-500">Filter:</span>
          {PRIMARY_FILTERS.map((f) => (
            <button
              key={f}
              className="flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-200 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              {f === "Deadline Date" && <CalendarDays className="h-3.5 w-3.5 text-slate-400" />}
              {f}
              {f !== "Deadline Date" && <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
            </button>
          ))}
          {showExtraFilters && EXTRA_FILTERS.map((f) => (
            <button
              key={f}
              className="flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-200 rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              {f}
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>
          ))}
          {!showExtraFilters && (
            <button
              onClick={() => setShowExtraFilters(true)}
              className="flex items-center gap-1 h-8 px-3 text-sm text-blue-500 hover:underline transition-colors"
            >
              + {EXTRA_FILTERS.length} more
            </button>
          )}
          {showExtraFilters && (
            <button className="flex items-center gap-1.5 h-8 px-3 text-sm font-medium text-red-500 hover:text-red-600 transition-colors ml-1">
              <FilterX className="h-3.5 w-3.5" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Table card */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                {/* Expand col */}
                <th className="w-10 px-2 py-3" />
                {[
                  { label: "Matter / Case", sortable: true },
                  { label: "Document Source", sortable: true },
                  { label: "Due Date", sortable: true },
                  { label: "Submitted by", sortable: true },
                  { label: "Team", sortable: false },
                  { label: "Deadline", sortable: false },
                  { label: "Status", sortable: true },
                  { label: "", sortable: false },
                ].map(({ label, sortable }) => (
                  <th key={label} className="px-2 py-3 text-left text-xs font-medium text-slate-500 whitespace-nowrap">
                    {label && (
                      <button className="flex items-center gap-1">
                        {label}
                        {sortable && <ArrowDownUp className="h-3 w-3 shrink-0" />}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENTRIES.map((entry, idx) => {
                const isExpanded = expanded.has(entry.id)
                const isEven = idx % 2 === 1

                return (
                  <>
                    {/* Main row */}
                    <tr
                      key={entry.id}
                      className={cn(
                        "border-b border-slate-100 cursor-pointer hover:bg-slate-50/50 transition-colors",
                        isEven && "bg-slate-50"
                      )}
                      onClick={() => entry.subDeadlines && toggleRow(entry.id)}
                    >
                      {/* Expand chevron */}
                      <td className="px-2 py-4 text-slate-400">
                        {entry.subDeadlines ? (
                          isExpanded
                            ? <ChevronDown className="h-4 w-4" />
                            : <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4 opacity-20" />
                        )}
                      </td>

                      {/* Matter / Case */}
                      <td className="px-2 py-4">
                        <div className="font-semibold text-slate-900">{entry.caseId}</div>
                        <div className="text-xs text-slate-500">{entry.partner}</div>
                      </td>

                      {/* Document Source */}
                      <td className="px-2 py-4 text-slate-700 whitespace-nowrap">{entry.documentSource}</td>

                      {/* Due Date */}
                      <td className={cn("px-2 py-4 whitespace-nowrap", entry.dueDateOverdue ? "text-red-500 font-medium" : "text-slate-700")}>
                        {entry.dueDate}
                      </td>

                      {/* Submitted by */}
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          <UserInitialsAvatar name={entry.submittedBy} />
                          <div>
                            <div className="font-medium text-slate-900 whitespace-nowrap">{entry.submittedBy}</div>
                            <div className="text-xs text-slate-500">{entry.submittedByInitials}</div>
                          </div>
                        </div>
                      </td>

                      {/* Team */}
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {entry.team.map((t) => <TeamBadge key={t} label={t} />)}
                          {entry.teamExtra && (
                            <span className="text-xs text-slate-500">+{entry.teamExtra}</span>
                          )}
                        </div>
                      </td>

                      {/* Deadline count */}
                      <td className="px-2 py-4 font-medium text-slate-900">{entry.deadlineCount}</td>

                      {/* Status */}
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          {entry.status === "Unregistered" ? (
                            <>
                              <span className="text-sm font-medium text-red-500">Unregistered</span>
                              <StatusBadge status="To Review" />
                            </>
                          ) : (
                            <StatusBadge status={entry.status} />
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-2 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {entry.status === "To Review" && (
                          <button className="h-8 px-3 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap">
                            Review
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Expanded sub-deadlines */}
                    {isExpanded && entry.subDeadlines && (
                      <tr key={`${entry.id}-expanded`} className="bg-slate-50 border-b border-slate-100">
                        <td colSpan={9} className="px-0 py-0">
                          {/* Sub-table header */}
                          <div className="grid grid-cols-[32px_140px_160px_1fr_220px_140px] gap-0 px-10 py-2 border-b border-slate-100 bg-slate-50">
                            {["", "Deadline Date", "Deadline type", "Description", "Next Reminder", ""].map((h, i) => (
                              <div key={i} className="text-xs font-medium text-slate-500 px-2">{h}</div>
                            ))}
                          </div>

                          {/* Sub-rows */}
                          {entry.subDeadlines.map((sub) => (
                            <div
                              key={sub.id}
                              className="grid grid-cols-[32px_140px_160px_1fr_220px_140px] gap-0 px-10 py-3 border-b border-slate-100 last:border-0 items-center"
                            >
                              {/* Status dot */}
                              <div className="flex items-center justify-center px-2">
                                {sub.status === "validated" ? (
                                  <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="h-5 w-5 rounded-full bg-amber-400" />
                                )}
                              </div>

                              {/* Date */}
                              <div className={cn("px-2 text-sm font-medium whitespace-nowrap", sub.status === "validated" ? "text-slate-900" : "text-slate-900")}>
                                {sub.date}
                              </div>

                              {/* Type */}
                              <div className="px-2 text-sm text-slate-700 whitespace-nowrap">{sub.type}</div>

                              {/* Description */}
                              <div className="px-2 text-sm text-slate-600 line-clamp-2">{sub.description}</div>

                              {/* Next Reminder — 3 date chips */}
                              <div className="px-2 flex items-center gap-1.5">
                                {sub.reminders.map((r, i) => (
                                  <div key={i} className="flex items-center gap-1 h-7 px-2 bg-white border border-slate-200 rounded-md text-xs text-slate-700 whitespace-nowrap shadow-sm">
                                    {r.split(" ").slice(0, 2).join(" ")}
                                    <CalendarDays className="h-3 w-3 text-slate-400" />
                                  </div>
                                ))}
                              </div>

                              {/* Action */}
                              <div className="px-2 flex justify-end">
                                {sub.status === "validated" ? (
                                  <button className="flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap">
                                    Reopen
                                  </button>
                                ) : (
                                  <button className="h-8 px-4 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors whitespace-nowrap">
                                    Validate
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </td>
                      </tr>
                    )}
                  </>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
