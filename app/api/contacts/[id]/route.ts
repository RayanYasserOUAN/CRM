import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const data = await req.json()
  const contact = await db.contact.update({ where: { id: Number(id) }, data })
  return NextResponse.json({ contact })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await db.deal.updateMany({ where: { contactId: Number(id) }, data: { contactId: null } })
  await db.contact.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}
