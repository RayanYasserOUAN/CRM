"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DealCard } from "./deal-card"
import { DealForm } from "./deal-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"

interface Deal {
  id: number
  title: string
  value: number
  stage: string
  contactName?: string
}

interface Contact {
  id: number
  name: string
}

interface KanbanBoardProps {
  deals: Deal[]
  contacts: Contact[]
  onRefresh: () => void
}

const stages = ["Lead", "Contacted", "Proposal", "Won", "Lost"]

const stageColors: Record<string, string> = {
  Lead: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  Contacted: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  Proposal: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
  Won: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  Lost: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300",
}

export function KanbanBoard({ deals, contacts, onRefresh }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const grouped = stages.reduce((acc, stage) => {
    acc[stage] = deals.filter((d) => d.stage === stage)
    return acc
  }, {} as Record<string, Deal[]>)

  const stageTotals = stages.reduce((acc, stage) => {
    acc[stage] = grouped[stage].reduce((sum, d) => sum + d.value, 0)
    return acc
  }, {} as Record<string, number>)

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(Number(event.active.id))
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const dealId = Number(active.id)
    const targetStage = String(over.id)

    if (stages.includes(targetStage)) {
      const deal = deals.find((d) => d.id === dealId)
      if (deal && deal.stage !== targetStage) {
        await fetch(`/api/deals/${dealId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stage: targetStage }),
        })
        onRefresh()
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this deal?")) return
    await fetch(`/api/deals/${id}`, { method: "DELETE" })
    onRefresh()
  }

  const handleCreate = async (data: any) => {
    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setCreating(false)
      onRefresh()
    }
  }

  const activeDeal = activeId ? deals.find((d) => d.id === activeId) : null

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Deals Pipeline</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Total pipeline: <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(Object.values(stageTotals).reduce((a, b) => a + b, 0))}</span>
          </p>
        </div>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4 mr-1.5" />
          New Deal
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stages.map((stage) => {
            const items = grouped[stage]
            const total = stageTotals[stage]
            return (
              <div key={stage} className="flex flex-col rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stageColors[stage]}`}>
                      {stage}
                    </span>
                    <span className="text-xs text-slate-400">{items.length}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{formatCurrency(total)}</span>
                </div>
                <div
                  className="flex flex-col gap-2 p-3 min-h-[200px] flex-1"
                >
                  <SortableContext items={items.map((d) => d.id)} strategy={verticalListSortingStrategy}>
                    {items.map((deal) => (
                      <DealCard key={deal.id} deal={deal} onDelete={handleDelete} />
                    ))}
                  </SortableContext>
                  {items.length === 0 && (
                    <div className="flex-1 flex items-center justify-center text-xs text-slate-400 py-8">
                      Drop deals here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <DragOverlay>
          {activeDeal && <div className="w-full max-w-xs"><DealCard deal={activeDeal} onDelete={() => {}} /></div>}
        </DragOverlay>
      </DndContext>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Deal</DialogTitle>
            <DialogDescription>Add a new deal to your pipeline.</DialogDescription>
          </DialogHeader>
          <DealForm contacts={contacts} onSave={handleCreate} onCancel={() => setCreating(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
