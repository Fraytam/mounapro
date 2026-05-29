"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowUp, ArrowDown, DollarSign, Clock, Target, TrendingUp, Briefcase } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from "recharts"

const weeklyData = [
  { name: "Mon", earned: 1200, hours: 8 },
  { name: "Tue", earned: 1800, hours: 10 },
  { name: "Wed", earned: 900, hours: 6 },
  { name: "Thu", earned: 2100, hours: 11 },
  { name: "Fri", earned: 1500, hours: 7 },
  { name: "Sat", earned: 600, hours: 3 },
  { name: "Sun", earned: 0, hours: 0 },
]

const monthlyData = [
  { name: "Jan", income: 18000, expenses: 4000 },
  { name: "Feb", income: 22000, expenses: 4200 },
  { name: "Mar", income: 19000, expenses: 3800 },
  { name: "Apr", income: 25000, expenses: 4500 },
  { name: "May", income: 21000, expenses: 4100 },
  { name: "Jun", income: 28000, expenses: 4800 },
]

export default function DashboardOverview() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const lineColor = "#10B981"
  const barColor = "#3B82F6"
  const gridColor = dark ? "rgba(255,255,255,0.08)" : "#e4e4e7"
  const axisColor = dark ? "#71717a" : "#a1a1aa"
  const tooltipBg = dark ? "#18181b" : "#ffffff"
  const tooltipBorder = dark ? "#3f3f46" : "#e4e4e7"
  const tooltipTextColor = dark ? "#f4f4f5" : "#18181b"

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Your freelance financial snapshot</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">Export Report</Button>
          <Button size="sm">New Calculation</Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { label: "Projected Annual Income", value: "$147,500", change: "+12.3%", icon: DollarSign, up: true },
          { label: "Avg. Hourly Rate", value: "$97/hr", change: "+8.1%", icon: Clock, up: true },
          { label: "Tax Estimate", value: "$38,742", change: "+3.2%", icon: Target, up: false },
          { label: "Monthly Goal Progress", value: "72%", change: "of $12,500", icon: TrendingUp, up: true },
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
                  {stat.up ? (
                    <ArrowUp className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={stat.up ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                    {stat.change}
                  </span>
                  <span className="text-zinc-400">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Income Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={lineColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={12} tickLine={false} />
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
                <Area type="monotone" dataKey="income" stroke={lineColor} fill="url(#incomeGrad)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Billable Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={12} tickLine={false} />
                <YAxis stroke={axisColor} fontSize={12} tickLine={false} />
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
                <Bar dataKey="earned" fill={barColor} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Rate Alert</span>
            </div>
            <p className="text-sm leading-relaxed opacity-90">
              Your effective hourly rate ($72/hr) is below your target ($97/hr). Consider increasing your project pricing.
            </p>
            <Link href="/dashboard/rate-calculator">
              <Button variant="secondary" size="sm" className="mt-3 bg-white/20 text-white hover:bg-white/30 dark:bg-zinc-900/20 dark:text-zinc-900">
                Optimize Now
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Fee Saving</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              You paid $847 in platform fees this month. Switching to direct payments could save you $320.
            </p>
            <Link href="/dashboard/fee-calculator">
              <Button variant="outline" size="sm" className="mt-3">Compare Platforms</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">Tax Tip</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Set aside $3,228/month for taxes. You&apos;re on track to owe ~$38.7K this year.
            </p>
            <Link href="/dashboard/tax-estimator">
              <Button variant="outline" size="sm" className="mt-3">View Details</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
