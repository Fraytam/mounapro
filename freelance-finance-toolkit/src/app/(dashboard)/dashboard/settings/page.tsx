"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, User, Bell, CreditCard, Palette, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "next-themes"
import { getSessionUser, updateProfile, saveSettings, loadSettings } from "@/lib/actions/auth"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [timezone, setTimezone] = useState("America/New_York")
  const [notifications, setNotifications] = useState({
    weeklySummary: true,
    taxReminders: true,
    newFeatures: false,
    feeAlerts: true,
  })
  const [compactSidebar, setCompactSidebar] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getSessionUser().then((u) => {
      if (u) { setName(u.name); setEmail(u.email) }
    })
    loadSettings().then((s) => {
      if (s) {
        if (s.timezone) setTimezone(s.timezone)
        if (s.notifications) setNotifications({ ...notifications, ...s.notifications })
        if (s.compactSidebar !== undefined) setCompactSidebar(s.compactSidebar)
        if (s.theme && setTheme) setTheme(s.theme)
      }
    })
  }, [])

  async function handleSaveProfile() {
    setSaving(true)
    await updateProfile(name)
    const settings = JSON.stringify({ timezone, notifications, compactSidebar, theme })
    await saveSettings(settings)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-8">
          <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Notifications</TabsTrigger>
          <TabsTrigger value="billing" className="gap-2"><CreditCard className="h-4 w-4" /> Billing</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" /> Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-md">
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input type="email" value={email} disabled className="opacity-60" />
              </div>
              <div className="grid gap-2">
                <Label>Timezone</Label>
                <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-md">
              {[
                { key: "weeklySummary", label: "Weekly income summary", desc: "Get a weekly email with your earnings overview" },
                { key: "taxReminders", label: "Tax reminders", desc: "Reminders for quarterly estimated tax payments" },
                { key: "newFeatures", label: "New features", desc: "Be the first to know about new calculators and tools" },
                { key: "feeAlerts", label: "Fee alerts", desc: "Get notified when platform fees change" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                  <Switch
                    checked={(notifications as any)[item.key]}
                    onCheckedChange={(v) => setNotifications({ ...notifications, [item.key]: v })}
                  />
                </div>
              ))}
              <Button onClick={handleSaveProfile} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Billing & Plan</CardTitle>
              <CardDescription>Manage your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-md">
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
                <p className="text-sm text-zinc-500">Current Plan</p>
                <p className="text-lg font-bold">Free Plan</p>
                <p className="text-xs text-zinc-500 mt-1">Basic calculators and up to 3 saved reports</p>
              </div>
              <Button disabled>Upgrade to Pro — $19/mo (Coming Soon)</Button>
              <Separator />
              <div className="space-y-3">
                <Label>Payment Method</Label>
                <p className="text-sm text-zinc-500">No payment method on file</p>
                <Button variant="outline" size="sm" disabled>Add Payment Method (Coming Soon)</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription>Customize your interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 max-w-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Dark Mode</p>
                  <p className="text-xs text-zinc-500">Toggle dark mode on/off</p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Compact Sidebar</p>
                  <p className="text-xs text-zinc-500">Use a narrower sidebar layout</p>
                </div>
                <Switch
                  checked={compactSidebar}
                  onCheckedChange={(v) => setCompactSidebar(v)}
                />
              </div>
              <Button onClick={handleSaveProfile} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
