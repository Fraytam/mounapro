"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { DollarSign, Globe, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCalculatorStore } from "@/store/calculator-store"
import { formatCurrency } from "@/lib/utils"

export default function FeeCalculatorPage() {
  const { feeInputs, feeOutputs, setFeeInputs, calculateFee } = useCalculatorStore()

  useEffect(() => {
    calculateFee()
  }, [feeInputs, calculateFee])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fee Calculator</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Calculate exactly what you&apos;ll earn after platform and processing fees</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5" />
                Fee Details
              </CardTitle>
              <CardDescription>Supports USA and Canada platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Invoice Amount</Label>
                <Input
                  type="number"
                  value={feeInputs.amount}
                  onChange={(e) => setFeeInputs({ amount: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Platform</Label>
                <Select value={feeInputs.platform} onValueChange={(v: any) => setFeeInputs({ platform: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upwork">Upwork (10%)</SelectItem>
                    <SelectItem value="fiverr">Fiverr (20%)</SelectItem>
                    <SelectItem value="freelancer">Freelancer (10%)</SelectItem>
                    <SelectItem value="paypal">PayPal (4.9% + $0.49)</SelectItem>
                    <SelectItem value="wise">Wise (0.6%)</SelectItem>
                    <SelectItem value="stripe">Stripe (2.9% + $0.49)</SelectItem>
                    <SelectItem value="custom">Custom (5%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Region</Label>
                <Select value={feeInputs.region} onValueChange={(v: any) => setFeeInputs({ region: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usa">USA</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Transaction Type</Label>
                <Select value={feeInputs.transactionType} onValueChange={(v: any) => setFeeInputs({ transactionType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {feeInputs.transactionType === "international" && (
                <div className="grid gap-2">
                  <Label>Conversion Fee (%)</Label>
                  <Input
                    type="number"
                    value={feeInputs.conversionFee}
                    onChange={(e) => setFeeInputs({ conversionFee: Number(e.target.value) })}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="instant"
                  checked={feeInputs.instantWithdrawal}
                  onChange={(e) => setFeeInputs({ instantWithdrawal: e.target.checked })}
                  className="h-4 w-4 rounded border-zinc-300"
                />
                <Label htmlFor="instant">Instant Withdrawal (1% fee)</Label>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {feeOutputs && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5" />
                  Fee Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">You Receive</p>
                  <p className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(feeOutputs.finalAmount)}</p>
                  <div className="mt-1 text-sm text-zinc-500">
                    of {formatCurrency(feeInputs.amount)} —{" "}
                    <Badge variant={feeOutputs.feePercent > 10 ? "destructive" : "secondary"}>
                      {feeOutputs.feePercent}% in fees
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Processing Fee</span>
                    <span className="font-mono">{formatCurrency(feeOutputs.processingFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Platform Fee</span>
                    <span className="font-mono">{formatCurrency(feeOutputs.platformFee)}</span>
                  </div>
                  {feeOutputs.hiddenFees > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Hidden Fees</span>
                      <span className="font-mono text-amber-600">{formatCurrency(feeOutputs.hiddenFees)}</span>
                    </div>
                  )}
                  {feeOutputs.conversionFeeAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Conversion Fee</span>
                      <span className="font-mono">{formatCurrency(feeOutputs.conversionFeeAmount)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total Fees</span>
                    <span className="text-red-600">{formatCurrency(feeOutputs.totalFees)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
