"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { KanbanBoard } from "@/components/deals/kanban-board"
import { useApi } from "@/hooks/use-api"
import type { Deal, Contact } from "@/lib/types"

export default function DealsPage() {
  const [userName, setUserName] = useState("User")
  const { data: json, loading, refresh } = useApi<{ deals: Deal[]; contacts: Contact[] }>("/api/deals", { deals: [], contacts: [] })
  const deals = json.deals
  const contacts = json.contacts

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" })
    window.location.href = "/"
  }

  return (
    <AppShell userName={userName} onLogout={handleLogout}>
      {loading ? (
        <div className="space-y-6">
          <div>
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-4 w-56 bg-slate-100 dark:bg-slate-800/50 rounded mt-2 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-4" />
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : deals.length === 0 ? (
        <div className="text-center py-16">
          <TrendingUp className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No deals yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create your first deal to start building your pipeline.</p>
        </div>
      ) : (
        <KanbanBoard deals={deals} contacts={contacts} onRefresh={refresh} />
      )}
    </AppShell>
  )
}
