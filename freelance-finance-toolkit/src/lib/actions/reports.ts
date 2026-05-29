"use server"

import { revalidatePath } from "next/cache"
import { getSessionUser } from "./auth"
import { saveReport, findUserReports, deleteUserReport } from "@/lib/db"

export async function saveCalculation(type: string, name: string, data: string) {
  const user = await getSessionUser()
  if (!user) return { error: "Not authenticated" }
  await saveReport(user.id, type, name, data)
  revalidatePath("/dashboard/saved-reports")
  return { success: true }
}

export async function getMyReports() {
  const user = await getSessionUser()
  if (!user) return []
  return findUserReports(user.id)
}

export async function removeReport(reportId: string) {
  const user = await getSessionUser()
  if (!user) return { error: "Not authenticated" }
  await deleteUserReport(reportId, user.id)
  revalidatePath("/dashboard/saved-reports")
  return { success: true }
}
