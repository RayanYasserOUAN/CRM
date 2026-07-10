"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { KanbanBoard } from "@/components/deals/kanban-board"

export default function DealsPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [deals, setDeals] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])

  const fetchDeals = async () => {
    try {
      const res = await fetch("/api/deals")
      if (res.status === 401) { router.push("/login"); return }
      const json = await res.json()
      setDeals(json.deals || [])
      setContacts(json.contacts || [])
    } catch {}
  }

  useEffect(() => { fetchDeals() }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" })
    router.push("/login")
    router.refresh()
  }

  return (
    <AppShell userName={userName} onLogout={handleLogout}>
      <KanbanBoard deals={deals} contacts={contacts} onRefresh={fetchDeals} />
    </AppShell>
  )
}
