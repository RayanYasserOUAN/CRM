import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { apiHandler, unauthorized, badRequest } from "@/lib/api-helpers"
import { pick, DEAL_FIELDS } from "@/lib/utils"

export const GET = apiHandler(async () => {
  const auth = await getAuthUser()
  if (!auth) return unauthorized()

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
})

export const POST = apiHandler(async (req: NextRequest) => {
  const auth = await getAuthUser()
  if (!auth) return unauthorized()

  const body = await req.json()
  const data = pick(body, DEAL_FIELDS) as Record<string, unknown>

  if (!data.title || data.value == null) {
    return badRequest("Title and value required")
  }

  const deal = await db.deal.create({
    data: {
      title: data.title as string,
      value: Number(data.value),
      stage: (data.stage as string) || "Lead",
      contactId: data.contactId != null ? Number(data.contactId) : null,
    },
  })
  return NextResponse.json({ deal }, { status: 201 })
})
