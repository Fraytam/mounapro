"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FileText, Calculator, Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

export default function ProposalPricingPage() {
  const [scope, setScope] = useState("")
  const [hours, setHours] = useState(20)
  const [rate, setRate] = useState(97)
  const [complexity, setComplexity] = useState(1.2)
  const [urgency, setUrgency] = useState(1.1)

  const basePrice = hours * rate
  const complexityMultiplier = basePrice * (complexity - 1)
  const urgencyMultiplier = basePrice * (urgency - 1)
  const totalPrice = basePrice + complexityMultiplier + urgencyMultiplier

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proposal Pricing</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Generate data-driven project proposals with confidence</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5" />
                Project Scope
              </CardTitle>
              <CardDescription>Describe the project and set your parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Project Description</Label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950"
                  placeholder="Describe the project scope, deliverables, and timeline..."
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Estimated Hours</Label>
                <Input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label>Your Hourly Rate ($)</Label>
                <Input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
              </div>
              <div className="grid gap-2">
                <Label>Complexity Multiplier</Label>
                <Input type="number" step={0.1} value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} />
                <p className="text-xs text-zinc-500">1.0 = simple, 1.5 = moderate, 2.0+ = complex</p>
              </div>
              <div className="grid gap-2">
                <Label>Urgency Multiplier</Label>
                <Input type="number" step={0.1} value={urgency} onChange={(e) => setUrgency(Number(e.target.value))} />
                <p className="text-xs text-zinc-500">1.0 = normal, 1.25 = rushed, 1.5+ = emergency</p>
              </div>
              <Button className="w-full gap-2">
                <Calculator className="h-4 w-4" /> Generate Proposal Price
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5" />
                Proposal Price
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Recommended Project Price</p>
                <p className="text-5xl font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(totalPrice)}</p>
                <Badge variant="secondary" className="mt-2">
                  {formatCurrency(totalPrice / hours)}/hr effective rate
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Base Price ({hours}h × {formatCurrency(rate)}/hr)</span>
                  <span className="font-mono">{formatCurrency(basePrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Complexity Adjustment ({(complexity - 1) * 100}%)</span>
                  <span className="font-mono">+{formatCurrency(complexityMultiplier)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Urgency Adjustment ({(urgency - 1) * 100}%)</span>
                  <span className="font-mono">+{formatCurrency(urgencyMultiplier)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-4">
                <p className="text-xs text-zinc-500 mb-1">Suggested Proposal Text</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 italic">
                  &ldquo;Based on the scope outlined above, I propose a fixed price of {formatCurrency(totalPrice)} for this project. This includes all work described, up to two rounds of revisions, and delivery within the agreed timeline.&rdquo;
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
