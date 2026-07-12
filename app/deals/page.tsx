"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/layout/app-shell"
import { KanbanBoard } from "@/components/deals/kanban-board"

export default function DealsPage() {
  const [userName, setUserName] = useState("User")
  const [deals, setDeals] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])

  const fetchDeals = async () => {
    try {
      const res = await fetch("/api/deals")
      if (res.status === 401) { window.location.href = "/login"; return }
      const json = await res.json()
      setDeals(json.deals || [])
      setContacts(json.contacts || [])
    } catch {}
  }

  useEffect(() => { fetchDeals() }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" })
    window.location.href = "/login"
  }

  return (
    <AppShell userName={userName} onLogout={handleLogout}>
      <KanbanBoard deals={deals} contacts={contacts} onRefresh={fetchDeals} />
    </AppShell>
  )
}
