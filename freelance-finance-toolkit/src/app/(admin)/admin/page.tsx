"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, FileText, Shield, UserCheck } from "lucide-react"
import { getAdminStats } from "@/lib/actions/admin"

interface Stats {
  totalUsers: number
  totalReports: number
  adminCount: number
  planCounts: { free: number; pro: number; enterprise: number }
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAdminStats().then((data) => {
      if (data) setStats(data)
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="text-zinc-400 text-center py-20">Loading...</div>
  if (!stats) return <div className="text-red-400 text-center py-20">Unauthorized</div>

  const cards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "bg-blue-500" },
    { label: "Admins", value: stats.adminCount, icon: Shield, color: "bg-purple-500" },
    { label: "Reports Saved", value: stats.totalReports, icon: FileText, color: "bg-emerald-500" },
    { label: "Free / Pro / Enterprise", value: `${stats.planCounts.free} / ${stats.planCounts.pro} / ${stats.planCounts.enterprise}`, icon: UserCheck, color: "bg-amber-500" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-zinc-400 mt-1">Manage your MounaPro platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-zinc-700 bg-zinc-800/50 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`rounded-lg ${card.color} p-2`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-zinc-400 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
