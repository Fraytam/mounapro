"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Download, Trash2, Clock, Star, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getMyReports, removeReport } from "@/lib/actions/reports"

interface Report {
  id: string
  name: string
  type: string
  createdAt: string
  starred: number
}

export default function SavedReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyReports().then((data) => {
      setReports(data as Report[])
      setLoading(false)
    })
  }, [])

  async function handleDelete(id: string) {
    await removeReport(id)
    setReports(reports.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Saved Reports</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Access and manage your saved calculations and reports</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <FileText className="h-12 w-12 mb-3 opacity-50" />
              <p className="font-medium">No saved reports yet</p>
              <p className="text-sm">Use a calculator and save your results</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {reports.map((report, i) => (
                <motion.div
                  key={report.id}
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
                      {report.starred === 1 && <Star className="h-3 w-3 fill-amber-400 text-amber-400" />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{report.type}</Badge>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => handleDelete(report.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
