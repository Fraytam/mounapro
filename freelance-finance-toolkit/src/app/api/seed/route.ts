import { NextResponse } from "next/server"
import Database from "better-sqlite3"
import path from "path"
import fs from "fs"
import crypto from "crypto"

const dbPath = path.join(process.cwd(), "data", "freelanceflow.db")

export async function GET() {
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const db = new Database(dbPath)

  const count = (db.prepare("SELECT COUNT(*) as c FROM users").get() as any).c
  if (count > 0) {
    db.close()
    return NextResponse.json({ message: "Users already exist. First user is already seeded." })
  }

  const id = crypto.randomUUID()
  const hash = crypto.createHash("sha256").update("admin123").digest("hex")
  db.prepare("INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, 'admin')").run(
    id, "admin@freelanceflow.local", "Admin", hash
  )
  db.close()

  return NextResponse.json({
    message: "Admin user created",
    email: "admin@freelanceflow.local",
    password: "admin123",
  })
}
