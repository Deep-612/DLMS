"use client"

import { useState } from "react"
import {
  CalendarFold,
  ShieldAlert,
  TriangleAlert,
  OctagonAlert,
  CalendarDays,
  FilterX,
  ArrowDownUp,
  BellRing,
  ChevronDown,
} from "lucide-react"
import { NavBar } from "@/components/layout/nav-bar"
import { CURRENT_USER } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

// ── Types ──────────────────────────────────────────────────────

type DeadlineType = "Hearing" | "Deadline" | "Reminder" | "External"
type ReminderStatus = "Scheduled" | "Sent" | null

type DeadlineEntry = {
  id: string
  caseId: string
  partner: string
  dueDate: string
  dueDateOverdue?: boolean
  team: string[]
  teamExtra?: number
  description: string
  type: DeadlineType
  reminderStatus?: ReminderStatus
  modifiedBy: string
  modifiedByInitials: string
  isActive?: boolean
}

// ── Mock data ──────────────────────────────────────────────────

const ENTRIES: DeadlineEntry[] = [
  {
    id: "1",
    caseId: "ZH-2025-0101",
    partner: "Sarah Chen",
    dueDate: "12 May 2026",
    team: ["SEY", "EIO"],
    description: "Submission deadline for compliance documentation.",
    type: "Hearing",
    modifiedBy: "Ehsan Clario",
    modifiedByInitials: "EIO",
  },
  {
    id: "2",
    caseId: "ZH-2025-0101",
    partner: "Sarah Chen",
    dueDate: "18 Apr 2026",
    dueDateOverdue: true,
    team: ["SEY", "EIO"],
    description: "Filing deadline for regulatory submission as per authority request.",
    type: "Deadline",
    modifiedBy: "Johny Depp",
    modifiedByInitials: "JPP",
  },
  {
    id: "3",
    caseId: "GEV-2025-0412",
    partner: "Sarah Chen",
    dueDate: "21 Apr 2026",
    team: ["SEY", "EIO"],
    description: "Response deadline for court notice received via judicial mail.",
    type: "Reminder",
    reminderStatus: "Scheduled",
    modifiedBy: "Ehsan Clario",
    modifiedByInitials: "EIO",
    isActive: true,
  },
  {
    id: "4",
    caseId: "GEV-2025-0018",
    partner: "Lucifer Morningstar",
    dueDate: "24 Apr 2026",
    team: ["SEY", "EIO"],
    teamExtra: 2,
    description: "Deadline to review and respond to client-related legal correspondence.",
    type: "Reminder",
    reminderStatus: "Sent",
    modifiedBy: "Stephanie Sharkey",
    modifiedByInitials: "SEY",
  },
  {
    id: "5",
    caseId: "GEV-2025-0416",
    partner: "Lucifer Morningstar",
    dueDate: "13 May 2026",
    team: ["SEY", "EIO"],
    description: "Internal review deadline before escalation to senior associate.",
    type: "External",
    modifiedBy: "Stephanie Sharkey",
    modifiedByInitials: "SEY",
  },
]

const STAT_CARDS = [
  {
    label: "Open Deadlines",
    value: 12,
    sub: "Across all matters",
    icon: CalendarFold,
    glow: "bg-slate-100",
    iconColor: "text-slate-600",
  },
  {
    label: "Due in 7 Days",
    value: 8,
    sub: "Action required soon",
    icon: ShieldAlert,
    glow: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    label: "Overdue Deadlines",
    value: 2,
    sub: "Immediate attention needed",
    icon: TriangleAlert,
    glow: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    label: "Pending Validation",
    value: 3,
    sub: "Awaiting review (4-eyes check)",
    icon: OctagonAlert,
    glow: "bg-teal-50",
    iconColor: "text-teal-500",
  },
]

const TABS = ["All Deadlines", "My Deadlines", "My Matters", "Next Two Weeks", "Submitted for Validation"]

const FILTERS = [
  { label: "Office", icon: "chevron" },
  { label: "Matter / Case", icon: "chevron" },
  { label: "Deadline type", icon: "chevron" },
  { label: "Lawyers", icon: "chevron" },
  { label: "Practice group", icon: "chevron" },
  { label: "Deadline Date", icon: "calendar" },
  { label: "Received Date", icon: "calendar" },
]

// ── Sub-components ─────────────────────────────────────────────

function TypeBadge({ type, reminderStatus }: { type: DeadlineType; reminderStatus?: ReminderStatus }) {
  const badge = {
    Hearing: "bg-amber-50 border-amber-100 text-amber-600",
    Deadline: "bg-red-50 border-red-100 text-red-500",
    Reminder: "bg-green-100 border-green-200 text-green-600",
    External: "bg-purple-50 border-purple-100 text-purple-500",
  }[type]

  return (
    <div className="flex items-center gap-2">
      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap", badge)}>
        {type}
      </span>
      {reminderStatus === "Scheduled" && (
        <span className="text-xs font-medium text-blue-600 whitespace-nowrap">Scheduled</span>
      )}
      {reminderStatus === "Sent" && (
        <span className="text-xs font-medium text-green-600 whitespace-nowrap">Sent</span>
      )}
    </div>
  )
}

function TeamBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 whitespace-nowrap">
      {label}
    </span>
  )
}

function UserAvatar({ name, initials }: { name: string; initials: string }) {
  const colors: Record<string, string> = {
    EIO: "bg-slate-600",
    JPP: "bg-indigo-600",
    SEY: "bg-rose-600",
  }
  const bg = colors[initials] ?? "bg-slate-500"
  return (
    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0", bg)}>
      {name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────

export function DeadlineMonitoringPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("All Deadlines")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <NavBar currentUser={CURRENT_USER} searchValue={search} onSearchChange={setSearch} />

      {/* Main white content area */}
      <div className="flex-1 mx-6 mb-6 bg-white rounded-tl-[20px] rounded-tr-[20px] flex flex-col gap-8 p-6 min-h-0">

        {/* Page header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-semibold text-slate-900 whitespace-nowrap">Deadline Monitoring</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-accent text-xs font-medium text-slate-900">
              5 active deadlines
            </span>
          </div>
          <p className="text-lg text-slate-500">Real-time visibility of all active deadlines.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-6">
          {STAT_CARDS.map(({ label, value, sub, icon: Icon, glow, iconColor }) => (
            <div key={label} className="relative bg-white border border-slate-200 rounded-xl p-6 overflow-hidden flex flex-col gap-3">
              {/* Decorative glow blob */}
              <div className={cn("absolute -top-8 -right-8 size-[120px] rounded-full blur-2xl opacity-80", glow)} />
              <div className="flex items-center justify-between relative">
                <span className="text-sm font-medium text-slate-900 whitespace-nowrap">{label}</span>
                <Icon className={cn("h-6 w-6 shrink-0", iconColor)} />
              </div>
              <div className="relative">
                <p className="text-2xl font-semibold text-slate-900 leading-8">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 h-11 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "h-full px-3 py-1 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium text-slate-500">Filter:</span>
          {FILTERS.map(({ label, icon }) => (
            <button
              key={label}
              className="flex items-center gap-1.5 h-8 px-3 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              {label}
              {icon === "chevron" ? (
                <ChevronDown className="h-4 w-4 text-slate-500" />
              ) : (
                <CalendarDays className="h-4 w-4 text-slate-500" />
              )}
            </button>
          ))}
          {/* Divider */}
          <div className="h-5 w-px bg-slate-200 mx-1" />
          <button className="flex items-center gap-1.5 h-8 px-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors">
            <FilterX className="h-4 w-4" />
            Clear Filters
          </button>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="w-8 px-2 py-2.5">
                  <input type="checkbox" className="rounded border-slate-300 w-4 h-4" />
                </th>
                {[
                  { label: "Matter / Case", sortable: true },
                  { label: "Due Date", sortable: true },
                  { label: "Team", sortable: false },
                  { label: "Description", sortable: false },
                  { label: "Type", sortable: false },
                  { label: "Modified by", sortable: true },
                  { label: "", sortable: false },
                ].map(({ label, sortable }) => (
                  <th key={label} className="px-2 py-2.5 text-left text-sm font-medium text-slate-500 whitespace-nowrap">
                    {label ? (
                      <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                        {label}
                        {sortable && <ArrowDownUp className="h-3.5 w-3.5 shrink-0 opacity-60" />}
                      </button>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ENTRIES.map((entry) => (
                <tr
                  key={entry.id}
                  className={cn(
                    "border-b border-slate-200 transition-colors",
                    entry.isActive ? "bg-slate-50" : "hover:bg-slate-50/50"
                  )}
                >
                  {/* Checkbox */}
                  <td className="px-2 py-5">
                    <input type="checkbox" className="rounded border-slate-300 w-4 h-4" />
                  </td>

                  {/* Matter / Case */}
                  <td className="px-2 py-5">
                    <div className="font-medium text-slate-900 whitespace-nowrap">{entry.caseId}</div>
                    <div className="text-sm text-slate-500 whitespace-nowrap">{entry.partner}</div>
                  </td>

                  {/* Due Date */}
                  <td className={cn("px-2 py-5 whitespace-nowrap", entry.dueDateOverdue ? "text-red-500 font-medium" : "text-slate-900")}>
                    {entry.dueDate}
                  </td>

                  {/* Team */}
                  <td className="px-2 py-5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {entry.team.map((t) => <TeamBadge key={t} label={t} />)}
                      {entry.teamExtra && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-100 text-slate-500 whitespace-nowrap">
                          +{entry.teamExtra}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-2 py-5 max-w-xs">
                    <span className="text-slate-900 line-clamp-2">{entry.description}</span>
                  </td>

                  {/* Type */}
                  <td className="px-2 py-5">
                    <TypeBadge type={entry.type} reminderStatus={entry.reminderStatus} />
                  </td>

                  {/* Modified by */}
                  <td className="px-2 py-5">
                    <div className="flex items-center gap-2.5">
                      <UserAvatar name={entry.modifiedBy} initials={entry.modifiedByInitials} />
                      <div>
                        <div className="font-medium text-slate-900 whitespace-nowrap">{entry.modifiedBy}</div>
                        <div className="text-xs text-slate-500">{entry.modifiedByInitials}</div>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-2 py-5">
                    {entry.isActive ? (
                      <div className="flex items-center gap-2 relative">
                        {/* Bell button with dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setDropdownOpen((v) => !v)}
                            className="flex h-8 w-8 items-center justify-center rounded-md bg-amber-500 text-white shadow-sm hover:bg-amber-600 transition-colors shrink-0"
                          >
                            <BellRing className="h-4 w-4" />
                          </button>

                          {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-1 z-50 w-[150px] bg-white border border-slate-200 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] py-1">
                              {["Send reminder", "Mark completed"].map((item) => (
                                <button
                                  key={item}
                                  onClick={() => setDropdownOpen(false)}
                                  className="w-full text-left px-3 py-1.5 text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                                >
                                  {item}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Separator */}
                        <div className="h-4 w-px bg-slate-200 shrink-0" />

                        {/* Complete Deadline */}
                        <button className="flex h-8 items-center justify-center px-3 rounded-md bg-slate-900 text-white text-xs font-medium shadow-sm hover:bg-slate-800 transition-colors whitespace-nowrap">
                          Complete Deadline
                        </button>

                        {/* View details */}
                        <button className="flex h-8 items-center justify-center px-3 rounded-md bg-white border border-slate-200 text-xs font-medium text-slate-900 shadow-sm hover:bg-slate-50 transition-colors whitespace-nowrap">
                          View details
                        </button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
