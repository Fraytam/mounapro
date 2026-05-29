"use client"

import { useEffect } from "react"
import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()

  return (
    <div className="w-full max-w-lg text-center space-y-6">
      <Link href="/" className="mx-auto mb-4 flex w-fit items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50">
          <TrendingUp className="h-4 w-4 text-white dark:text-zinc-900" />
        </div>
        <span className="text-lg font-bold">MounaPro</span>
      </Link>
      <h1 className="text-2xl font-bold">Welcome to MounaPro!</h1>
      <p className="text-zinc-500">Your dashboard is ready. Head over to explore your financial tools.</p>
      <Button onClick={() => router.push("/dashboard")} size="lg" className="mt-4">
        Go to Dashboard
      </Button>
    </div>
  )
}
