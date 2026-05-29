"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Calculator, DollarSign, Target, Shield, LineChart, FileText, Settings, Bell, Search, Menu, X, TrendingUp, ChevronDown, LogOut, User, Lock,
} from "lucide-react"
import { getSessionUser } from "@/lib/actions/auth"
import { signOut } from "@/lib/actions/auth"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/rate-calculator", label: "Rate Calculator", icon: Calculator },
  { href: "/dashboard/fee-calculator", label: "Fee Calculator", icon: DollarSign },
  { href: "/dashboard/roi-calculator", label: "ROI Calculator", icon: Target },
  { href: "/dashboard/tax-estimator", label: "Tax Estimator", icon: Shield },
  { href: "/dashboard/income-forecast", label: "Income Forecast", icon: LineChart },
  { href: "/dashboard/proposal-pricing", label: "Proposal Pricing", icon: FileText },
  { href: "/dashboard/saved-reports", label: "Saved Reports", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string; plan: string } | null>(null)

  useEffect(() => {
    getSessionUser().then((u) => {
      if (u) setUser({ name: u.name, role: u.role, plan: u.plan })
    })
  }, [])

  async function handleSignOut() {
    await signOut()
    router.push("/")
  }

  const initials = user ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "U"

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-transform duration-300 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${mobileSidebarOpen ? "translate-x-0" : ""}`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50">
            <TrendingUp className="h-4 w-4 text-white dark:text-zinc-900" />
          </div>
          <span className="text-lg font-bold">MounaPro</span>
          <button onClick={() => { setSidebarOpen(false); setMobileSidebarOpen(false) }} className="ml-auto md:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {user?.role === "admin" && (
            <Link
              href="/admin"
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              <Lock className="h-4 w-4" />
              Admin Panel
            </Link>
          )}
          <Separator className="my-2" />
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-zinc-200 dark:border-zinc-800 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Loading..."}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.plan === "free" ? "Free Plan" : "Pro Plan"}</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 md:px-6">
          <button onClick={() => setMobileSidebarOpen(true)} className="md:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden md:block">
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input placeholder="Search calculators, reports..." className="pl-9 h-9" />
          </div>

          <div className="flex items-center gap-3">
            <button className="relative">
              <Bell className="h-5 w-5 text-zinc-500" />
            </button>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-xs">{initials}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-zinc-500" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-xl"
                  >
                    <Link href="/dashboard/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                    <Separator className="my-1" />
                    <button onClick={handleSignOut} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Badge variant="outline" className="hidden sm:inline-flex">{user?.plan === "free" ? "Free Plan" : "Pro"}</Badge>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
