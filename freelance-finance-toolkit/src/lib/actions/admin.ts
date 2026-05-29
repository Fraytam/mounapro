"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { findSession, findUserById, getStats, findAllUsers, findAllReports, deleteUserById, deleteReport, setUserRole } from "@/lib/db"

async function requireAdmin() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session_id")?.value
  if (!sessionId) return null
  const session = await findSession(sessionId)
  if (!session) return null
  const user = await findUserById(session.userId)
  if (!user || user.role !== "admin") return null
  return user
}

export async function getAdminStats() {
  const admin = await requireAdmin()
  if (!admin) return null
  return getStats()
}

export async function getAdminUsers() {
  const admin = await requireAdmin()
  if (!admin) return null
  return findAllUsers()
}

export async function getAdminReports() {
  const admin = await requireAdmin()
  if (!admin) return null
  return findAllReports()
}

export async function removeUser(userId: string) {
  const admin = await requireAdmin()
  if (!admin) return { error: "Unauthorized" }
  await deleteUserById(userId)
  revalidatePath("/admin/users")
  return { success: true }
}

export async function removeReport(reportId: string) {
  const admin = await requireAdmin()
  if (!admin) return { error: "Unauthorized" }
  await deleteReport(reportId)
  revalidatePath("/admin/reports")
  return { success: true }
}

export async function changeUserRole(userId: string, role: string) {
  const admin = await requireAdmin()
  if (!admin) return { error: "Unauthorized" }
  await setUserRole(userId, role)
  revalidatePath("/admin/users")
  return { success: true }
}
