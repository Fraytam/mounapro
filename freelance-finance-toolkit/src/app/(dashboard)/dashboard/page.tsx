"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUp, ArrowDown, FileText, Calculator, Target, Calendar, TrendingUp, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getMyReports } from "@/lib/actions/reports"
import { getSessionUser } from "@/lib/actions/auth"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts"

interface Report {
  id: string
  name: string
  type: string
  createdAt: string
}

export default function DashboardOverview() {
  const [dark, setDark] = useState(false)
  const [reports, setReports] = useState<Report[]>([])
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    Promise.all([getMyReports(), getSessionUser()]).then(([r, u]) => {
      setReports(r as Report[])
      if (u) setUserName(u.name)
      setLoading(false)
    })
    return () => observer.disconnect()
  }, [])

  const lineColor = "#10B981"
  const barColor = "#3B82F6"
  const gridColor = dark ? "rgba(255,255,255,0.08)" : "#e4e4e7"
  const axisColor = dark ? "#71717a" : "#a1a1aa"
  const tooltipBg = dark ? "#18181b" : "#ffffff"
  const tooltipBorder = dark ? "#3f3f46" : "#e4e4e7"
  const tooltipTextColor = dark ? "#f4f4f5" : "#18181b"

  const typeCounts = reports.reduce<Record<string, number>>((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(typeCounts).map(([type, count]) => ({ name: type.split(" ")[0], count }))

  const timelineData = reports.length > 0
    ? [...new Set(reports.map((r) => new Date(r.createdAt).toLocaleDateString("en-US", { month: "short" })))].map((m) => ({
        name: m,
        reports: reports.filter((r) => new Date(r.createdAt).toLocaleDateString("en-US", { month: "short" }) === m).length,
      }))
    : []

  const latestReport = reports[0]
  const typesUsed = Object.keys(typeCounts).length

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {loading ? "Loading..." : `Welcome back, ${userName}`}
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: "Saved Reports", value: String(reports.length), change: "total calculations", icon: FileText, up: true },
          { label: "Calculator Types", value: String(typesUsed), change: "tools used", icon: Calculator, up: true },
          { label: "Latest Report", value: latestReport ? new Date(latestReport.createdAt).toLocaleDateString() : "N/A", change: latestReport?.type || "", icon: Calendar, up: true },
          { label: "Account Plan", value: "Free", change: "upgrade for more", icon: TrendingUp, up: false },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <span className="text-zinc-400">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reports by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[280px] text-zinc-400 text-sm">
                Save a report to see your breakdown
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} />
                  <YAxis stroke={axisColor} fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: `1px solid ${tooltipBorder}`,
                      background: tooltipBg,
                      color: tooltipTextColor,
                      fontSize: "13px",
                    }}
                    labelStyle={{ color: dark ? "#a1a1aa" : "#71717a", fontWeight: 500 }}
                  />
                  <Bar dataKey="count" fill={barColor} radius={[6, 6, 0, 0]} name="Reports" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reports Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {timelineData.length === 0 ? (
              <div className="flex items-center justify-center h-[280px] text-zinc-400 text-sm">
                Save a report to see your timeline
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} />
                  <YAxis stroke={axisColor} fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: `1px solid ${tooltipBorder}`,
                      background: tooltipBg,
                      color: tooltipTextColor,
                      fontSize: "13px",
                    }}
                    labelStyle={{ color: dark ? "#a1a1aa" : "#71717a", fontWeight: 500 }}
                  />
                  <Area type="monotone" dataKey="reports" stroke={lineColor} fill="url(#timelineGrad)" strokeWidth={2.5} name="Reports" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Rate Calculator</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              Find your ideal hourly rate based on income goals, expenses, and market rates.
            </p>
            <Link href="/dashboard/rate-calculator">
              <Button variant="secondary" size="sm" className="mt-3 bg-white/20 text-white hover:bg-white/30 dark:bg-zinc-900/20 dark:text-zinc-900">
                Calculate Now
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">ROI Analyzer</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Evaluate contracts before you accept. Know your effective hourly rate and risk score.
            </p>
            <Link href="/dashboard/roi-calculator">
              <Button variant="outline" size="sm" className="mt-3">Analyze Contract</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">Tax Estimator</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Estimate your taxes and know exactly how much to set aside each month.
            </p>
            <Link href="/dashboard/tax-estimator">
              <Button variant="outline" size="sm" className="mt-3">Estimate Taxes</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
