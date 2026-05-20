import type { Document, User } from "./types"

export const MOCK_USERS: User[] = [
  { id: "1", name: "Johny Depp",        initials: "JPP", email: "johny.depp@swlegal.ch" },
  { id: "2", name: "Ehsan Clario",      initials: "EIO", email: "ehsan.clario@swlegal.ch" },
  { id: "3", name: "Stephanie Sharkey", initials: "SEY", email: "stephanie.sharkey@swlegal.ch" },
  { id: "4", name: "Harry Morningstar", initials: "HAR", email: "harry.morningstar@swlegal.ch" },
  { id: "5", name: "Mary Depp",         initials: "MPP", email: "mary.depp@swlegal.ch" },
]

export const CURRENT_USER = MOCK_USERS[0]

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: "DOC-001",
    receivedDate: "2026-04-21",
    source: "FINMA",
    fileName: "document.pdf",
    status: "In Progress",
    assignedTo: MOCK_USERS[0],
  },
  {
    id: "DOC-002",
    receivedDate: "2026-04-24",
    source: "Judicial Mail",
    fileName: "document.pdf",
    status: "Submitted for Validation",
    assignedTo: MOCK_USERS[1],
  },
  {
    id: "DOC-003",
    receivedDate: "2026-05-04",
    source: "Justitia",
    fileName: "document.pdf",
    status: "To Do",
    assignedTo: MOCK_USERS[2],
  },
  {
    id: "DOC-004",
    receivedDate: "2026-05-03",
    source: "FINMA",
    fileName: "document.pdf",
    status: "To Do",
    assignedTo: null,
  },
  {
    id: "DOC-005",
    receivedDate: "2026-05-05",
    source: "Justitia",
    fileName: "document.pdf",
    status: "Draft",
    assignedTo: null,
  },
]
