"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Trash2, Shield, User } from "lucide-react"
import { getAdminUsers, removeUser, changeUserRole } from "@/lib/actions/admin"

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  plan: string
  createdAt: string
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const data = await getAdminUsers()
    if (data) setUsers(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this user and all their data?")) return
    await removeUser(id)
    setUsers(users.filter((u) => u.id !== id))
  }

  async function handleToggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin"
    await changeUserRole(id, newRole)
    setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)))
  }

  if (loading) return <div className="text-zinc-400 text-center py-20">Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <p className="text-zinc-400 mt-1">{users.length} registered users</p>
      </div>

      <div className="rounded-xl border border-zinc-700 bg-zinc-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-700 text-zinc-400">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Plan</th>
                <th className="text-left px-4 py-3 font-medium">Joined</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-zinc-700/50 last:border-0 hover:bg-zinc-700/30"
                >
                  <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-zinc-300">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === "admin" ? "bg-purple-500/20 text-purple-300" : "bg-zinc-700 text-zinc-300"
                    }`}>
                      {user.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-300 capitalize">{user.plan}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(user.id, user.role)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                        title={user.role === "admin" ? "Demote to user" : "Promote to admin"}
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-zinc-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
