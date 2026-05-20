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
      <PopoverTrigger className="flex items-center gap-2 text-left w-full min-w-0 cursor-pointer bg-transparent border-none p-0 focus:outline-none">
        {value ? (
          <>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
              {value.name[0]}
            </span>
            <span className="flex flex-col leading-tight min-w-0 text-left">
              <span className="text-sm font-medium text-slate-900 truncate">{value.name}</span>
              <span className="text-xs text-slate-500">{value.initials}</span>
            </span>
          </>
        ) : (
          <span className="flex flex-col leading-tight">
            <span className="flex items-center gap-1 text-sm text-slate-400">
              <UserMinus className="h-4 w-4 shrink-0" />
              Unassigned
            </span>
            <span
              role="button"
              tabIndex={0}
              className="text-xs text-blue-500 underline text-left"
              onClick={(e) => {
                e.stopPropagation()
                onChange(currentUser)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.stopPropagation(); onChange(currentUser) }
              }}
            >
              Assign to me
            </span>
          </span>
        )}
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
              <UserMinus className="h-4 w-4 shrink-0" />
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
                  {u.name[0]}
                </span>
                <span className="flex flex-col leading-tight text-left min-w-0">
                  <span className="font-medium text-slate-900 truncate">{u.name}</span>
                  <span className="text-xs text-slate-500">{u.initials}</span>
                </span>
                {value?.id === u.id && <Check className="ml-auto h-4 w-4 shrink-0 text-slate-500" />}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
