import { Redis } from "@upstash/redis"
import crypto from "crypto"
import path from "path"
import fs from "fs"

const isVercel = !!process.env.VERCEL
const hasRedis = !!process.env.UPSTASH_REDIS_REST_URL || !!process.env.KV_URL

if (isVercel && !hasRedis) {
  throw new Error(
    "MounaPro needs a Redis database on Vercel. " +
    "Go to https://vercel.com/fraytam/freelance-finance-toolkit/stores, " +
    "click 'Create Database', and add Upstash for Redis."
  )
}

function getRedis(): Redis {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || "",
  })
}

function getSqlite() {
  const Database = require("better-sqlite3") as any
  const dbPath = path.join(process.cwd(), "data", "mounapro.db")
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const db = new Database(dbPath)
  db.pragma("journal_mode = WAL")
  db.pragma("foreign_keys = ON")
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'user', plan TEXT NOT NULL DEFAULT 'free', created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')));
    CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
    CREATE TABLE IF NOT EXISTS reports (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, type TEXT NOT NULL, name TEXT NOT NULL, data TEXT NOT NULL, starred INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
    CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
  `)
  return db
}

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

export interface DbStats {
  totalUsers: number
  totalReports: number
  adminCount: number
  planCounts: { free: number; pro: number; enterprise: number }
}

function hashPw(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex")
}

// ---- Redis implementation ----
async function redisCreateUser(email: string, name: string, passwordHash: string): Promise<User> {
  const r = getRedis()
  const id = crypto.randomUUID()
  const count = await r.dbsize()
  const role = count === 0 ? "admin" : "user"
  const now = new Date().toISOString()
  const key = `user:${id}`
  await r.hset(key, { id, email, name, passwordHash, role, plan: "free", createdAt: now, updatedAt: now })
  await r.sadd("users", id)
  await r.hset(`user:email:${email}`, { id })
  return { id, email, name, role, plan: "free", createdAt: now }
}

async function redisFindUserByEmail(email: string): Promise<User | null> {
  const r = getRedis()
  const info = await r.hgetall(`user:email:${email}`) as any
  if (!info?.id) return null
  const u = await r.hgetall(`user:${info.id}`) as any
  if (!u) return null
  return { id: u.id, email: u.email, name: u.name, role: u.role, plan: u.plan, createdAt: u.createdAt }
}

async function redisFindUserById(id: string): Promise<User | null> {
  const r = getRedis()
  const u = await r.hgetall(`user:${id}`) as any
  if (!u?.id) return null
  return { id: u.id, email: u.email, name: u.name, role: u.role, plan: u.plan, createdAt: u.createdAt }
}

async function redisGetUserPasswordHash(email: string): Promise<string | null> {
  const r = getRedis()
  const info = await r.hgetall(`user:email:${email}`) as any
  if (!info?.id) return null
  const hash = await r.hget(`user:${info.id}`, "passwordHash") as string
  return hash || null
}

async function redisCreateSession(userId: string): Promise<Session> {
  const r = getRedis()
  const id = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  const key = `session:${id}`
  await r.hset(key, { id, userId, expiresAt, createdAt: new Date().toISOString() })
  await r.expireat(key, Math.floor(new Date(expiresAt).getTime() / 1000))
  await r.sadd(`user:sessions:${userId}`, id)
  return { id, userId, expiresAt }
}

async function redisFindSession(id: string): Promise<Session & { userId: string } | null> {
  const r = getRedis()
  const s = await r.hgetall(`session:${id}`) as any
  if (!s?.id) return null
  if (new Date(s.expiresAt) < new Date()) {
    await r.del(`session:${id}`)
    return null
  }
  return { id: s.id, userId: s.userId, expiresAt: s.expiresAt }
}

async function redisDeleteSession(id: string) {
  const r = getRedis()
  const s = await r.hgetall(`session:${id}`) as any
  if (s?.userId) await r.srem(`user:sessions:${s.userId}`, id)
  await r.del(`session:${id}`)
}

async function redisDeleteUserSessions(userId: string) {
  const r = getRedis()
  const ids = await r.smembers(`user:sessions:${userId}`)
  if (ids.length) {
    for (const id of ids) await r.del(`session:${id}`)
    await r.del(`user:sessions:${userId}`)
  }
}

async function redisSetUserRole(userId: string, role: string) {
  const r = getRedis()
  await r.hset(`user:${userId}`, { role })
}

async function redisGetStats(): Promise<DbStats> {
  const r = getRedis()
  const ids = await r.smembers("users") as string[]
  const totalUsers = ids.length
  const reportKeys = await r.keys("report:*")
  const totalReports = reportKeys.length
  let adminCount = 0
  const planCounts = { free: 0, pro: 0, enterprise: 0 }
  for (const id of ids) {
    const u = await r.hgetall(`user:${id}`) as any
    if (u?.role === "admin") adminCount++
    if (u?.plan && u.plan in planCounts) (planCounts as any)[u.plan]++
  }
  return { totalUsers, totalReports, adminCount, planCounts }
}

async function redisFindAllUsers(): Promise<User[]> {
  const r = getRedis()
  const ids = await r.smembers("users") as string[]
  const users: User[] = []
  for (const id of ids) {
    const u = await r.hgetall(`user:${id}`) as any
    if (u) users.push({ id: u.id, email: u.email, name: u.name, role: u.role, plan: u.plan, createdAt: u.createdAt })
  }
  return users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

async function redisDeleteUserById(userId: string) {
  const r = getRedis()
  const u = await r.hgetall(`user:${userId}`) as any
  if (u?.email) await r.del(`user:email:${u.email}`)
  await redisDeleteUserSessions(userId)
  const reportIds = await r.smembers(`user:reports:${userId}`)
  for (const rid of reportIds) await r.del(`report:${rid}`)
  await r.del(`user:reports:${userId}`)
  await r.del(`user:${userId}`)
  await r.srem("users", userId)
}

async function redisFindAllReports(): Promise<Report[]> {
  const r = getRedis()
  const keys = await r.keys("report:*")
  const reports: Report[] = []
  for (const key of keys) {
    const rep = await r.hgetall(key) as any
    if (rep) {
      const u = rep.userId ? await r.hgetall(`user:${rep.userId}`) as any : null
      reports.push({
        id: rep.id, userId: rep.userId, type: rep.type, name: rep.name,
        data: rep.data, starred: Number(rep.starred) || 0,
        createdAt: rep.createdAt, userName: u?.name || "Unknown",
      })
    }
  }
  return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

async function redisDeleteReport(id: string) {
  const r = getRedis()
  const rep = await r.hgetall(`report:${id}`) as any
  if (rep?.userId) await r.srem(`user:reports:${rep.userId}`, id)
  await r.del(`report:${id}`)
}

// ---- SQLite implementation ----
const sql = {
  createUser(email: string, name: string, passwordHash: string): User {
    const db = getSqlite()
    const id = crypto.randomUUID()
    const count = (db.prepare("SELECT COUNT(*) as c FROM users").get() as any).c
    const role = count === 0 ? "admin" : "user"
    db.prepare("INSERT INTO users (id, email, name, password_hash, role) VALUES (?, ?, ?, ?, ?)").run(id, email, name, passwordHash, role)
    return { id, email, name, role, plan: "free", createdAt: new Date().toISOString() }
  },
  findUserByEmail(email: string): User | null {
    const row = getSqlite().prepare("SELECT id, email, name, role, plan, created_at as createdAt FROM users WHERE email = ?").get(email) as any
    return row || null
  },
  findUserById(id: string): User | null {
    const row = getSqlite().prepare("SELECT id, email, name, role, plan, created_at as createdAt FROM users WHERE id = ?").get(id) as any
    return row || null
  },
  getUserPasswordHash(email: string): string | null {
    const row = getSqlite().prepare("SELECT password_hash FROM users WHERE email = ?").get(email) as any
    return row?.password_hash || null
  },
  createSession(userId: string): Session {
    const db = getSqlite()
    const id = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)").run(id, userId, expiresAt)
    return { id, userId, expiresAt }
  },
  findSession(id: string): Session & { userId: string } | null {
    const row = getSqlite().prepare("SELECT id, user_id as userId, expires_at as expiresAt FROM sessions WHERE id = ? AND expires_at > datetime('now')").get(id) as any
    return row || null
  },
  deleteSession(id: string) { getSqlite().prepare("DELETE FROM sessions WHERE id = ?").run(id) },
  deleteUserSessions(userId: string) { getSqlite().prepare("DELETE FROM sessions WHERE user_id = ?").run(userId) },
  setUserRole(userId: string, role: string) { getSqlite().prepare("UPDATE users SET role = ? WHERE id = ?").run(role, userId) },
  getStats(): DbStats {
    const db = getSqlite()
    const totalUsers = (db.prepare("SELECT COUNT(*) as c FROM users").get() as any).c
    const totalReports = (db.prepare("SELECT COUNT(*) as c FROM reports").get() as any).c
    const adminCount = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role = 'admin'").get() as any).c
    const plans = db.prepare("SELECT plan, COUNT(*) as count FROM users GROUP BY plan").all() as any[]
    const planCounts = { free: 0, pro: 0, enterprise: 0 }
    for (const p of plans) { if (p.plan in planCounts) (planCounts as any)[p.plan] = p.count }
    return { totalUsers, totalReports, adminCount, planCounts }
  },
  findAllUsers(): User[] {
    return getSqlite().prepare("SELECT id, email, name, role, plan, created_at as createdAt FROM users ORDER BY created_at DESC").all() as User[]
  },
  deleteUserById(userId: string) {
    const db = getSqlite()
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId)
    db.prepare("DELETE FROM reports WHERE user_id = ?").run(userId)
    db.prepare("DELETE FROM users WHERE id = ?").run(userId)
  },
  findAllReports(): Report[] {
    return getSqlite().prepare("SELECT r.id, r.user_id as userId, r.type, r.name, r.data, r.starred, r.created_at as createdAt, u.name as userName FROM reports r LEFT JOIN users u ON r.user_id = u.id ORDER BY r.created_at DESC").all() as Report[]
  },
  deleteReport(id: string) { getSqlite().prepare("DELETE FROM reports WHERE id = ?").run(id) },
}

const db = hasRedis
  ? {
      createUser: redisCreateUser,
      findUserByEmail: redisFindUserByEmail,
      findUserById: redisFindUserById,
      getUserPasswordHash: redisGetUserPasswordHash,
      createSession: redisCreateSession,
      findSession: redisFindSession,
      deleteSession: redisDeleteSession,
      deleteUserSessions: redisDeleteUserSessions,
      setUserRole: redisSetUserRole,
      getStats: redisGetStats,
      findAllUsers: redisFindAllUsers,
      deleteUserById: redisDeleteUserById,
      findAllReports: redisFindAllReports,
      deleteReport: redisDeleteReport,
    }
  : { ...sql }

const wrapAsync = <T extends (...args: any[]) => any>(fn: T): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return async (...args: Parameters<T>) => fn(...args)
}

export const createUser = wrapAsync(db.createUser)
export const findUserByEmail = wrapAsync(db.findUserByEmail)
export const findUserById = wrapAsync(db.findUserById)
export const getUserPasswordHash = wrapAsync(db.getUserPasswordHash)
export const createSession = wrapAsync(db.createSession)
export const findSession = wrapAsync(db.findSession)
export const deleteSession = wrapAsync(db.deleteSession)
export const deleteUserSessions = wrapAsync(db.deleteUserSessions)
export const setUserRole = wrapAsync(db.setUserRole)
export const getStats = wrapAsync(db.getStats)
export const findAllUsers = wrapAsync(db.findAllUsers)
export const deleteUserById = wrapAsync(db.deleteUserById)
export const findAllReports = wrapAsync(db.findAllReports)
export const deleteReport = wrapAsync(db.deleteReport)
