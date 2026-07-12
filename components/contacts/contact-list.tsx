"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Mail, Phone, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ContactForm } from "./contact-form"
import { getInitials, formatDate } from "@/lib/utils"

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  status: string
  createdAt: string
}

interface ContactListProps {
  contacts: Contact[]
  onRefresh: () => void
}

const statusColors: Record<string, "success" | "warning" | "default"> = {
  Active: "success",
  Lead: "warning",
  Inactive: "default",
}

export function ContactList({ contacts, onRefresh }: ContactListProps) {
  const [editing, setEditing] = useState<Contact | null>(null)
  const [creating, setCreating] = useState(false)

  const handleSave = async (data: any) => {
    const { id, ...body } = data
    const method = id ? "PATCH" : "POST"
    try {
      const res = await fetch("/api/contacts" + (id ? `/${id}` : ""), {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setEditing(null)
        setCreating(false)
        onRefresh()
      }
    } catch (e) { console.error("Failed to save contact", e) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this contact?")) return
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" })
      if (res.ok) onRefresh()
    } catch (e) { console.error("Failed to delete contact", e) }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contacts</CardTitle>
          <Button size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Contact
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-slate-900 dark:text-white">{contact.name}</span>
                    <Badge variant={statusColors[contact.status] || "default"} className="capitalize">
                      {contact.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{contact.email}</span>
                    {contact.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{contact.phone}</span>}
                    {contact.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{contact.company}</span>}
                  </div>
                </div>
                <div className="text-xs text-slate-400 hidden sm:block">{formatDate(contact.createdAt)}</div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(contact)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-400 hover:text-rose-500" onClick={() => handleDelete(contact.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {contacts.length === 0 && (
              <div className="px-6 py-12 text-center text-sm text-slate-400">
                No contacts yet. Add your first contact.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Contact</DialogTitle>
            <DialogDescription>Add a new contact to your CRM.</DialogDescription>
          </DialogHeader>
          <ContactForm onSave={handleSave} onCancel={() => setCreating(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>Update contact details.</DialogDescription>
          </DialogHeader>
          <ContactForm contact={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
