"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Mail, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { sendResetLink } from "@/lib/actions/auth"

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const form = new FormData(e.currentTarget)
    const result = await sendResetLink(form)
    if (result?.error) {
      setError(result.error)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <Link href="/" className="mx-auto mb-4 flex w-fit items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50">
              <TrendingUp className="h-4 w-4 text-white dark:text-zinc-900" />
            </div>
            <span className="text-lg font-bold">MounaPro</span>
          </Link>
          {!sent ? (
            <>
              <h1 className="text-2xl font-bold">Forgot password?</h1>
              <p className="mt-1 text-sm text-zinc-500">No worries, we&apos;ll send you reset instructions</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">Check your email</h1>
              <p className="mt-1 text-sm text-zinc-500">We sent a password reset link to your email</p>
            </>
          )}
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        ) : (
          <p className="text-center text-sm text-zinc-500">Check your inbox for the reset link.</p>
        )}

        <Link href="/login" className="mt-6 flex items-center justify-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>
      </div>
    </motion.div>
  )
}
