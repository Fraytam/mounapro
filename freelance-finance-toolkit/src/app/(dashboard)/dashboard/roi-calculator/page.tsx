"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Target, TrendingUp, AlertTriangle, CheckCircle, Info, Save, Check } from "lucide-react"
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

export default function ROICalculatorPage() {
  const { roiInputs, roiOutputs, setRoiInputs, calculateROI } = useCalculatorStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    await saveCalculation("ROI Calculator", `ROI Analysis - ${new Date().toLocaleDateString()}`, JSON.stringify({ inputs: roiInputs, outputs: roiOutputs }))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  useEffect(() => {
    calculateROI()
  }, [roiInputs, calculateROI])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">ROI Calculator</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Evaluate contracts before you commit. Know your true effective hourly rate.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5" />
                Contract Details
              </CardTitle>
              <CardDescription>Enter the full scope of the project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Contract Value ($)</Label>
                <Input
                  type="number"
                  value={roiInputs.contractValue}
                  onChange={(e) => setRoiInputs({ contractValue: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Estimated Work Hours</Label>
                <Input
                  type="number"
                  value={roiInputs.estimatedHours}
                  onChange={(e) => setRoiInputs({ estimatedHours: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Meeting Hours</Label>
                <Input
                  type="number"
                  value={roiInputs.meetingHours}
                  onChange={(e) => setRoiInputs({ meetingHours: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Estimated Revision Hours</Label>
                <Input
                  type="number"
                  value={roiInputs.revisionHours}
                  onChange={(e) => setRoiInputs({ revisionHours: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Overhead (%)</Label>
                <Input
                  type="number"
                  value={roiInputs.overheadPercent}
                  onChange={(e) => setRoiInputs({ overheadPercent: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Tool Costs ($)</Label>
                <Input
                  type="number"
                  value={roiInputs.toolCosts}
                  onChange={(e) => setRoiInputs({ toolCosts: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Delay Risk (%)</Label>
                <Input
                  type="number"
                  value={roiInputs.delayRisk}
                  onChange={(e) => setRoiInputs({ delayRisk: Number(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          {roiOutputs && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5" />
                    ROI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Effective Hourly Rate</p>
                    <p className={`text-5xl font-bold ${
                      roiOutputs.effectiveHourlyRate >= 50 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                    }`}>
                      {formatCurrency(roiOutputs.effectiveHourlyRate)}/hr
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                      <p className="text-xs text-zinc-500">Real Profit</p>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(roiOutputs.realProfit)}</p>
                    </div>
                    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                      <p className="text-xs text-zinc-500">Risk Score</p>
                      <p className={`text-xl font-bold ${
                        roiOutputs.riskLevel === "low" ? "text-emerald-600 dark:text-emerald-400" : roiOutputs.riskLevel === "medium" ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        {roiOutputs.riskScore}/100
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Risk Level</span>
                      <Badge variant={roiOutputs.riskLevel === "low" ? "success" : roiOutputs.riskLevel === "medium" ? "warning" : "destructive"}>
                        {roiOutputs.riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <Progress
                      value={roiOutputs.riskScore}
                      className={`h-2 ${
                        roiOutputs.riskLevel === "low" ? "bg-emerald-100" : roiOutputs.riskLevel === "medium" ? "bg-amber-100" : "bg-red-100"
                      }`}
                    />
                  </div>

                  <Separator />

                  <div className={`flex items-start gap-3 rounded-lg p-4 ${
                    roiOutputs.riskLevel === "low"
                      ? "bg-emerald-50 dark:bg-emerald-900/20"
                      : roiOutputs.riskLevel === "medium"
                      ? "bg-amber-50 dark:bg-amber-900/20"
                      : "bg-red-50 dark:bg-red-900/20"
                  }`}>
                    {roiOutputs.riskLevel === "low" ? (
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm text-zinc-800 dark:text-zinc-200">{roiOutputs.recommendation}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : saved ? <><Check className="h-4 w-4" /> Saved</> : <><Save className="h-4 w-4" /> Save Report</>}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
