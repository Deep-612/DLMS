export type DocumentStatus =
  | "To Do"
  | "Draft"
  | "In Progress"
  | "Submitted for Validation"
  | "Validated"

export type User = {
  id: string
  name: string
  initials: string
  email: string
  avatarUrl?: string
}

export type Document = {
  id: string
  receivedDate: string
  source: string
  fileName: string
  status: DocumentStatus
  assignedTo: User | null
}
