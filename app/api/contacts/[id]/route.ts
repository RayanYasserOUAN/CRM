import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { apiHandler, unauthorized } from "@/lib/api-helpers"
import { pick, CONTACT_FIELDS } from "@/lib/utils"

export const PATCH = apiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await getAuthUser()
  if (!auth) return unauthorized()

  const { id } = await params
  const body = await req.json()

  // Whitelist: only allow fields defined in CONTACT_FIELDS
  // This prevents clients from setting `id`, `createdAt`, `updatedAt`, etc.
  const data = pick(body, CONTACT_FIELDS)

  const contact = await db.contact.update({
    where: { id: Number(id) },
    data: data as Record<string, unknown>,
  })
  return NextResponse.json({ contact })
})

export const DELETE = apiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await getAuthUser()
  if (!auth) return unauthorized()

  const { id } = await params

  // Disconnect deals before deleting the contact
  await db.deal.updateMany({
    where: { contactId: Number(id) },
    data: { contactId: null },
  })
  await db.contact.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
})
