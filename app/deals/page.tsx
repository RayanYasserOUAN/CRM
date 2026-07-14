"use client"

import { useState, useEffect } from "react"
import { TrendingUp } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { KanbanBoard } from "@/components/deals/kanban-board"

export default function DealsPage() {
  const [userName, setUserName] = useState("User")
  const [deals, setDeals] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])

  const fetchDeals = async () => {
    try {
      const res = await fetch("/api/deals")
      const json = await res.json()
      setDeals(json.deals || [])
      setContacts(json.contacts || [])
    } catch { console.error("Failed to fetch deals") }
  }

  useEffect(() => { fetchDeals() }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" })
    window.location.href = "/"
  }

  return (
    <AppShell userName={userName} onLogout={handleLogout}>
      {deals.length === 0 ? (
        <div className="text-center py-16">
          <TrendingUp className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No deals yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Create your first deal to start building your pipeline.</p>
        </div>
      ) : (
        <KanbanBoard deals={deals} contacts={contacts} onRefresh={fetchDeals} />
      )}
    </AppShell>
  )
}
