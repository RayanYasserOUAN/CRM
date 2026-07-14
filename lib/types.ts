export interface Contact {
  id: number
  name: string
  email: string
  phone: string
  company: string
  status: string
  createdAt: string
}

export interface Deal {
  id: number
  title: string
  value: number
  stage: string
  contactName?: string
}

export interface DashboardData {
  totalContacts: number
  dealsByStage: Record<string, { count: number; value: number }>
  totalPipelineValue: number
  wonValue: number
  recentDeals: { id: number; title: string; value: number; stage: string; updatedAt: string }[]
  revenueByMonth: { month: string; revenue: number }[]
}
