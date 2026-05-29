"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2, FileText, Star } from "lucide-react"
import { getAdminReports, removeReport } from "@/lib/actions/admin"

interface AdminReport {
  id: string
  userId: string
  type: string
  name: string
  starred: number
  createdAt: string
  userName?: string
}

export default function AdminReports() {
  const [reports, setReports] = useState<AdminReport[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const data = await getAdminReports()
    if (data) setReports(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this report?")) return
    await removeReport(id)
    setReports(reports.filter((r) => r.id !== id))
  }

  if (loading) return <div className="text-zinc-400 text-center py-20">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-zinc-400 mt-1">{reports.length} saved reports</p>
      </div>

      <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700 text-zinc-400">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium">Starred</th>
                <th className="text-left px-4 py-3 font-medium">Created</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, i) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-zinc-700/50 last:border-0 hover:bg-zinc-700/30"
                >
                  <td className="px-4 py-3 text-white font-medium">{report.name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-700 px-2 py-0.5 text-xs text-zinc-300">
                      <FileText className="h-3 w-3" />
                      {report.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-300">{report.userName || "Unknown"}</td>
                  <td className="px-4 py-3">
                    {report.starred ? <Star className="h-4 w-4 text-amber-400" /> : <span className="text-zinc-600">—</span>}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                      title="Delete report"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">No reports found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
