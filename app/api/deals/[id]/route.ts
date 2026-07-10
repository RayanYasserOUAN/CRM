import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const data = await req.json()
  const deal = await db.deal.update({ where: { id: Number(id) }, data })
  return NextResponse.json({ deal })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  await db.deal.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}
