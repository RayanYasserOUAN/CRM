import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/prisma"
import { signToken } from "@/lib/auth"
import { apiHandler, badRequest } from "@/lib/api-helpers"
import { rateLimit } from "@/lib/rate-limit"

export const POST = apiHandler(async (req: NextRequest) => {
  // Rate limiting: keyed by IP address
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  const limiter = rateLimit(`login:${ip}`, 5, 60_000) // 5 attempts per minute per IP

  if (!limiter.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((limiter.resetAt - Date.now()) / 1000)),
        },
      },
    )
  }

  const { username, password } = await req.json()
  if (!username || !password) {
    return badRequest("Username and password required")
  }

  const user = await db.user.findUnique({ where: { username } })
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = signToken({ userId: user.id, username: user.username })
  const response = NextResponse.json({ success: true, name: user.name })
  response.cookies.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
})

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return response
}
