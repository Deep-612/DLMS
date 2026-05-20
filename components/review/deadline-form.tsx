"use client"

import { useState } from "react"
import { AlertTriangle, ArrowDownUp, CalendarDays, ChevronDown, Clock, FolderCog, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { TagsInput } from "./tags-input"
import { MOCK_USERS } from "@/lib/mock-data"

type Classification = "as-listed" | "unregistered"

type DeadlineEntry = {
  id: string
  type: string
  date: string
  reminders: string[]
  description: string
  location: string
  roomNumber: string
  time: string
  duration: string
}

const DEADLINE_TYPES = ["Hearing", "External", "Internal", "Reminder"]

export function DeadlineForm() {
  const [matter, setMatter] = useState("")
  const [partner, setPartner] = useState("")
  const [classification, setClassification] = useState<Classification>("as-listed")

  // Team Members and Assistants as tag lists
  const [teamMembers, setTeamMembers] = useState([
    { id: "SEY", label: "SEY" },
    { id: "EIO", label: "EIO" },
  ])
  const [assistants, setAssistants] = useState([
    { id: "ABA", label: "ABA" },
    { id: "LAR", label: "LAR" },
  ])

  // KM folder warning state
  const [kmFolderError] = useState(true)

  // Dates
  const [receivedDate, setReceivedDate] = useState("2025-04-12")
  const [documentDate, setDocumentDate] = useState("2025-04-14")

  // Deadline form state
  const [deadlineType, setDeadlineType] = useState("Hearing")
  const [calculatedDate, setCalculatedDate] = useState("2026-04-22")
  const [description, setDescription] = useState("")
  const [reminders, setReminders] = useState([
    { id: "14apr", label: "14 Apr" },
    { id: "18apr", label: "18 Apr" },
  ])
  const [location, setLocation] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [hearingTime, setHearingTime] = useState("12:30")
  const [duration, setDuration] = useState("30")

  // Saved deadlines list
  const [deadlines, setDeadlines] = useState<DeadlineEntry[]>([
    {
      id: "1",
      type: "Hearing",
      date: "2026-04-22",
      reminders: ["14 Apr", "18 Apr"],
      description: "Response deadline for court notice received via judicial mail.",
      location: "Geneva Court",
      roomNumber: "3B",
      time: "12:30",
      duration: "30",
    },
  ])

  function formatDate(iso: string) {
    if (!iso) return ""
    const d = new Date(iso)
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
  }

  function handleAddDeadline() {
    if (!deadlineType || !calculatedDate) return
    setDeadlines((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        type: deadlineType,
        date: calculatedDate,
        reminders: reminders.map((r) => r.label),
        description,
        location,
        roomNumber,
        time: hearingTime,
        duration,
      },
    ])
    setDescription("")
    setLocation("")
    setRoomNumber("")
  }

  function deleteDeadline(id: string) {
    setDeadlines((prev) => prev.filter((d) => d.id !== id))
  }

  return (
    <div className="flex flex-col gap-5 overflow-y-auto h-full">

      {/* ── Overview ─────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Matter / Case */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-slate-700">Matter / Case</Label>
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

          {/* Partner */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-slate-700">Partner</Label>
            <Input
              placeholder="Partner name..."
              value={partner}
              onChange={(e) => setPartner(e.target.value)}
              className="h-9 rounded-md border-slate-200 text-sm"
            />
          </div>
        </div>

        {/* Responsible */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-700">Responsible</Label>
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
          <Label className="text-xs font-medium text-slate-700">Team Members</Label>
          <TagsInput
            tags={teamMembers}
            onRemove={(id) => setTeamMembers((t) => t.filter((m) => m.id !== id))}
            placeholder="Add team members..."
            suffix={<ChevronDown className="h-4 w-4 text-slate-400" />}
          />
        </div>

        {/* Assistants */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-700">Assistants</Label>
          <TagsInput
            tags={assistants}
            onRemove={(id) => setAssistants((a) => a.filter((m) => m.id !== id))}
            placeholder="Add assistants..."
            suffix={<ChevronDown className="h-4 w-4 text-slate-400" />}
          />
        </div>

        {/* KNOWLEDGE MILL Folder */}
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-700">KNOWLEDGE MILL Folder</Label>
          <div className="flex items-center justify-between h-9 px-3 rounded-md border border-slate-200 bg-white shadow-sm">
            <span className="text-sm text-slate-900">KM / Matter Files / Court Submissions</span>
            <FolderCog className={`h-4 w-4 shrink-0 ${kmFolderError ? "text-red-500" : "text-slate-400"}`} />
          </div>
          {kmFolderError && (
            <div className="flex items-center gap-1.5 text-amber-600 text-xs">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Access to the target KM folder is restricted or unavailable.</span>
            </div>
          )}
        </div>
      </section>

      {/* ── Dates ────────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Dates</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-slate-700">Received Date</Label>
            <input
              type="date"
              value={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-slate-700">Document Date</Label>
            <input
              type="date"
              value={documentDate}
              onChange={(e) => setDocumentDate(e.target.value)}
              className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
            />
          </div>
        </div>
      </section>

      {/* ── Classification ───────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Classification</h2>
        <RadioGroup
          value={classification}
          onValueChange={(v) => setClassification(v as Classification)}
          className="grid grid-cols-2 gap-4"
        >
          <div className="flex items-start gap-3">
            <RadioGroupItem value="as-listed" id="as-listed" className="mt-0.5 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="as-listed" className="text-sm font-medium text-slate-900 cursor-pointer">
                As listed
              </Label>
              <span className="text-xs text-slate-400">Create deadline records</span>
            </div>
          </div>
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

      {/* ── Deadlines (only when As listed) ──────────────────────── */}
      {classification === "as-listed" && (
        <section className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Deadlines</h2>

          {/* Type + Calculated Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-700">Deadline type</Label>
              <Select value={deadlineType} onValueChange={setDeadlineType}>
                <SelectTrigger className="w-full rounded-md border-slate-200 text-sm">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent>
                  {DEADLINE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-700">Calculated Deadline Date</Label>
              <div className="relative">
                <input
                  type="date"
                  value={calculatedDate}
                  onChange={(e) => setCalculatedDate(e.target.value)}
                  className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-slate-700">Description</Label>
            <Textarea
              placeholder="Add deadline description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-md border-slate-200 text-sm resize-none min-h-[72px]"
            />
          </div>

          {/* Reminders + Hearing Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-700">Reminders</Label>
              <TagsInput
                tags={reminders}
                onRemove={(id) => setReminders((r) => r.filter((t) => t.id !== id))}
                placeholder="Add reminders..."
                suffix={<CalendarDays className="h-4 w-4 text-slate-400" />}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-700">Hearing Location</Label>
              <Input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-9 rounded-md border-slate-200 text-sm"
              />
            </div>
          </div>

          {/* Room Number + Hearing Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-700">Hearing Room Number</Label>
              <Input
                placeholder="Room Number"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="h-9 rounded-md border-slate-200 text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-700">Hearing Time</Label>
              <div className="relative">
                <input
                  type="time"
                  value={hearingTime}
                  onChange={(e) => setHearingTime(e.target.value)}
                  className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Hearing Duration */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-slate-700">Hearing Duration</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-9 w-24 rounded-md border-slate-200 text-sm"
                min={1}
              />
              <span className="text-sm text-slate-500">min</span>
            </div>
          </div>

          {/* Add Deadline button */}
          <button
            onClick={handleAddDeadline}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 text-white text-sm font-medium h-10 hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Deadline
          </button>

          {/* Deadline list */}
          {deadlines.length > 0 && (
            <div className="mt-1 border border-slate-100 rounded-md overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 px-3 py-2 bg-slate-50 border-b border-slate-100">
                {["Deadline type", "Deadline Date", "Reminders"].map((col) => (
                  <button key={col} className="flex items-center gap-1 text-xs font-medium text-slate-500">
                    {col} <ArrowDownUp className="h-3 w-3" />
                  </button>
                ))}
                <span />
              </div>

              {/* Rows */}
              {deadlines.map((dl) => (
                <div key={dl.id} className="border-b border-slate-100 last:border-0">
                  <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center px-3 py-3">
                    <span className="text-sm font-medium text-slate-900">{dl.type}</span>
                    <span className="text-sm text-blue-500 underline cursor-pointer">
                      {formatDate(dl.date)}
                    </span>
                    <span className="text-sm text-slate-600">
                      {dl.reminders.join(", ")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button className="p-1 text-slate-400 hover:text-slate-700 transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteDeadline(dl.id)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {/* Expanded detail */}
                  {(dl.description || dl.location) && (
                    <div className="px-3 pb-3 flex flex-col gap-1 text-xs text-slate-500">
                      {dl.description && (
                        <span><span className="font-medium">Description:</span> {dl.description}</span>
                      )}
                      {dl.location && (
                        <span>
                          <span className="font-medium">{dl.type}:</span>{" "}
                          {dl.location}
                          {dl.roomNumber && ` — Room ${dl.roomNumber}`}
                          {dl.time && ` — ${dl.time}`}
                          {dl.duration && ` (${dl.duration} min)`}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
