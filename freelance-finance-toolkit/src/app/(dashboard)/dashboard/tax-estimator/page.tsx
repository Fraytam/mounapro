"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Shield, TrendingDown, Info, Save, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useCalculatorStore } from "@/store/calculator-store"
import { formatCurrency } from "@/lib/utils"
import { saveCalculation } from "@/lib/actions/reports"

export default function TaxEstimatorPage() {
  const { taxInputs, taxOutputs, setTaxInputs, calculateTax } = useCalculatorStore()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    await saveCalculation("Tax Estimator", `Tax Estimate - ${new Date().toLocaleDateString()}`, JSON.stringify({ inputs: taxInputs, outputs: taxOutputs }))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  useEffect(() => {
    calculateTax()
  }, [taxInputs, calculateTax])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tax Estimator</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Estimate your US federal taxes and know how much to set aside each month</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Financial Information
              </CardTitle>
              <CardDescription>USA federal tax estimation based on 2024-2025 brackets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Filing Status</Label>
                <Select value={taxInputs.filingStatus} onValueChange={(v: any) => setTaxInputs({ filingStatus: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married Filing Jointly</SelectItem>
                    <SelectItem value="head">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Annual Gross Income ($)</Label>
                <Input
                  type="number"
                  value={taxInputs.annualIncome}
                  onChange={(e) => setTaxInputs({ annualIncome: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Business Expenses ($)</Label>
                <Input
                  type="number"
                  value={taxInputs.businessExpenses}
                  onChange={(e) => setTaxInputs({ businessExpenses: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Retirement Contributions ($)</Label>
                <Input
                  type="number"
                  value={taxInputs.retirementContributions}
                  onChange={(e) => setTaxInputs({ retirementContributions: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Health Insurance Premiums ($)</Label>
                <Input
                  type="number"
                  value={taxInputs.healthInsurance}
                  onChange={(e) => setTaxInputs({ healthInsurance: Number(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          {taxOutputs && taxInputs.annualIncome > 0 && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingDown className="h-5 w-5" />
                    Tax Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Estimated Total Tax</p>
                    <p className="text-5xl font-bold text-red-600 dark:text-red-400">{formatCurrency(taxOutputs.totalTax)}</p>
                    <div className="mt-1 text-sm text-zinc-500">
                      Effective rate: <Badge variant="secondary">{taxOutputs.effectiveTaxRate}%</Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Tax Breakdown */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Federal Income Tax</span>
                      <span className="font-mono">{formatCurrency(taxOutputs.estimatedFederalTax)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Self-Employment Tax (15.3%)</span>
                      <span className="font-mono">{formatCurrency(taxOutputs.selfEmploymentTax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm font-bold">
                      <span>Total Tax</span>
                      <span>{formatCurrency(taxOutputs.totalTax)}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Monthly Set Aside */}
                  <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                    <p className="text-xs text-zinc-500 mb-1">Monthly Set-Aside</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(taxOutputs.monthlySetAside)}</p>
                    <p className="text-xs text-zinc-500 mt-1">Set this aside each month to avoid a surprise at tax time</p>
                  </div>

                  {/* Income Breakdown */}
                  <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                    <p className="text-xs text-zinc-500 mb-1">Taxable Income</p>
                    <p className="text-lg font-semibold">{formatCurrency(taxOutputs.taxableIncome)}</p>
                    <div className="mt-2 space-y-1 text-xs text-zinc-500">
                      <p>Gross: {formatCurrency(taxOutputs.grossIncome)}</p>
                      <p>Deductions: -{formatCurrency(taxOutputs.grossIncome - taxOutputs.taxableIncome)}</p>
                    </div>
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
