import { NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { apiHandler, unauthorized } from "@/lib/api-helpers"

export const GET = apiHandler(async () => {
  const auth = await getAuthUser()
  if (!auth) return unauthorized()

  const contacts = await db.contact.findMany()
  const deals = await db.deal.findMany({ orderBy: { updatedAt: "desc" } })

  const totalContacts = contacts.length

  const stageOrder = ["Lead", "Contacted", "Proposal", "Won", "Lost"]
  const dealsByStage = stageOrder.reduce((acc, stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage)
    acc[stage] = {
      count: stageDeals.length,
      value: stageDeals.reduce((sum, d) => sum + d.value, 0),
    }
    return acc
  }, {} as Record<string, { count: number; value: number }>)

  const totalPipelineValue = deals.reduce((sum, d) => sum + d.value, 0)
  const wonValue = deals.filter((d) => d.stage === "Won").reduce((sum, d) => sum + d.value, 0)

  const recentDeals = deals.slice(0, 5).map((d) => ({
    id: d.id,
    title: d.title,
    value: d.value,
    stage: d.stage,
    updatedAt: d.updatedAt.toISOString(),
  }))

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const revenueByMonth = monthNames.map((month, i) => {
    const monthDeals = deals.filter((d) => {
      const date = new Date(d.updatedAt)
      return date.getMonth() === i && (d.stage === "Won" || d.stage === "Proposal")
    })
    return {
      month,
      revenue: monthDeals.reduce((sum, d) => sum + d.value, 0),
    }
  })

  return NextResponse.json({
    totalContacts,
    dealsByStage,
    totalPipelineValue,
    wonValue,
    recentDeals,
    revenueByMonth,
  })
})
