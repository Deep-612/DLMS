"use client"

import { useEffect } from "react"

type ToastProps = {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  onClose: () => void
  duration?: number
}

export function Toast({
  title,
  description,
  actionLabel,
  onAction,
  onClose,
  duration = 4000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50" style={{animation: "toast-in 0.2s ease-out"}}>
      <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl pl-4 pr-6 py-4 shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.05)] min-w-[320px] max-w-[480px]">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 leading-5">{title}</p>
          {description && (
            <p className="text-sm font-normal text-slate-900 opacity-90 leading-5">{description}</p>
          )}
        </div>
        {actionLabel && (
          <button
            onClick={() => { onAction?.(); onClose() }}
            className="shrink-0 flex items-center justify-center h-9 px-4 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-900 shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-slate-50 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
