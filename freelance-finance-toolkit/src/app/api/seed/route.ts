import { NextResponse } from "next/server"
import crypto from "crypto"
import { createUser, findUserByEmail, findUserById, hashPw } from "@/lib/db"

export async function GET() {
  const admin = await findUserByEmail("admin@freelanceflow.local")
  if (admin) {
    return NextResponse.json({ message: "Admin user already exists." })
  }

  const hash = hashPw("admin123")
  const user = await createUser("admin@freelanceflow.local", "Admin", hash)

  return NextResponse.json({
    message: "Admin user created",
    email: "admin@freelanceflow.local",
    password: "admin123",
  })
}
