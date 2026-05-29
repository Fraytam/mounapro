"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import crypto from "crypto"
import {
  createUser,
  findUserByEmail,
  getUserPasswordHash,
  createSession,
  findSession,
  deleteUserSessions,
  deleteSession,
  findUserById,
  updateUserProfile,
  saveUserSettings,
  findUserSettings,
  hashPw,
  verifyPw,
} from "@/lib/db"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string

  if (!email || !password || !name) return { error: "All fields are required" }
  if (password.length < 6) return { error: "Password must be at least 6 characters" }

  const existing = await findUserByEmail(email)
  if (existing) return { error: "An account with this email already exists" }

  const passwordHash = hashPw(password)
  const user = await createUser(email, name, passwordHash)
  const session = await createSession(user.id)

  const cookieStore = await cookies()
  cookieStore.set("session_id", session.id, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    expires: new Date(session.expiresAt),
    path: "/",
  })

  revalidatePath("/", "layout")
  redirect("/onboarding")
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) return { error: "Email and password are required" }

  const storedHash = await getUserPasswordHash(email)
  if (!storedHash || !verifyPw(password, storedHash)) {
    return { error: "Invalid email or password" }
  }

  const user = await findUserByEmail(email)
  if (!user) return { error: "Invalid email or password" }

  await deleteUserSessions(user.id)
  const session = await createSession(user.id)

  const cookieStore = await cookies()
  cookieStore.set("session_id", session.id, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    expires: new Date(session.expiresAt),
    path: "/",
  })

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signInWithGoogle() {
  return { error: "Google sign-in requires Supabase configuration. Use email/password instead." }
}

export async function signOut() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session_id")?.value
  if (sessionId) {
    await deleteSession(sessionId)
  }
  cookieStore.delete("session_id")
  revalidatePath("/", "layout")
  redirect("/")
}

export async function sendResetLink(formData: FormData) {
  const email = formData.get("email") as string
  const user = await findUserByEmail(email)
  if (!user) return { error: "No account found with this email" }
  return { success: true, message: "Password reset is not available in local mode. Contact support." }
}

export async function getSessionUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("session_id")?.value
  if (!sessionId) return null
  const session = await findSession(sessionId)
  if (!session) return null
  return findUserById(session.userId)
}

export async function updateProfile(name: string) {
  const user = await getSessionUser()
  if (!user) return { error: "Not authenticated" }
  await updateUserProfile(user.id, name)
  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function saveSettings(settings: string) {
  const user = await getSessionUser()
  if (!user) return { error: "Not authenticated" }
  await saveUserSettings(user.id, settings)
  revalidatePath("/dashboard/settings")
  return { success: true }
}

export async function loadSettings() {
  const user = await getSessionUser()
  if (!user) return null
  const s = await findUserSettings(user.id)
  return s ? JSON.parse(s) : null
}
