"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { ContactList } from "@/components/contacts/contact-list"

export default function ContactsPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [contacts, setContacts] = useState<any[]>([])

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts")
      if (res.status === 401) { router.push("/login"); return }
      const json = await res.json()
      setContacts(json.contacts || [])
    } catch {}
  }

  useEffect(() => { fetchContacts() }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" })
    router.push("/login")
    router.refresh()
  }

  return (
    <AppShell userName={userName} onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Contacts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your contact list</p>
        </div>
        <ContactList contacts={contacts} onRefresh={fetchContacts} />
      </div>
    </AppShell>
  )
}
