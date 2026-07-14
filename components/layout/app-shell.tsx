"use client"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: React.ReactNode
  userName: string
  onLogout: () => void
}

export function AppShell({ children, userName, onLogout }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Sidebar
        open={sidebarOpen}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        onClose={() => setSidebarOpen(false)}
      />
      <div className={cn(
        "transition-all duration-300",
        collapsed ? "lg:pl-[72px]" : "lg:pl-[260px]"
      )}>
        <Header onMenuClick={() => setSidebarOpen(true)} userName={userName} onLogout={onLogout} />
        <main id="main-content" className="p-3 sm:p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
