import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { apiHandler, unauthorized } from "@/lib/api-helpers"
import { pick, DEAL_FIELDS } from "@/lib/utils"

export const PATCH = apiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await getAuthUser()
  if (!auth) return unauthorized()

  const { id } = await params
  const body = await req.json()

  // Whitelist: only allow fields defined in DEAL_FIELDS
  const data = pick(body, DEAL_FIELDS)

  const deal = await db.deal.update({
    where: { id: Number(id) },
    data: data as Record<string, unknown>,
  })
  return NextResponse.json({ deal })
})

export const DELETE = apiHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const auth = await getAuthUser()
  if (!auth) return unauthorized()

  const { id } = await params
  await db.deal.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
})
