import { NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/prisma"

export async function GET() {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const contacts = await db.contact.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json({ contacts })
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser()
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { name, email, phone, company, status } = await req.json()
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email required" }, { status: 400 })
    }
    const contact = await db.contact.create({
      data: { name, email, phone: phone || null, company: company || null, status: status || "Active" },
    })
    return NextResponse.json({ contact }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create contact" }, { status: 500 })
  }
}
