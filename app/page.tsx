"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, TrendingUp, DollarSign, Activity } from "lucide-react"
import { AppShell } from "@/components/layout/app-shell"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"

interface DashboardData {
  totalContacts: number
  dealsByStage: Record<string, { count: number; value: number }>
  totalPipelineValue: number
  wonValue: number
  recentDeals: { id: number; title: string; value: number; stage: string; updatedAt: string }[]
  revenueByMonth: { month: string; revenue: number }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("User")
  const [data, setData] = useState<DashboardData | null>(null)

  const fetchData = async () => {
    try {
      const [dashRes, meRes] = await Promise.all([
        fetch("/api/dashboard"),
        fetch("/api/auth/me"),
      ])
      if (dashRes.status === 401) { router.push("/login"); return }
      if (meRes.ok) {
        const meData = await meRes.json()
        setUserName(meData.name)
      }
      const json = await dashRes.json()
      setData(json)
    } catch {}
  }

  useEffect(() => { fetchData() }, [])

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" })
    router.push("/login")
    router.refresh()
  }

  if (!data) return null

  const stageColors: Record<string, "primary" | "success" | "warning" | "destructive" | "info"> = {
    Lead: "info", Contacted: "primary", Proposal: "warning", Won: "success", Lost: "destructive",
  }

  return (
    <AppShell userName={userName} onLogout={handleLogout}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your pipeline</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total Contacts" value={String(data.totalContacts)} icon={<Users className="h-5 w-5" />} />
          <StatsCard title="Pipeline Value" value={formatCurrency(data.totalPipelineValue)} icon={<DollarSign className="h-5 w-5" />} />
          <StatsCard title="Won Deals" value={formatCurrency(data.wonValue)} icon={<Activity className="h-5 w-5" />} />
          <StatsCard title="Active Deals" value={String(data.dealsByStage.Lead?.count + data.dealsByStage.Contacted?.count + data.dealsByStage.Proposal?.count || 0)} icon={<TrendingUp className="h-5 w-5" />} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart data={data.revenueByMonth} />

          <Card>
            <CardHeader>
              <CardTitle>Deals by Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(data.dealsByStage).map(([stage, info]) => (
                  <div key={stage} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={stageColors[stage] || "default"}>{stage}</Badge>
                      <span className="text-xs text-slate-400">{info.count} deals</span>
                    </div>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {formatCurrency(info.value)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Deals</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.recentDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between px-6 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-900 dark:text-white">{deal.title}</span>
                    <Badge variant={stageColors[deal.stage] || "default"} className="text-[10px]">{deal.stage}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{formatCurrency(deal.value)}</span>
                    <span className="text-xs text-slate-400 hidden sm:block">{formatDate(deal.updatedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
