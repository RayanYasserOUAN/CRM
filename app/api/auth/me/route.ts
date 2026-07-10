import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/prisma"

export async function GET() {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await db.user.findUnique({ where: { id: auth.userId } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  return NextResponse.json({ name: user.name, username: user.username })
}
