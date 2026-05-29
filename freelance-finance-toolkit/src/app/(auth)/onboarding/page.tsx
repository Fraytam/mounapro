"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from "next/navigation"

const steps = [
  { title: "Welcome", description: "Tell us about yourself" },
  { title: "Business", description: "Your freelance business" },
  { title: "Goals", description: "Set your financial goals" },
  { title: "Ready", description: "You're all set!" },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8 text-center">
        <Link href="/" className="mx-auto mb-4 flex w-fit items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50">
            <TrendingUp className="h-4 w-4 text-white dark:text-zinc-900" />
          </div>
          <span className="text-lg font-bold">MounaPro</span>
        </Link>
        <Progress value={(step + 1) * 25} className="mb-4" />
        <p className="text-xs text-zinc-500">Step {step + 1} of 4</p>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-xl"
      >
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Welcome to MounaPro</h2>
            <p className="text-sm text-zinc-500">Let&apos;s set up your account in under 2 minutes.</p>
            <div className="grid gap-2">
              <Label>What&apos;s your name?</Label>
              <Input placeholder="Jane Doe" />
            </div>
            <div className="grid gap-2">
              <Label>What best describes you?</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select one" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="freelancer">Freelancer</SelectItem>
                  <SelectItem value="consultant">Consultant</SelectItem>
                  <SelectItem value="agency">Agency Owner</SelectItem>
                  <SelectItem value="indie">Indie Hacker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Your Business</h2>
            <p className="text-sm text-zinc-500">Tell us about your freelance business.</p>
            <div className="grid gap-2">
              <Label>Annual revenue range</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-25k">$0 - $25,000</SelectItem>
                  <SelectItem value="25-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100-250k">$100,000 - $250,000</SelectItem>
                  <SelectItem value="250k+">$250,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Primary skill</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select skill" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Financial Goals</h2>
            <p className="text-sm text-zinc-500">Set your target income and we&apos;ll help you get there.</p>
            <div className="grid gap-2">
              <Label>Yearly income goal</Label>
              <Input type="number" placeholder="100000" />
            </div>
            <div className="grid gap-2">
              <Label>How many hours do you want to work per week?</Label>
              <Input type="number" placeholder="25" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold">You&apos;re All Set!</h2>
            <p className="text-sm text-zinc-500">Your dashboard is ready. Head over to explore your tools.</p>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>Continue</Button>
          ) : (
            <Button onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
