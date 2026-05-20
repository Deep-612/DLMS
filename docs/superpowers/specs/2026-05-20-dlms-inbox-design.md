# DLMS Document Inbox — Design Spec

**Date:** 2026-05-20  
**Figma source:** [node 58:17729](https://www.figma.com/design/9lpDIO49l0m01kPDqRDl9J/Deadline-Management-System--DLMS-?node-id=58-17729)  
**Status:** Approved

---

## Overview

Implement the Document Inbox screen for the Deadline Management System (DLMS), used by the law firm Schellenberg Wittmer. The inbox lets users review incoming documents, track their status, and assign them to team members.

This is the first screen of a larger app (Calendar and Reports pages to follow). The implementation starts here and the shell is architected to support additional routes.

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **UI components:** shadcn/ui (CLI-initialized)
- **Table logic:** @tanstack/react-table
- **Icons:** lucide-react
- **Styling:** Tailwind CSS + CSS custom properties (design tokens from Figma)
- **Font:** Outfit (self-hosted via next/font/google) — matches Figma `typography/font-family/font-sans`
- **Data:** Mock static data (typed TypeScript module), no backend

---

## Project Structure

```
app/
  layout.tsx              — root layout: Outfit font, global CSS vars, <html>/<body>
  page.tsx                — redirects to /inbox
  inbox/
    page.tsx              — Inbox route, renders <InboxPage />
components/
  inbox/
    inbox-page.tsx        — top-level page shell (header + white content section)
    document-table.tsx    — TanStack Table instance with column definitions
    assignee-picker.tsx   — inline Popover for reassigning a document
    status-badge.tsx      — colored pill badge for document status
  layout/
    nav-bar.tsx           — top nav: logo, Inbox/Calendar/Reports, search, bell, profile
lib/
  mock-data.ts            — typed Document[] and User[] arrays
  types.ts                — Document, User, DocumentStatus types
```

---

## Data Model

```typescript
// lib/types.ts

type DocumentStatus =
  | "To Do"
  | "Draft"
  | "In Progress"
  | "Submitted for Validation"
  | "Validated"

type User = {
  id: string
  name: string
  initials: string    // e.g. "JPP" — shown below name in the assignee cell
  email: string
  avatarUrl?: string
}

type Document = {
  id: string          // "DOC-001"
  receivedDate: string  // ISO date string, e.g. "2026-04-21"
  source: string      // "FINMA" | "Judicial Mail" | "Justitia" | ...
  fileName: string    // "document.pdf"
  status: DocumentStatus
  assignedTo: User | null
}
```

**Mock data (lib/mock-data.ts):**
- 5 documents: DOC-001 through DOC-005 matching the Figma exactly
- 5 users: Johny Depp (JPP), Ehsan Clario (EIO), Stephanie Sharkey (SEY), Harry Morningstar (HAR), Mary Depp (MPP)
- Current user: Johny Depp (used for "Assign to me" and the profile pill)
- `pendingCount` is derived at runtime: `documents.filter(d => !["Submitted for Validation", "Validated"].includes(d.status)).length`
  - "Submitted for Validation" is excluded because the user's action is complete; it matches the "4 items pending" shown in the Figma (2× To Do + 1× In Progress + 1× Draft = 4)

---

## UI Components

### NavBar (`components/layout/nav-bar.tsx`)
- **Left:** Schellenberg Wittmer SVG logo (from Figma asset), followed by a pill-shaped nav container with Inbox / Calendar / Reports buttons
  - Active route gets `bg-[var(--base/primary)] text-[var(--base/primary-foreground)]` (dark pill)
  - Inactive routes are transparent with foreground text
- **Right:** search input (pill, 200px wide, Search icon inside), notification bell button, user profile pill (avatar + name + email + chevron-down)
- Nav links use Next.js `<Link>` for routing. Active state derived from `usePathname()`

### InboxPage (`components/inbox/inbox-page.tsx`)
- Slate-100 background, rounded-2xl white content card
- Header row: "Document Inbox" (2xl semibold) + "4 items pending" badge (derived) + subtitle
- Below header: tab bar (left) + Assignee filter dropdown (right)
- Document table fills the rest of the card

### Status Badge (`components/inbox/status-badge.tsx`)
Color mapping:
| Status | Background | Text | Border |
|---|---|---|---|
| In Progress | blue-50 | blue-500 | blue-100 |
| Submitted for Validation | blue-50 | blue-500 | blue-100 |
| To Do | red-50 | red-500 | red-100 |
| Draft | amber-50 | amber-600 | amber-100 |
| Validated | green-100 | green-600 | green-200 |

### DocumentTable (`components/inbox/document-table.tsx`)
TanStack Table with the following columns:

| # | Key | Header | Sortable | Notes |
|---|---|---|---|---|
| 1 | select | checkbox | — | select-all in header, individual in rows |
| 2 | id | ID | yes | plain text |
| 3 | receivedDate | Received Date | yes | formatted "DD MMM YYYY" |
| 4 | source | Document Source | yes | plain text |
| 5 | fileName | Mail | — | file icon + underlined link text |
| 6 | status | Status | — | `<StatusBadge>` |
| 7 | assignedTo | Assigned to | — | avatar + name + initials, or "Unassigned / Assign to me"; `<AssigneePicker>` in cell |
| 8 | actions | — | — | "Review" button (In Progress rows only); chevron for row expand |

**Sorting:** clicking a sortable column header cycles: none → asc → desc → none. Sort icon is `ArrowDownUp` from lucide-react, shown in the header cell.

**Tab filtering:** TanStack column filter on the `status` column. "All Documents" clears the filter; other tabs set `status === tabValue`.

**Global search:** TanStack global filter, applied to `id` and `source` fields. Wired to the search input in the NavBar via a lifted state (or a URL search param `?q=`).

**Assignee filter dropdown:** a shadcn `<DropdownMenu>` listing all users + "Unassigned". Selecting a user adds a column filter on `assignedTo.id`. Displayed as "Assignee" button with chevron.

### AssigneePicker (`components/inbox/assignee-picker.tsx`)
- Rendered inside the Assigned To cell
- Trigger: clicking the assignee cell opens a shadcn `<Popover>`
- Popover content: search `<Input>`, list of users (avatar + name + initials), "Unassigned" option at top
- Selecting updates the document's `assignedTo` in the page-level `useState` documents array
- "Assign to me" link (shown on unassigned rows outside the popover) is a shortcut that sets `assignedTo = currentUser`

### Row Expand
- A `<ChevronDown>` / `<ChevronRight>` toggle at the end of each row
- Uses TanStack Table row expansion; expanded sub-row renders a placeholder `<p>No details yet.</p>`
- Chevron rotates 180° when expanded (Tailwind `transition-transform`)

---

## Styling & Design Tokens

CSS variables (defined in `app/globals.css`) map the Figma token names to concrete values:

```css
:root {
  --base-primary: #0f172a;
  --base-primary-foreground: #f8fafc;
  --base-foreground: #0f172a;
  --base-background: #ffffff;
  --base-muted: #f1f5f9;
  --base-muted-foreground: #64748b;
  --base-input: #e2e8f0;
  --base-accent: #f8fafc;
  --base-secondary-foreground: #0f172a;
  --border-radius-full: 9999px;
  --border-radius-2xl: 20px;
  --border-radius-lg: 8px;
  --border-radius-md: 6px;
}
```

Tailwind `fontFamily.sans` is overridden to `['Outfit', 'sans-serif']` in `tailwind.config.ts`.

---

## Interactivity Summary

| Feature | Mechanism |
|---|---|
| Tab filtering | TanStack column filter on `status` |
| Global search | TanStack global filter on `id` + `source` |
| Column sort | TanStack sort state, ArrowDownUp icon in headers |
| Assignee picker | shadcn Popover, updates local state |
| Assign to me | Direct state update, no popover needed |
| Assignee filter | TanStack column filter on `assignedTo.id` |
| Row expand | TanStack row expansion, chevron toggle |
| Review button | Visible on In Progress rows; no-op (console.log) for now |
| Pending count badge | `documents.filter(d => d.status !== "Validated").length` |

---

## Out of Scope (this iteration)

- Calendar and Reports pages (routes can be added later)
- Authentication / real user session
- Backend API / database
- Notifications (bell button renders but has no handler)
- Pagination (mock data is small; TanStack Table is ready for it)
