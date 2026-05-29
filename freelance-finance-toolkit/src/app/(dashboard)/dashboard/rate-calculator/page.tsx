"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Calculator, TrendingUp, AlertTriangle, DollarSign, Save, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useCalculatorStore } from "@/store/calculator-store"
import { formatCurrency } from "@/lib/utils"
import { saveCalculation } from "@/lib/actions/reports"

export default function RateCalculatorPage() {
  const { rateInputs, rateOutputs, setRateInputs, calculateRate } = useCalculatorStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    await saveCalculation("Rate Calculator", `Rate Analysis - ${new Date().toLocaleDateString()}`, JSON.stringify({ inputs: rateInputs, outputs: rateOutputs }))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  useEffect(() => {
    calculateRate()
  }, [rateInputs, calculateRate])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rate Calculator</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Find your ideal hourly rate based on your financial goals</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Inputs */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calculator className="h-5 w-5" />
                Your Financial Details
              </CardTitle>
              <CardDescription>Enter your income goals and expenses to calculate your rate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Yearly Income Goal</Label>
                <Input
                  type="number"
                  value={rateInputs.yearlyIncomeGoal}
                  onChange={(e) => setRateInputs({ yearlyIncomeGoal: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Monthly Business Expenses</Label>
                <Input
                  type="number"
                  value={rateInputs.monthlyExpenses}
                  onChange={(e) => setRateInputs({ monthlyExpenses: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  value={rateInputs.taxRate}
                  onChange={(e) => setRateInputs({ taxRate: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Billable Hours Per Week</Label>
                <Input
                  type="number"
                  value={rateInputs.billableHoursPerWeek}
                  onChange={(e) => setRateInputs({ billableHoursPerWeek: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Vacation Weeks Per Year</Label>
                <Input
                  type="number"
                  value={rateInputs.vacationWeeks}
                  onChange={(e) => setRateInputs({ vacationWeeks: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Monthly Software Costs</Label>
                <Input
                  type="number"
                  value={rateInputs.softwareCosts}
                  onChange={(e) => setRateInputs({ softwareCosts: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Emergency Buffer (%)</Label>
                <Input
                  type="number"
                  value={rateInputs.emergencyBuffer}
                  onChange={(e) => setRateInputs({ emergencyBuffer: Number(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Outputs */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          {rateOutputs && rateInputs.yearlyIncomeGoal > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    Your Recommended Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Minimum Hourly Rate</p>
                    <p className="text-3xl font-bold text-zinc-500">{formatCurrency(rateOutputs.minimumHourlyRate)}/hr</p>
                  </div>
                  <Separator />
                  <div className="text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Recommended Hourly Rate</p>
                    <p className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(rateOutputs.recommendedHourlyRate)}/hr</p>
                  </div>
                  <Separator />

                  {/* Project Pricing */}
                  <div>
                    <h4 className="mb-3 text-sm font-medium">Ideal Project Pricing</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3 text-center">
                        <p className="text-xs text-zinc-500">4 hours</p>
                        <p className="text-lg font-bold">{formatCurrency(rateOutputs.idealProjectPrice4h)}</p>
                      </div>
                      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3 text-center">
                        <p className="text-xs text-zinc-500">8 hours</p>
                        <p className="text-lg font-bold">{formatCurrency(rateOutputs.idealProjectPrice8h)}</p>
                      </div>
                      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-3 text-center">
                        <p className="text-xs text-zinc-500">40 hours</p>
                        <p className="text-lg font-bold">{formatCurrency(rateOutputs.idealProjectPrice40h)}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Projections */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                      <p className="text-xs text-zinc-500">Monthly Projection</p>
                      <p className="text-xl font-bold">{formatCurrency(rateOutputs.monthlyProjection)}</p>
                    </div>
                    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                      <p className="text-xs text-zinc-500">Yearly Projection</p>
                      <p className="text-xl font-bold">{formatCurrency(rateOutputs.yearlyProjection)}</p>
                    </div>
                  </div>

                  {/* Burnout Warning */}
                  {rateOutputs.burnoutWarning && (
                    <div className="flex items-start gap-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Burnout Risk Detected</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400">
                          Your billable hours are high or vacation time is low. Consider adjusting for better work-life balance.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? "Saving..." : saved ? <><Check className="h-4 w-4" /> Saved</> : <><Save className="h-4 w-4" /> Save Report</>}
              </Button>

              {/* Progress toward goal */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">Progress Toward Income Goal</p>
                    <span className="text-sm text-zinc-500">
                      {formatCurrency(rateOutputs.yearlyProjection)} / {formatCurrency(rateInputs.yearlyIncomeGoal)}
                    </span>
                  </div>
                  <Progress value={Math.min(100, (rateOutputs.yearlyProjection / rateInputs.yearlyIncomeGoal) * 100)} />
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
