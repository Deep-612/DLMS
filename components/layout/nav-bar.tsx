"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { User } from "@/lib/types"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/inbox",               label: "Inbox" },
  { href: "/deadlines-review",    label: "Deadlines Review" },
  { href: "/supervisor-inbox",    label: "Supervisor Inbox" },
  { href: "/deadline-monitoring", label: "Deadline Monitoring" },
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
      {/* Left: logo + nav */}
      <div className="flex items-center gap-1 bg-white rounded-full h-14 pl-4 pr-2.5 py-2">
        {/* Logo */}
        <div className="flex items-center pr-10 shrink-0">
          <div className="flex flex-col leading-none select-none">
            <span className="font-bold text-[13px] tracking-tight" style={{ color: "#C8102E" }}>
              Schellenberg
            </span>
            <span className="font-normal text-[13px] tracking-tight text-slate-900">
              Wittmer
            </span>
          </div>
        </div>

        {/* Nav links */}
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-center h-9 px-4 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
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
            <div className="h-11 w-11 rounded-full bg-slate-700 flex items-center justify-center text-sm font-semibold text-white shrink-0">
              {currentUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-900">{currentUser.name}</span>
              <span className="text-xs text-slate-500">{currentUser.email}</span>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
        </div>
      </div>
    </div>
  )
}
