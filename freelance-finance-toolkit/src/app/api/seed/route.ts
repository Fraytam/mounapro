import { NextResponse } from "next/server"
import crypto from "crypto"
import { createUser, findUserByEmail } from "@/lib/db"

export async function GET() {
  const admin = await findUserByEmail("admin@freelanceflow.local")
  if (admin) {
    return NextResponse.json({ message: "Admin user already exists." })
  }

  const hash = crypto.createHash("sha256").update("admin123").digest("hex")
  const user = await createUser("admin@freelanceflow.local", "Admin", hash)

  return NextResponse.json({
    message: "Admin user created",
    email: "admin@freelanceflow.local",
    password: "admin123",
  })
}
