import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { apiHandler, unauthorized, badRequest } from "@/lib/api-helpers"
import { pick, CONTACT_FIELDS } from "@/lib/utils"

export const GET = apiHandler(async () => {
  const auth = await getAuthUser()
  if (!auth) return unauthorized()

  const contacts = await db.contact.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json({ contacts })
})

export const POST = apiHandler(async (req: NextRequest) => {
  const auth = await getAuthUser()
  if (!auth) return unauthorized()

  const body = await req.json()
  const data = pick(body, CONTACT_FIELDS) as Record<string, unknown>

  if (!data.name || !data.email) {
    return badRequest("Name and email required")
  }

  const contact = await db.contact.create({
    data: {
      name: data.name as string,
      email: data.email as string,
      phone: (data.phone as string) || null,
      company: (data.company as string) || null,
      status: (data.status as string) || "Active",
    },
  })
  return NextResponse.json({ contact }, { status: 201 })
})
