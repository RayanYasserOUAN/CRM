"use client"

import { useState } from "react"
import { Users } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { ContactList } from "@/components/contacts/contact-list"
import { useApi } from "@/hooks/use-api"
import type { Contact } from "@/lib/types"

export default function ContactsPage() {
  const [userName, setUserName] = useState("User")
  const { data: json, loading, refresh } = useApi<{ contacts: Contact[] }>("/api/contacts", { contacts: [] })
  const contacts = json.contacts

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
        {loading ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
              <div className="h-9 w-28 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-6 py-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800/50 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No contacts yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Contacts will appear here once added.</p>
          </div>
        ) : (
          <ContactList contacts={contacts} onRefresh={refresh} />
        )}
      </div>
    </AppShell>
  )
}
