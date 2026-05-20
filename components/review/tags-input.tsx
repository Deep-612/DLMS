"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type Tag = { id: string; label: string }

type Props = {
  tags: Tag[]
  onRemove: (id: string) => void
  placeholder?: string
  className?: string
  suffix?: React.ReactNode
}

export function TagsInput({ tags, onRemove, placeholder, className, suffix }: Props) {
  return (
    <div
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 shadow-sm",
        className
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag.id}
          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-800 shadow-sm"
        >
          {tag.label}
          <button
            type="button"
            onClick={() => onRemove(tag.id)}
            className="opacity-60 hover:opacity-100 transition-opacity"
            aria-label={`Remove ${tag.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {tags.length === 0 && placeholder && (
        <span className="text-sm text-slate-400 ml-1">{placeholder}</span>
      )}
      {suffix && <span className="ml-auto shrink-0">{suffix}</span>}
    </div>
  )
}
