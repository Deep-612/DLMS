"use client"

import { useState } from "react"
import { CalendarDays, FolderCog, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { MOCK_USERS } from "@/lib/mock-data"

type Classification = "as-listed" | "unregistered"

export function DeadlineForm() {
  const [matter, setMatter] = useState("")
  const [classification, setClassification] = useState<Classification>("unregistered")
  const [receivedDate, setReceivedDate] = useState("2025-04-12")
  const [documentDate, setDocumentDate] = useState("2025-04-14")

  return (
    <div className="flex flex-col gap-6 overflow-y-auto h-full">

      {/* Overview */}
      <section className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-slate-900">Overview</h2>

        {/* Matter / Case */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-600">Matter / Case</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search for matter / case..."
              value={matter}
              onChange={(e) => setMatter(e.target.value)}
              className="pl-9 h-9 rounded-md border-slate-200 text-sm"
            />
          </div>
        </div>

        {/* Responsible */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-600">Responsible</Label>
          <Select>
            <SelectTrigger className="w-full rounded-md border-slate-200 text-sm">
              <SelectValue placeholder="Select responsible users..." />
            </SelectTrigger>
            <SelectContent>
              {MOCK_USERS.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Team Members */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-600">Team Members</Label>
          <Select>
            <SelectTrigger className="w-full rounded-md border-slate-200 text-sm">
              <SelectValue placeholder="Select team members..." />
            </SelectTrigger>
            <SelectContent>
              {MOCK_USERS.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assistants */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-600">Assistants</Label>
          <Select>
            <SelectTrigger className="w-full rounded-md border-slate-200 text-sm">
              <SelectValue placeholder="Select assistant..." />
            </SelectTrigger>
            <SelectContent>
              {MOCK_USERS.map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* KNOWLEDGE MILL Folder */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-600">KNOWLEDGE MILL Folder</Label>
          <div className="flex items-center justify-between h-9 px-3 rounded-md border border-slate-200 bg-white">
            <span className="text-sm text-slate-900">SW / Matter</span>
            <FolderCog className="h-4 w-4 text-slate-400 shrink-0" />
          </div>
        </div>
      </section>

      {/* Dates */}
      <section className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-slate-900">Dates</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Received Date */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-slate-600">Received Date</Label>
            <div className="relative">
              <input
                type="date"
                value={receivedDate}
                onChange={(e) => setReceivedDate(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
              />
            </div>
          </div>

          {/* Document Date */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-slate-600">Document Date</Label>
            <div className="relative">
              <input
                type="date"
                value={documentDate}
                onChange={(e) => setDocumentDate(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Classification */}
      <section className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4">
        <h2 className="text-base font-semibold text-slate-900">Classification</h2>
        <RadioGroup
          value={classification}
          onValueChange={(v) => setClassification(v as Classification)}
          className="grid grid-cols-2 gap-4"
        >
          {/* As listed */}
          <div className="flex items-start gap-3">
            <RadioGroupItem value="as-listed" id="as-listed" className="mt-0.5 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="as-listed" className="text-sm font-medium text-slate-900 cursor-pointer">
                As listed
              </Label>
              <span className="text-xs text-slate-400">Create deadline records</span>
            </div>
          </div>

          {/* Unregistered */}
          <div className="flex items-start gap-3">
            <RadioGroupItem value="unregistered" id="unregistered" className="mt-0.5 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="unregistered" className="text-sm font-medium text-slate-900 cursor-pointer">
                Unregistered
              </Label>
              <span className="text-xs text-slate-400">No deadline will be registered</span>
            </div>
          </div>
        </RadioGroup>
      </section>
    </div>
  )
}
