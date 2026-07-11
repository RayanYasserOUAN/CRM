import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { apiHandler, unauthorized, notFound } from "@/lib/api-helpers"

export const GET = apiHandler(async () => {
  const auth = await getAuthUser()
  if (!auth) return unauthorized()

  const user = await db.user.findUnique({ where: { id: auth.userId } })
  if (!user) return notFound("User not found")

  return NextResponse.json({ name: user.name, username: user.username })
})
