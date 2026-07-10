"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Deal {
  id: number
  title: string
  value: number
  stage: string
  contactName?: string
}

interface DealCardProps {
  deal: Deal
  onDelete: (id: number) => void
}

export function DealCard({ deal, onDelete }: DealCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: deal.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-slate-900 dark:text-white leading-snug">{deal.title}</h4>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(deal.id) }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-base font-semibold text-indigo-600 dark:text-indigo-400 mt-2">{formatCurrency(deal.value)}</p>
      {deal.contactName && (
        <p className="text-xs text-slate-400 mt-1.5 truncate">{deal.contactName}</p>
      )}
    </div>
  )
}
