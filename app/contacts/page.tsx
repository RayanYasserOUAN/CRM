"use client"

import { useState, useEffect } from "react"
import { Users } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { ContactList } from "@/components/contacts/contact-list"

export default function ContactsPage() {
  const [userName, setUserName] = useState("User")
  const [contacts, setContacts] = useState<any[]>([])

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts")
      const json = await res.json()
      setContacts(json.contacts || [])
    } catch { console.error("Failed to fetch contacts") }
  }

  useEffect(() => { fetchContacts() }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" })
    window.location.href = "/"
  }

  return (
    <AppShell userName={userName} onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Contacts</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your contact list</p>
        </div>
        {contacts.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No contacts yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Contacts will appear here once added.</p>
          </div>
        ) : (
          <ContactList contacts={contacts} onRefresh={fetchContacts} />
        )}
      </div>
    </AppShell>
  )
}
