"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Contact {
  id: number
  name: string
}

interface DealFormProps {
  contacts: Contact[]
  onSave: (data: any) => void
  onCancel: () => void
}

const stages = ["Lead", "Contacted", "Proposal", "Won", "Lost"]

export function DealForm({ contacts, onSave, onCancel }: DealFormProps) {
  const [title, setTitle] = useState("")
  const [value, setValue] = useState("")
  const [stage, setStage] = useState("Lead")
  const [contactId, setContactId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !value) return
    onSave({
      title: title.trim(),
      value: parseFloat(value),
      stage,
      contactId: contactId ? parseInt(contactId) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Deal Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enterprise SaaS Package" required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="value">Value ($)</Label>
          <Input id="value" type="number" min="0" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder="25000" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stage">Stage</Label>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger id="stage"><SelectValue /></SelectTrigger>
            <SelectContent>
              {stages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact">Contact (optional)</Label>
        <Select value={contactId} onValueChange={setContactId}>
          <SelectTrigger id="contact"><SelectValue placeholder="Select a contact" /></SelectTrigger>
          <SelectContent>
            {contacts.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Create Deal</Button>
      </div>
    </form>
  )
}
