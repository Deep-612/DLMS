"use client"

import { useState } from "react"
import { AlertTriangle, ArrowDownUp, CalendarDays, ChevronDown, ExternalLink, FolderCog, Pencil, Plus, Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { TagsInput } from "./tags-input"
import { MOCK_USERS } from "@/lib/mock-data"

type Classification = "as-listed" | "unregistered"
type DeadlineType = "Hearing" | "External" | "Internal" | "Reminder"

type Reminder = { id: string; label: string }

type DeadlineEntry = {
  id: string
  type: DeadlineType
  date: string
  reminders: string[]
  description: string
  // Hearing
  location?: string
  roomNumber?: string
  time?: string
  duration?: string
  // External
  issuingAuthority?: string
  aderantRef?: string
  submissionMethod?: string
  // Internal
  internalDeadlineType?: string
  linkedExternalDeadline?: string
  assignedReviewer?: string
  // Reminder
  linkedDeadline?: string
  leadTime?: string
  deliveryMethod?: string
}

const SUBMISSION_METHODS = ["Justitia", "Email", "Post", "Hand Delivery", "E-Filing"]
const INTERNAL_DEADLINE_TYPES = ["Draft due", "Internal review", "Partner sign-off", "Client approval", "Internal filing"]
const DELIVERY_METHODS = ["Email", "Outlook Calendar", "Both"]

function formatDate(iso: string) {
  if (!iso) return ""
  const d = new Date(iso)
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

export function DeadlineForm() {
  const [matter, setMatter] = useState("GEV-2025-0412 / Müller v. Insurance AG")
  const [partner, setPartner] = useState("Johny Depp")
  const [responsible, setResponsible] = useState("3")
  const [classification, setClassification] = useState<Classification>("as-listed")

  const [teamMembers, setTeamMembers] = useState([
    { id: "SEY", label: "SEY" },
    { id: "EIO", label: "EIO" },
  ])
  const [assistants, setAssistants] = useState([
    { id: "ABA", label: "ABA" },
    { id: "LAR", label: "LAR" },
  ])

  const [kmFolderError] = useState(false)

  const [receivedDate, setReceivedDate] = useState("2025-04-12")
  const [documentDate, setDocumentDate] = useState("2025-04-14")

  // ── Deadline form state ───────────────────────────────────────
  const [deadlineType, setDeadlineType] = useState<DeadlineType>("Hearing")
  const [calculatedDate, setCalculatedDate] = useState("2026-04-22")
  const [description, setDescription] = useState("")
  const [reminders, setReminders] = useState<Reminder[]>([
    { id: "14apr", label: "14 Apr" },
    { id: "18apr", label: "18 Apr" },
  ])

  // Hearing fields
  const [hearingLocation, setHearingLocation] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [hearingTime, setHearingTime] = useState("12:30")
  const [duration, setDuration] = useState("30")

  // External fields
  const [issuingAuthority, setIssuingAuthority] = useState("")
  const [aderantRef, setAderantRef] = useState("")
  const [submissionMethod, setSubmissionMethod] = useState("")

  // Internal fields
  const [internalDeadlineType, setInternalDeadlineType] = useState("")
  const [linkedExternalDeadline, setLinkedExternalDeadline] = useState("")
  const [assignedReviewer, setAssignedReviewer] = useState("")

  // Reminder fields
  const [linkedDeadline, setLinkedDeadline] = useState("")
  const [leadTime, setLeadTime] = useState("")
  const [deliveryMethod, setDeliveryMethod] = useState("")

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
    {
      id: "2",
      type: "External",
      date: "2026-04-24",
      reminders: ["14 Apr"],
      description: "Filing deadline for regulatory submission as per authority request.",
      issuingAuthority: "FINMA",
      aderantRef: "DOC-001",
      submissionMethod: "Justitia",
    },
    {
      id: "3",
      type: "Internal",
      date: "2026-04-22",
      reminders: ["14 Apr", "18 Apr"],
      description: "Filing deadline for regulatory submission as per authority request.",
      internalDeadlineType: "Draft due",
      linkedExternalDeadline: "Internal prep to the submission",
      assignedReviewer: "Lucifer M.",
    },
    {
      id: "4",
      type: "Reminder",
      date: "2026-04-24",
      reminders: ["14 Apr"],
      description: "Filing deadline for regulatory submission as per authority request.",
      linkedDeadline: "Reminder for deadline",
      leadTime: "7",
      deliveryMethod: "Justitia",
    },
  ])

  function resetDeadlineForm() {
    setDescription("")
    setHearingLocation("")
    setRoomNumber("")
    setIssuingAuthority("")
    setAderantRef("")
    setSubmissionMethod("")
    setInternalDeadlineType("")
    setLinkedExternalDeadline("")
    setAssignedReviewer("")
    setLinkedDeadline("")
    setLeadTime("")
    setDeliveryMethod("")
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
        location: hearingLocation,
        roomNumber,
        time: hearingTime,
        duration,
        issuingAuthority,
        aderantRef,
        submissionMethod,
        internalDeadlineType,
        linkedExternalDeadline,
        assignedReviewer,
        linkedDeadline,
        leadTime,
        deliveryMethod,
      },
    ])
    resetDeadlineForm()
  }

  function deleteDeadline(id: string) {
    setDeadlines((prev) => prev.filter((d) => d.id !== id))
  }

  // ── Dynamic fields per deadline type ─────────────────────────
  function renderTypeFields() {
    switch (deadlineType) {
      case "Hearing":
        return (
          <>
            {/* Reminders | Hearing Location */}
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
                  value={hearingLocation}
                  onChange={(e) => setHearingLocation(e.target.value)}
                  className="h-9 rounded-md border-slate-200 text-sm"
                />
              </div>
            </div>
            {/* Room Number | Hearing Time */}
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
                <input
                  type="time"
                  value={hearingTime}
                  onChange={(e) => setHearingTime(e.target.value)}
                  className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
                />
              </div>
            </div>
            {/* Duration */}
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
          </>
        )

      case "External":
        return (
          <>
            {/* Reminders | Issuing Authority */}
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
                <Label className="text-xs font-medium text-slate-700">Issuing Authority</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    placeholder="Search authority..."
                    value={issuingAuthority}
                    onChange={(e) => setIssuingAuthority(e.target.value)}
                    className="pl-9 h-9 rounded-md border-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>
            {/* Aderant Ref | Submission Method */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-slate-700">Aderant Matter Reference No.</Label>
                <Input
                  placeholder="File reference number"
                  value={aderantRef}
                  onChange={(e) => setAderantRef(e.target.value)}
                  className="h-9 rounded-md border-slate-200 text-sm"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-slate-700">Submission method</Label>
                <Select value={submissionMethod} onValueChange={setSubmissionMethod}>
                  <SelectTrigger className="w-full rounded-md border-slate-200 text-sm">
                    <SelectValue placeholder="Select method..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBMISSION_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )

      case "Internal":
        return (
          <>
            {/* Reminders | Internal Deadline Type */}
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
                <Label className="text-xs font-medium text-slate-700">Internal Deadline type</Label>
                <Select value={internalDeadlineType} onValueChange={setInternalDeadlineType}>
                  <SelectTrigger className="w-full rounded-md border-slate-200 text-sm">
                    <SelectValue placeholder="Select type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERNAL_DEADLINE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Linked External Deadline | Assigned Reviewer */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-slate-700">Linked External Deadline</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    placeholder="Search external deadline..."
                    value={linkedExternalDeadline}
                    onChange={(e) => setLinkedExternalDeadline(e.target.value)}
                    className="pl-9 h-9 rounded-md border-slate-200 text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-slate-700">Assigned Reviewer</Label>
                <Select value={assignedReviewer} onValueChange={setAssignedReviewer}>
                  <SelectTrigger className="w-full rounded-md border-slate-200 text-sm">
                    <SelectValue placeholder="Select reviewer..." />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_USERS.map((u) => (
                      <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )

      case "Reminder":
        return (
          <>
            {/* Reminders | Linked Deadline */}
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
                <Label className="text-xs font-medium text-slate-700">Linked Deadline</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <Input
                    placeholder="Reminder for deadline..."
                    value={linkedDeadline}
                    onChange={(e) => setLinkedDeadline(e.target.value)}
                    className="pl-9 h-9 rounded-md border-slate-200 text-sm"
                  />
                </div>
              </div>
            </div>
            {/* Lead Time | Delivery method */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-slate-700">Lead Time</Label>
                <div className="relative flex items-center h-9 w-full rounded-md border border-slate-200 bg-white shadow-sm px-3 text-sm gap-2 overflow-hidden">
                  <input
                    type="number"
                    min={1}
                    value={leadTime}
                    onChange={(e) => setLeadTime(e.target.value)}
                    placeholder="7"
                    className="flex-1 min-w-0 bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                  />
                  <span className="text-slate-400 shrink-0">days</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-medium text-slate-700">Delivery method</Label>
                <Select value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <SelectTrigger className="w-full rounded-md border-slate-200 text-sm">
                    <SelectValue placeholder="Select method..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_METHODS.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )
    }
  }

  // ── Expanded detail row per deadline type ─────────────────────
  function renderEntryDetail(dl: DeadlineEntry) {
    return (
      <div className="px-3 pb-3 flex flex-col gap-1 text-xs text-slate-500">
        {dl.description && (
          <span><span className="font-medium text-slate-600">Description:</span> {dl.description}</span>
        )}
        {dl.type === "Hearing" && (dl.location || dl.time) && (
          <span>
            <span className="font-medium text-slate-600">Hearing:</span>{" "}
            {[
              dl.location,
              dl.roomNumber && `Room ${dl.roomNumber}`,
              dl.time && dl.duration ? `${dl.time} (${dl.duration} min)` : dl.time,
            ].filter(Boolean).join(" — ")}
          </span>
        )}
        {dl.type === "External" && (
          <>
            {dl.issuingAuthority && (
              <span><span className="font-medium text-slate-600">Issuing Authority:</span> {dl.issuingAuthority}</span>
            )}
            {dl.aderantRef && (
              <span><span className="font-medium text-slate-600">Aderant Matter Reference No.:</span> {dl.aderantRef}</span>
            )}
            {dl.submissionMethod && (
              <span><span className="font-medium text-slate-600">Submission method:</span> {dl.submissionMethod}</span>
            )}
          </>
        )}
        {dl.type === "Internal" && (
          <>
            {dl.internalDeadlineType && (
              <span><span className="font-medium text-slate-600">Internal Deadline type:</span> {dl.internalDeadlineType}</span>
            )}
            {dl.linkedExternalDeadline && (
              <span><span className="font-medium text-slate-600">Linked External Deadline:</span> {dl.linkedExternalDeadline}</span>
            )}
            {dl.assignedReviewer && (
              <span><span className="font-medium text-slate-600">Assigned Reviewer:</span> {dl.assignedReviewer}</span>
            )}
          </>
        )}
        {dl.type === "Reminder" && (
          <>
            {dl.linkedDeadline && (
              <span><span className="font-medium text-slate-600">Linked Deadline:</span> {dl.linkedDeadline}</span>
            )}
            {dl.leadTime && (
              <span><span className="font-medium text-slate-600">Lead Time:</span> {dl.leadTime} days</span>
            )}
            {dl.deliveryMethod && (
              <span><span className="font-medium text-slate-600">Delivery method:</span> {dl.deliveryMethod}</span>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 overflow-y-auto h-full">

      {/* ── Overview ───────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>

        <div className="grid grid-cols-2 gap-4">
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

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-700">Responsible</Label>
          <Select value={responsible} onValueChange={setResponsible}>
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

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-700">Team Members</Label>
          <TagsInput
            tags={teamMembers}
            onRemove={(id) => setTeamMembers((t) => t.filter((m) => m.id !== id))}
            placeholder="Add team members..."
            suffix={<ChevronDown className="h-4 w-4 text-slate-400" />}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-700">Assistants</Label>
          <TagsInput
            tags={assistants}
            onRemove={(id) => setAssistants((a) => a.filter((m) => m.id !== id))}
            placeholder="Add assistants..."
            suffix={<ChevronDown className="h-4 w-4 text-slate-400" />}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-medium text-slate-700">KNOWLEDGE MILL Folder</Label>
          <div className={`flex items-center justify-between h-9 px-3 rounded-md border bg-white shadow-sm ${kmFolderError ? "border-amber-300" : "border-slate-200"}`}>
            <span className="text-sm text-slate-900">KM / Matter Files / Court Submissions</span>
            <FolderCog className={`h-4 w-4 shrink-0 ${kmFolderError ? "text-red-500" : "text-slate-400"}`} />
          </div>
          {kmFolderError ? (
            <div className="flex items-center gap-1.5 text-amber-600 text-xs">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>Access to the target KM folder is restricted or unavailable.</span>
            </div>
          ) : (
            <button className="flex items-center gap-1 text-xs text-blue-500 hover:underline w-fit">
              Open KM Folder
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
        </div>
      </section>

      {/* ── Dates ──────────────────────────────────────────────── */}
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

      {/* ── Classification ─────────────────────────────────────── */}
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
              <Label htmlFor="as-listed" className="text-sm font-medium text-slate-900 cursor-pointer">As listed</Label>
              <span className="text-xs text-slate-400">Create deadline records</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RadioGroupItem value="unregistered" id="unregistered" className="mt-0.5 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <Label htmlFor="unregistered" className="text-sm font-medium text-slate-900 cursor-pointer">Unregistered</Label>
              <span className="text-xs text-slate-400">No deadline will be registered</span>
            </div>
          </div>
        </RadioGroup>
      </section>

      {/* ── Deadlines (As listed only) ─────────────────────────── */}
      {classification === "as-listed" && (
        <section className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Deadlines</h2>

          {/* Type + Calculated Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-700">Deadline type</Label>
              <Select value={deadlineType} onValueChange={(v) => { setDeadlineType(v as DeadlineType); resetDeadlineForm() }}>
                <SelectTrigger className="w-full rounded-md border-slate-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["Hearing", "External", "Internal", "Reminder"] as DeadlineType[]).map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-slate-700">Calculated Deadline Date</Label>
              <input
                type="date"
                value={calculatedDate}
                onChange={(e) => setCalculatedDate(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white"
              />
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

          {/* Type-specific fields */}
          {renderTypeFields()}

          {/* Add Deadline */}
          <button
            onClick={handleAddDeadline}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 text-white text-sm font-medium h-10 hover:bg-slate-800 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Deadline
          </button>

          {/* Deadline list */}
          {deadlines.length > 0 && (
            <div className="border border-slate-100 rounded-md overflow-hidden">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Deadline type", "Deadline Date", "Reminders"].map((col) => (
                      <th key={col} className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">
                        <button className="flex items-center gap-1">
                          {col} <ArrowDownUp className="h-3 w-3 shrink-0" />
                        </button>
                      </th>
                    ))}
                    <th className="w-16 px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {deadlines.map((dl) => (
                    <>
                      <tr key={dl.id} className="border-t border-slate-100 first:border-0">
                        <td className="px-3 pt-3 pb-1 font-medium text-slate-900 whitespace-nowrap align-top">{dl.type}</td>
                        <td className="px-3 pt-3 pb-1 text-blue-500 underline cursor-pointer whitespace-nowrap align-top">{formatDate(dl.date)}</td>
                        <td className="px-3 pt-3 pb-1 text-slate-600 align-top">{dl.reminders.join(", ")}</td>
                        <td className="px-3 pt-3 pb-1 align-top whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button className="p-1 text-slate-400 hover:text-slate-700 transition-colors">
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => deleteDeadline(dl.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr key={`detail-${dl.id}`} className="border-b border-slate-100 last:border-0">
                        <td colSpan={4} className="pb-2">
                          {renderEntryDetail(dl)}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
