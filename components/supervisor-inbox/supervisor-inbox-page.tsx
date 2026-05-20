"use client"

import { Fragment, useState } from "react"
import {
  ArrowDownUp,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Crown,
} from "lucide-react"
import { NavBar } from "@/components/layout/nav-bar"
import { CURRENT_USER } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ── Types ─────────────────────────────────────────────────────

type SupervisorStatus = "Validated" | "To Review" | "Unregistered"

type SubDeadlineStatus = "validated" | "to-review"

type SubDeadline = {
  id: string
  status: SubDeadlineStatus
  date: string
  type: string
  description: string
  reminders: [string, string, string]
}

type SupervisorEntry = {
  id: string
  matter: string
  partner: string
  documentSource: string
  dueDate: string
  dueDateOverdue?: boolean
  submittedBy: string
  submittedByInitials: string
  team: string[]
  teamExtra?: number
  deadlineCount: number
  status: SupervisorStatus
  subDeadlines?: SubDeadline[]
}

// ── Mock data ──────────────────────────────────────────────────

const ENTRIES: SupervisorEntry[] = [
  {
    id: "1",
    matter: "ZH-2025-0101",
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
    matter: "GEV-2025-0412",
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
    matter: "GEV-2025-0018",
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
    matter: "ZH-2025-0101",
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
    matter: "GEV-2025-0416",
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

const STATUS_TABS = [
  "All Documents",
  "To Do",
  "Draft",
  "In Progress",
  "Submitted for Validation",
] as const

const PRIMARY_FILTERS = ["Office", "Matter / Case", "Partner", "Deadline type"]
const EXTRA_FILTERS = ["Team", "Classification", "Submitted by", "Status"]

// ── Sub-components ─────────────────────────────────────────────

function StatusBadge({ status }: { status: SupervisorStatus }) {
  if (status === "Validated")
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 border border-green-200 text-green-600 whitespace-nowrap">
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
    <span className="text-sm font-medium text-red-500 whitespace-nowrap">
      Unregistered
    </span>
  )
}

function TeamBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 whitespace-nowrap">
      {label}
    </span>
  )
}

function SubmitterAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
  return (
    <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-semibold text-white shrink-0">
      {initials}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────

export function SupervisorInboxPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<string>("Validate")
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["2"]))
  const [showExtraFilters, setShowExtraFilters] = useState(false)

  const pendingCount = ENTRIES.filter(
    (e) => e.status !== "Validated"
  ).length

  function toggleRow(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <NavBar
        currentUser={CURRENT_USER}
        searchValue={search}
        onSearchChange={setSearch}
      />

      {/* White content card */}
      <div className="mx-6 mb-6 flex-1 bg-white rounded-[20px] p-6 flex flex-col gap-8 min-h-0">
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
          <p className="text-lg text-slate-500">
            Review documents and identify deadlines.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg h-11 p-1 w-fit shrink-0">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "h-full px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
          {/* Vertical separator before supervisor-only tab */}
          <div className="h-6 w-px bg-slate-200 mx-1" aria-hidden />
          <button
            onClick={() => setActiveTab("Validate")}
            className={cn(
              "h-full px-3 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2",
              activeTab === "Validate"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Crown className="h-4 w-4 shrink-0" />
            Validate
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-slate-500">Filter:</span>
          {PRIMARY_FILTERS.map((f) => (
            <button
              key={f}
              className="flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              {f}
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>
          ))}
          <button className="flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap">
            Deadline Date
            <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
          </button>
          {showExtraFilters
            ? EXTRA_FILTERS.map((f) => (
                <button
                  key={f}
                  className="flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
                >
                  {f}
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </button>
              ))
            : (
                <button
                  onClick={() => setShowExtraFilters(true)}
                  className="flex items-center gap-1 h-8 px-3 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                >
                  + {EXTRA_FILTERS.length} more
                </button>
              )}
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="w-8 px-2 py-2.5">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    className="rounded border-slate-300 w-4 h-4"
                  />
                </th>
                {/* Expand col */}
                <th className="w-8 px-2 py-2.5" aria-label="" />
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
                  <th
                    key={label || "actions"}
                    className="px-2 py-2.5 text-left text-sm font-medium text-slate-500 whitespace-nowrap"
                  >
                    {label && (
                      <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                        {label}
                        {sortable && (
                          <ArrowDownUp className="h-3.5 w-3.5 shrink-0 opacity-60" />
                        )}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENTRIES.map((entry, idx) => {
                const isExpanded = expanded.has(entry.id)
                const isFocused = isExpanded && entry.subDeadlines
                const stripe = idx % 2 === 1

                return (
                  <Fragment key={entry.id}>
                    {/* Main row */}
                    <tr
                      className={cn(
                        "border-b border-slate-200 transition-colors",
                        entry.subDeadlines && "cursor-pointer",
                        stripe ? "bg-slate-50" : "hover:bg-slate-50/50"
                      )}
                      onClick={() =>
                        entry.subDeadlines && toggleRow(entry.id)
                      }
                    >
                      {/* Checkbox */}
                      <td
                        className="px-2 py-5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          aria-label={`Select ${entry.matter}`}
                          className="rounded border-slate-300 w-4 h-4"
                        />
                      </td>

                      {/* Expand chevron */}
                      <td className="px-2 py-5 text-slate-400">
                        {entry.subDeadlines ? (
                          isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )
                        ) : (
                          <ChevronRight className="h-4 w-4 opacity-20" />
                        )}
                      </td>

                      {/* Matter / Case */}
                      <td className="px-2 py-5">
                        <div className="font-medium text-slate-900 whitespace-nowrap">
                          {entry.matter}
                        </div>
                        <div className="text-sm text-slate-500 whitespace-nowrap">
                          {entry.partner}
                        </div>
                      </td>

                      {/* Document Source */}
                      <td className="px-2 py-5 text-slate-900 whitespace-nowrap">
                        {entry.documentSource}
                      </td>

                      {/* Due Date */}
                      <td
                        className={cn(
                          "px-2 py-5 whitespace-nowrap",
                          entry.dueDateOverdue
                            ? "text-red-500 font-medium"
                            : "text-slate-900"
                        )}
                      >
                        {entry.dueDate}
                      </td>

                      {/* Submitted by */}
                      <td className="px-2 py-5">
                        <div className="flex items-center gap-2">
                          <SubmitterAvatar name={entry.submittedBy} />
                          <div className="min-w-0">
                            <div className="font-medium text-slate-900 whitespace-nowrap">
                              {entry.submittedBy}
                            </div>
                            <div className="text-xs text-slate-500">
                              {entry.submittedByInitials}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Team */}
                      <td className="px-2 py-5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {entry.team.map((t) => (
                            <TeamBadge key={t} label={t} />
                          ))}
                          {entry.teamExtra && (
                            <span className="text-xs text-slate-500 whitespace-nowrap">
                              +{entry.teamExtra}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Deadline count */}
                      <td className="px-2 py-5 font-medium text-slate-900">
                        {entry.deadlineCount}
                      </td>

                      {/* Status */}
                      <td className="px-2 py-5">
                        <StatusBadge status={entry.status} />
                      </td>

                      {/* Action */}
                      <td
                        className="px-2 py-5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {entry.status === "Validated" ? null : isFocused ? (
                          <button className="h-8 px-3 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap">
                            Review
                          </button>
                        ) : (
                          <button className="inline-flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap">
                            Review
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Expanded sub-deadlines */}
                    {isExpanded && entry.subDeadlines && (
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <td colSpan={10} className="p-0">
                          {/* Sub-table */}
                          <div className="w-full">
                            {/* Sub-header */}
                            <div className="grid grid-cols-[64px_140px_160px_minmax(220px,1fr)_minmax(360px,420px)_140px] items-center px-4 py-2 border-b border-slate-200">
                              <div />
                              <div className="text-sm font-medium text-slate-500 px-2">
                                Deadline Date
                              </div>
                              <div className="text-sm font-medium text-slate-500 px-2">
                                Deadline type
                              </div>
                              <div className="text-sm font-medium text-slate-500 px-2">
                                Description
                              </div>
                              <div className="text-sm font-medium text-slate-500 px-2">
                                Next Reminder
                              </div>
                              <div />
                            </div>

                            {/* Sub-rows */}
                            {entry.subDeadlines.map((sub) => (
                              <div
                                key={sub.id}
                                className="grid grid-cols-[64px_140px_160px_minmax(220px,1fr)_minmax(360px,420px)_140px] items-center px-4 py-3 border-b border-slate-200 last:border-0"
                              >
                                {/* Status dot */}
                                <div className="flex items-center justify-center">
                                  {sub.status === "validated" ? (
                                    <div
                                      className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center"
                                      aria-label="Validated"
                                    >
                                      <svg
                                        className="h-3.5 w-3.5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    </div>
                                  ) : (
                                    <div
                                      className="h-6 w-6 rounded-full bg-amber-400 flex items-center justify-center"
                                      aria-label="To review"
                                    >
                                      <svg
                                        className="h-3.5 w-3.5 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M6 12h12"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                </div>

                                {/* Deadline Date */}
                                <div className="px-2 text-sm font-medium text-slate-900 whitespace-nowrap">
                                  {sub.date}
                                </div>

                                {/* Deadline type */}
                                <div className="px-2 text-sm text-slate-900 whitespace-nowrap">
                                  {sub.type}
                                </div>

                                {/* Description */}
                                <div className="px-2 text-sm text-slate-900 line-clamp-2">
                                  {sub.description}
                                </div>

                                {/* Next Reminder — 3 date "select" chips */}
                                <div className="px-2 flex items-center gap-3">
                                  {sub.reminders.map((r, i) => (
                                    <div
                                      key={i}
                                      className="flex flex-1 items-center justify-between h-8 px-3 bg-white border border-slate-200 rounded-md text-xs text-slate-900 whitespace-nowrap shadow-sm"
                                    >
                                      <span>{r}</span>
                                      <CalendarDays className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                    </div>
                                  ))}
                                </div>

                                {/* Action */}
                                <div className="px-2 flex justify-end">
                                  {sub.status === "validated" ? (
                                    <button className="h-8 px-3 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap">
                                      Reopen
                                    </button>
                                  ) : (
                                    <button className="h-8 px-4 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors whitespace-nowrap shadow-sm">
                                      Validate
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
