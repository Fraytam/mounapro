"use client"

import { motion } from "framer-motion"
import { FileText, Download, Trash2, Clock, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const reports = [
  { name: "Rate Analysis - Q1 2026", type: "Rate Calculator", date: "2026-03-15", starred: true },
  { name: "Upwork Fee Analysis", type: "Fee Calculator", date: "2026-03-10", starred: false },
  { name: "Website Redesign ROI", type: "ROI Calculator", date: "2026-03-08", starred: true },
  { name: "Tax Estimate 2026", type: "Tax Estimator", date: "2026-03-05", starred: false },
  { name: "Income Forecast - Annual", type: "Income Forecast", date: "2026-03-01", starred: false },
]

export default function SavedReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Reports</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Access and manage your saved calculations and reports</p>
        </div>
        <Button variant="outline" size="sm">Export All</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {reports.map((report, i) => (
              <motion.div
                key={report.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{report.name}</p>
                    {report.starred && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{report.type}</Badge>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {report.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
