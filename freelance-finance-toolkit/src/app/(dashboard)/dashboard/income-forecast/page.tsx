"use client"

import { motion } from "framer-motion"
import { LineChart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { formatCurrency } from "@/lib/utils"
import {
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

export default function IncomeForecastPage() {
  const [monthlyAvg, setMonthlyAvg] = useState(12000)
  const [growthRate, setGrowthRate] = useState(10)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"))
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  const forecastData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date()
    month.setMonth(month.getMonth() + i)
    const income = monthlyAvg * Math.pow(1 + growthRate / 100, i / 12)
    return {
      name: month.toLocaleString("default", { month: "short" }),
      projected: Math.round(income),
      conservative: Math.round(income * 0.85),
    }
  })

  const totalProjected = forecastData.reduce((sum, d) => sum + d.projected, 0)
  const totalConservative = forecastData.reduce((sum, d) => sum + d.conservative, 0)

  const projectedColor = "#10B981"
  const conservativeColor = "#F59E0B"
  const gridColor = dark ? "rgba(255,255,255,0.08)" : "#e4e4e7"
  const axisColor = dark ? "#71717a" : "#a1a1aa"
  const tooltipBg = dark ? "#18181b" : "#ffffff"
  const tooltipBorder = dark ? "#3f3f46" : "#e4e4e7"
  const tooltipTextColor = dark ? "#f4f4f5" : "#18181b"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Income Forecast</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Project your freelance income for the next 12 months</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <LineChart className="h-5 w-5" />
                12-Month Projection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <RechartsLineChart data={forecastData}>
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
                  <Line type="monotone" dataKey="projected" stroke={projectedColor} strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="conservative" stroke={conservativeColor} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-center justify-center gap-6 text-xs text-zinc-500">
                <span className="flex items-center gap-2"><span className="h-2 w-4 rounded" style={{ backgroundColor: projectedColor }} /> Projected</span>
                <span className="flex items-center gap-2"><span className="h-0.5 w-4 border-t-2 border-dashed" style={{ borderColor: conservativeColor }} /> Conservative</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Assumptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Average Monthly Income</Label>
                <Input
                  type="number"
                  value={monthlyAvg}
                  onChange={(e) => setMonthlyAvg(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label>Expected Annual Growth (%)</Label>
                <Input
                  type="number"
                  value={growthRate}
                  onChange={(e) => setGrowthRate(Number(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">Projected 12-Month Income</p>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalProjected)}</p>
              </div>
              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500">Conservative Estimate (-15%)</p>
                <p className="text-xl font-bold text-zinc-600 dark:text-zinc-400">{formatCurrency(totalConservative)}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
