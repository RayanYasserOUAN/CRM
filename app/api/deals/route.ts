import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/prisma"

export async function GET() {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const deals = await db.deal.findMany({
    orderBy: { updatedAt: "desc" },
    include: { contact: { select: { name: true } } },
  })
  const contacts = await db.contact.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  })

  const mapped = deals.map((d) => ({
    id: d.id,
    title: d.title,
    value: d.value,
    stage: d.stage,
    contactId: d.contactId,
    contactName: d.contact?.name || null,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
  }))

  return NextResponse.json({ deals: mapped, contacts })
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { title, value, stage, contactId } = await req.json()
    if (!title || value == null) {
      return NextResponse.json({ error: "Title and value required" }, { status: 400 })
    }
    const deal = await db.deal.create({
      data: { title, value: Number(value), stage: stage || "Lead", contactId: contactId || null },
    })
    return NextResponse.json({ deal }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 })
  }
}
