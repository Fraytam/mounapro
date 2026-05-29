import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const dbPath = path.join(process.cwd(), "data", "mounapro.db")

function getDb() {
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const db = new Database(dbPath)
  db.pragma("journal_mode = WAL")
  db.pragma("foreign_keys = ON")
  return db
}

const db = getDb()

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    plan TEXT NOT NULL DEFAULT 'free',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    name TEXT NOT NULL,
    data TEXT NOT NULL,
    starred INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
`)

export interface User {
  id: string
  email: string
  name: string
  role: string
  plan: string
  createdAt: string
}

export interface Session {
  id: string
  userId: string
  expiresAt: string
}

export function createUser(email: string, name: string, passwordHash: string): User {
  const id = crypto.randomUUID()
  const count = db.prepare("SELECT COUNT(*) as c FROM users").get() as any
  const role = count.c === 0 ? "admin" : "user"
  const stmt = db.prepare("INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)")
  stmt.run(id, email, name, passwordHash, role)
  return { id, email, name, role, plan: "free", createdAt: new Date().toISOString() }
}

export function findUserByEmail(email: string): User | null {
  const row = db.prepare("SELECT id, email, name, role, plan, created_at as createdAt FROM users WHERE email = ?").get(email) as any
  return row || null
}

export function findUserById(id: string): User | null {
  const row = db.prepare("SELECT id, email, name, role, plan, created_at as createdAt FROM users WHERE id = ?").get(id) as any
  return row || null
}

export function getUserPasswordHash(email: string): string | null {
  const row = db.prepare("SELECT password_hash FROM users WHERE email = ?").get(email) as any
  return row?.password_hash || null
}

export function createSession(userId: string): Session {
  const id = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(id, userId, expiresAt)
  return { id, userId, expiresAt }
}

export function findSession(id: string): Session & { userId: string } | null {
  const row = db.prepare("SELECT id, user_id as userId, expires_at as expiresAt FROM sessions WHERE id = ? AND expires_at > datetime('now')").get(id) as any
  return row || null
}

export function deleteSession(id: string) {
  db.prepare("DELETE FROM sessions WHERE id = ?").run(id)
}

export function deleteUserSessions(userId: string) {
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId)
}

export function setUserRole(userId: string, role: string) {
  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, userId)
}

export interface DbStats {
  totalUsers: number
  totalReports: number
  adminCount: number
  planCounts: { free: number; pro: number; enterprise: number }
}

export function getStats(): DbStats {
  const totalUsers = (db.prepare("SELECT COUNT(*) as c FROM users").get() as any).c
  const totalReports = (db.prepare("SELECT COUNT(*) as c FROM reports").get() as any).c
  const adminCount = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'admin'").get() as any).c
  const plans = db.prepare("SELECT plan, COUNT(*) as count FROM users GROUP BY plan").all() as any[]
  const planCounts = { free: 0, pro: 0, enterprise: 0 }
  for (const p of plans) {
    if (p.plan in planCounts) (planCounts as any)[p.plan] = p.count
  }
  return { totalUsers, totalReports, adminCount, planCounts }
}

export function findAllUsers(): User[] {
  return db.prepare("SELECT id, email, name, role, plan, created_at as createdAt FROM users ORDER BY created_at DESC").all() as User[]
}

export function deleteUserById(userId: string) {
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId)
  db.prepare("DELETE FROM reports WHERE user_id = ?").run(userId)
  db.prepare("DELETE FROM users WHERE id = ?").run(userId)
}

export interface Report {
  id: string
  userId: string
  type: string
  name: string
  data: string
  starred: number
  createdAt: string
  userName?: string
}

export function findAllReports(): Report[] {
  return db.prepare(`
    SELECT r.id, r.user_id as userId, r.type, r.name, r.data, r.starred, r.created_at as createdAt, u.name as userName
    FROM reports r LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `).all() as Report[]
}

export function deleteReport(id: string) {
  db.prepare("DELETE FROM reports WHERE id = ?").run(id)
}
